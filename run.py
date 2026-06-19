import subprocess
import time
import urllib.request
import os
import sys
import re

print("1. 터널링 프로그램 준비 중...")
if not os.path.exists("cloudflared"):
    urllib.request.urlretrieve("https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64", "cloudflared")
    os.system("chmod +x cloudflared")

print("2. 파이썬 AI 서버 시작 중...")
# Start uvicorn explicitly to be safe
server_process = subprocess.Popen([sys.executable, "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"], stdout=sys.stdout, stderr=sys.stderr)
time.sleep(3) # Wait for server to boot

# Check if server crashed instantly
if server_process.poll() is not None:
    print("❌ 치명적 오류: AI 서버가 즉시 종료되었습니다. 코랩 환경 문제일 수 있습니다.")
    sys.exit(1)

print("3. 클라우드플레어 터널 연결 중...")
tunnel_process = subprocess.Popen(["./cloudflared", "tunnel", "--url", "http://127.0.0.1:8000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

url = None
start_time = time.time()
while time.time() - start_time < 15:
    line = tunnel_process.stderr.readline()
    if line:
        sys.stdout.write("[터널] " + line)
        match = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", line)
        if match:
            url = match.group(0)
            break

if url:
    print("\n" + "="*60)
    print("✅ 성공! 아래 주소를 복사하세요:")
    print(f"👉  {url}  👈")
    print("="*60 + "\n")
    
    # Keep alive and print logs
    while True:
        time.sleep(1)
        if server_process.poll() is not None:
            print("\n❌ 오류: 서버가 도중에 종료되었습니다!")
            break
else:
    print("\n❌ 터널 주소를 찾지 못했습니다. 터널 연결 실패.")
    # Print remaining tunnel logs
    for line in tunnel_process.stderr.readlines():
        sys.stdout.write("[터널] " + line)
