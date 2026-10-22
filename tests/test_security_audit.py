import urllib.request
import urllib.parse
import http.cookiejar
import json
import base64
import hmac
import hashlib

BASE_URL = 'http://localhost:3000'

def test_security_suite():
    print("==================================================================")
    print("  VERCEL VIDAI — SECURITY AUDIT & AUTHORIZATION VERIFICATION")
    print("==================================================================")
    passed = 0
    failed = 0

    def assert_test(cond, title):
        nonlocal passed, failed
        if cond:
            print(f"  + [PASS] {title}")
            passed += 1
        else:
            print(f"  - [FAIL] {title}")
            failed += 1

    # 1. Test Unauthenticated Requests
    print("\n--- 1. Unauthenticated Endpoint Protection ---")
    try:
        req = urllib.request.Request(f"{BASE_URL}/api/projects")
        urllib.request.urlopen(req)
        assert_test(False, "Unauthenticated GET /api/projects rejected with 401")
    except urllib.error.HTTPError as e:
        assert_test(e.code == 401, f"Unauthenticated GET /api/projects rejected with 401 (got {e.code})")

    try:
        req = urllib.request.Request(f"{BASE_URL}/api/assets")
        urllib.request.urlopen(req)
        assert_test(False, "Unauthenticated GET /api/assets rejected with 401")
    except urllib.error.HTTPError as e:
        assert_test(e.code == 401, f"Unauthenticated GET /api/assets rejected with 401 (got {e.code})")

    # 2. Login as Creator
    print("\n--- 2. Creator Authentication & Signed Session Token ---")
    cj_creator = http.cookiejar.CookieJar()
    opener_creator = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj_creator))

    login_body = json.dumps({'email': 'creator@vidai.io', 'password': 'Demo1234!'}).encode()
    req = urllib.request.Request(f"{BASE_URL}/api/auth/login", data=login_body, headers={'Content-Type': 'application/json'})
    res = opener_creator.open(req)
    assert_test(res.status == 200, "Creator login succeeds with 200 OK")

    # Check that session cookie exists and contains HMAC signature dot
    session_cookie = None
    for cookie in cj_creator:
        if cookie.name == 'vidai_session':
            session_cookie = cookie.value
    assert_test(session_cookie is not None and '.' in urllib.parse.unquote(session_cookie), "Session cookie is cryptographically signed (contains '.' separator)")

    # 3. Test Session Tampering Rejection
    print("\n--- 3. Session Cookie Tampering Attack Rejection ---")
    # Attempt to forge admin role by modifying token payload
    unquoted = urllib.parse.unquote(session_cookie)
    payload_b64, sig = unquoted.split('.', 1)
    # decode, tamper role to admin, re-encode
    raw_json = json.loads(base64.b64decode(payload_b64).decode())
    raw_json['role'] = 'admin'
    tampered_payload_b64 = base64.b64encode(json.dumps(raw_json).encode()).decode()
    tampered_cookie_val = f"{tampered_payload_b64}.{sig}" # signature no longer matches!

    req_tamper = urllib.request.Request(f"{BASE_URL}/api/admin/overview", headers={'Cookie': f"vidai_session={tampered_cookie_val}"})
    try:
        urllib.request.urlopen(req_tamper)
        assert_test(False, "Tampered session cookie rejected")
    except urllib.error.HTTPError as e:
        assert_test(e.code in (401, 403), f"Tampered session cookie rejected with HTTP {e.code}")

    # 4. Test Asset Upload and Deletion
    print("\n--- 4. Asset Creation and Ownership-Enforced Deletion ---")
    asset_body = json.dumps({
        'name': 'Test Ownership Video.mp4',
        'assetType': 'video',
        'url': 'https://assets.mixkit.co/videos/preview/mixkit-running-through-the-city-at-sunset-41662-large.mp4'
    }).encode()
    req_upload = urllib.request.Request(f"{BASE_URL}/api/assets", data=asset_body, headers={'Content-Type': 'application/json'})
    res_upload = opener_creator.open(req_upload)
    uploaded_asset = json.loads(res_upload.read())['asset']
    assert_test(uploaded_asset['name'] == 'Test Ownership Video.mp4', "Asset created successfully")

    # Delete asset with creator credentials
    del_body = json.dumps({'id': uploaded_asset['id']}).encode()
    req_del = urllib.request.Request(f"{BASE_URL}/api/assets", data=del_body, headers={'Content-Type': 'application/json'}, method='DELETE')
    res_del = opener_creator.open(req_del)
    del_result = json.loads(res_del.read())
    assert_test(del_result.get('success') is True, "Asset deleted by authorized owner")

    # 5. Test Webhook Signature Enforcement
    print("\n--- 5. Webhook Cryptographic Verification ---")
    # Request without signature header should return 400
    req_wh_no_sig = urllib.request.Request(f"{BASE_URL}/api/payments/webhook", data=b'{"event":"test"}', headers={'Content-Type': 'application/json'})
    try:
        urllib.request.urlopen(req_wh_no_sig)
        assert_test(False, "Webhook without signature header rejected")
    except urllib.error.HTTPError as e:
        assert_test(e.code == 400, f"Webhook without signature header returns 400 (got {e.code})")

    # Request with invalid signature should return 400
    req_wh_bad_sig = urllib.request.Request(
        f"{BASE_URL}/api/payments/webhook",
        data=b'{"event":"test"}',
        headers={'Content-Type': 'application/json', 'x-razorpay-signature': 'forged_fake_sig'}
    )
    try:
        urllib.request.urlopen(req_wh_bad_sig)
        assert_test(False, "Webhook with invalid signature rejected")
    except urllib.error.HTTPError as e:
        assert_test(e.code == 400, f"Webhook with forged signature returns 400 (got {e.code})")

    # Request with valid signature
    secret = 'vidai_webhook_secret_789'
    wh_payload = b'{"event":"payment.captured","id":"wh_test_live_audit_1"}'
    valid_sig = hmac.new(secret.encode(), wh_payload, hashlib.sha256).hexdigest()
    req_wh_valid = urllib.request.Request(
        f"{BASE_URL}/api/payments/webhook",
        data=wh_payload,
        headers={'Content-Type': 'application/json', 'x-razorpay-signature': valid_sig}
    )
    res_wh = urllib.request.urlopen(req_wh_valid)
    assert_test(res_wh.status == 200, "Webhook with valid HMAC SHA-256 signature accepted with 200 OK")

    print("\n==================================================================")
    print(f"  SECURITY AUDIT RESULTS: {passed} PASSED, {failed} FAILED")
    print("==================================================================")
    if failed > 0:
        exit(1)

if __name__ == '__main__':
    test_security_suite()
