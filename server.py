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
        else:
            highest_midi = 0
            lowest_midi = 0
            
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if os.path.exists("separated"):
            shutil.rmtree("separated")
            
    return {
        "highest_midi": highest_midi,
        "lowest_midi": lowest_midi,
        "vocal_highest_note": librosa.midi_to_note(highest_midi) if highest_midi > 0 else "-",
        "message": "success"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
