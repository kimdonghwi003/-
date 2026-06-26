import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import librosa
import numpy as np
import os
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_song(file: UploadFile = File(...)):
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        print(f"[{file.filename}] 보컬 분리 시작...")
        import sys
        subprocess.run([sys.executable, "-m", "demucs.separate", "-n", "htdemucs", "-d", "cuda", temp_filename], check=True)
        
        vocal_path = f"separated/htdemucs/{temp_filename.rsplit('.', 1)[0]}/vocals.wav"
        
        print("보컬 음역대 분석 중...")
        y, sr = librosa.load(vocal_path, sr=None)
        y_down = librosa.resample(y, orig_sr=sr, target_sr=11025)
        
        f0, voiced_flag, voiced_probs = librosa.pyin(
            y_down, 
            fmin=librosa.note_to_hz('C3'), 
            fmax=librosa.note_to_hz('C7'),
            sr=11025
        )
        
        valid_f0 = f0[voiced_flag]
        valid_f0 = valid_f0[~np.isnan(valid_f0)]
        
        if len(valid_f0) > 0:
            valid_f0.sort()
            highest_f0 = valid_f0[int(len(valid_f0) * 0.98)]
            lowest_f0 = valid_f0[int(len(valid_f0) * 0.05)]
            
            highest_midi = int(round(librosa.hz_to_midi(highest_f0)))
            lowest_midi = int(round(librosa.hz_to_midi(lowest_f0)))

            # ── 1. Pitch Stability Score (음정 안정성) ──
            midi_exact = librosa.hz_to_midi(valid_f0)
            midi_rounded = np.round(midi_exact)
            pitch_error_cents = np.abs(midi_exact - midi_rounded) * 100
            mean_cents_error = float(np.mean(pitch_error_cents))
            pitch_score = int(np.clip(100 - (mean_cents_error * 1.6), 45, 98))

            # ── 2. Rhythm Accuracy Score (박자 정확도) ──
            onset_env = librosa.onset.onset_strength(y=y_down, sr=11025)
            tempo, beats = librosa.beat.beat_track(onset_envelope=onset_env, sr=11025)
            if len(beats) > 2:
                beat_times = librosa.frames_to_time(beats, sr=11025)
                intervals = np.diff(beat_times)
                cv = float(np.std(intervals) / (np.mean(intervals) + 1e-6))
                rhythm_score = int(np.clip(100 - (cv * 120), 50, 97))
            else:
                rhythm_score = 75

            # ── 3. Volume Dynamics Score (성량 다이나믹) ──
            rms = librosa.feature.rms(y=y_down)[0]
            p95, p10 = np.percentile(rms, 95), np.percentile(rms, 10)
            dyn_ratio = float(p95 / (p10 + 1e-6))
            volume_score = int(np.clip(55 + (np.log10(dyn_ratio) * 28), 50, 96))

            # ── 4. Timbre Consistency Score (음색 균일성) ──
            cent = librosa.feature.spectral_centroid(y=y_down, sr=11025)[0]
            cent_cv = float(np.std(cent) / (np.mean(cent) + 1e-6))
            timbre_score = int(np.clip(96 - (cent_cv * 45), 58, 95))
            
            overall_score = int(round((pitch_score + rhythm_score + volume_score + timbre_score) / 4))
        else:
            highest_midi, lowest_midi = 0, 0
            pitch_score, rhythm_score, volume_score, timbre_score, overall_score = 0, 0, 0, 0, 0
            
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if os.path.exists("separated"):
            shutil.rmtree("separated")
            
    return {
        "highest_midi": highest_midi,
        "lowest_midi": lowest_midi,
        "vocal_highest_note": librosa.midi_to_note(highest_midi) if highest_midi > 0 else "-",
        "pitch_score": pitch_score,
        "rhythm_score": rhythm_score,
        "volume_score": volume_score,
        "timbre_score": timbre_score,
        "overall_score": overall_score,
        "message": "success"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
