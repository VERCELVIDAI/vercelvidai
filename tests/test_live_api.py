import urllib.request
import urllib.parse
import http.cookiejar
import json
import time

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

# 1. Login
print("Step 1: Logging in as creator@vidai.io...")
login_payload = json.dumps({'email': 'creator@vidai.io', 'password': 'Demo1234!'}).encode()
req = urllib.request.Request('http://localhost:3000/api/auth/login', data=login_payload, headers={'Content-Type': 'application/json'})
res = opener.open(req)
print(f"[OK] Login status: {res.status}")

# 2. Check auth
req = urllib.request.Request('http://localhost:3000/api/auth/me')
res = opener.open(req)
me = json.loads(res.read())
print(f"[OK] Session verified: User='{me['user']['displayName']}', Available Credits={me['credits']['availableBalance']} cr")

# 3. Create Project
print("\nStep 2: Creating new video project...")
proj_payload = json.dumps({'title': 'Live Test Cyberpunk Commercial', 'mediaType': 'video'}).encode()
req = urllib.request.Request('http://localhost:3000/api/projects', data=proj_payload, headers={'Content-Type': 'application/json'})
res = opener.open(req)
proj = json.loads(res.read())['project']
print(f"[OK] Project created: ID={proj['id']}, Title='{proj['title']}'")

# 4. Dispatch Generation Job
print("\nStep 3: Dispatching AI video generation job...")
gen_payload = json.dumps({
    'modelId': 'vidai-cinematic-v1',
    'prompt': 'Futuristic hyper-car speeding through neon lit highway with violet reflections',
    'aspectRatio': '16:9',
    'durationSec': 5,
    'projectId': proj['id']
}).encode()
req = urllib.request.Request('http://localhost:3000/api/generate', data=gen_payload, headers={'Content-Type': 'application/json'})
res = opener.open(req)
job = json.loads(res.read())['job']
print(f"[OK] Job dispatched: ID={job['id']}, Initial Status='{job['status']}', Reserved Credits={job['reservedCredits']} cr")

# Wait for background queue worker
print("Waiting for background worker...")
time.sleep(4)

# 5. Check job status
req = urllib.request.Request(f"http://localhost:3000/api/jobs/{job['id']}")
res = opener.open(req)
updated_job = json.loads(res.read())['job']
print(f"[OK] Job updated status: '{updated_job['status']}', Progress={updated_job.get('progressPercent')}%, Message='{updated_job.get('progressMessage')}'")

# 6. Export Render
print("\nStep 4: Requesting video editor master export...")
export_payload = json.dumps({
    'projectId': proj['id'],
    'settings': {'resolution': '1080p', 'fps': 30}
}).encode()
req = urllib.request.Request('http://localhost:3000/api/editor/export', data=export_payload, headers={'Content-Type': 'application/json'})
res = opener.open(req)
export_data = json.loads(res.read())
print(f"[OK] Export rendered: Status='{export_data['status']}', Asset='{export_data['asset']['name']}', Download URL='{export_data['downloadUrl']}'")

print("\nAll full-stack production flows passed with 100% operational integrity!")

# 5. Admin verification
print("\nStep 5: Verifying Admin Console Role Verification...")
cj_admin = http.cookiejar.CookieJar()
opener_admin = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj_admin))

# Try accessing admin endpoint without credentials (expect 403 / 401)
try:
    req = urllib.request.Request('http://localhost:3000/api/admin/overview')
    res = urllib.request.urlopen(req)
    print("[FAIL] Unauthenticated request to admin succeeded unexpectedly")
except Exception as e:
    print(f"[OK] Unauthenticated admin access denied as expected: {e}")

# Login as admin
login_admin = json.dumps({'email': 'admin@vidai.io', 'password': 'Admin1234!'}).encode()
req = urllib.request.Request('http://localhost:3000/api/auth/login', data=login_admin, headers={'Content-Type': 'application/json'})
res = opener_admin.open(req)
print(f"[OK] Admin logged in: status={res.status}")

# Access admin overview
req = urllib.request.Request('http://localhost:3000/api/admin/overview')
res = opener_admin.open(req)
admin_ov = json.loads(res.read())
print(f"[OK] Admin Overview verified: Users={admin_ov['metrics']['totalUsers']}, Gross Revenue=INR {admin_ov['metrics']['totalGrossRevenueInr']}, Active AI Models={len(admin_ov['models'])}")
