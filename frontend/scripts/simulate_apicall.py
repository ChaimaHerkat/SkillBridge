import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError

API = 'http://127.0.0.1:8000/api/auth/register'

payload = {
    "email": "badrole@example.com",
    "password": "password123",
    "firstName": "Bad",
    "lastName": "Role",
    "role": "client"  # intentionally lower-case to trigger validation error
}

req = Request(API, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type':'application/json'})

try:
    resp = urlopen(req)
    body = resp.read().decode('utf-8')
    print('Success:', body)
except HTTPError as e:
    text = e.read().decode('utf-8')
    try:
        body = json.loads(text) if text else None
    except Exception:
        body = text

    # Format message similarly to frontend apiCall
    if body:
        if isinstance(body, str):
            message = body
        elif isinstance(body, dict):
            if 'detail' in body:
                message = str(body['detail'])
            else:
                parts = []
                for k, v in body.items():
                    if isinstance(v, list):
                        parts.append(f"{k}: {', '.join(map(str,v))}")
                    else:
                        parts.append(f"{k}: {v}")
                message = ' | '.join(parts) if parts else 'Registration failed.'
        else:
            message = 'Registration failed.'
    else:
        message = f'HTTP {e.code} {e.reason}'

    print('Formatted message:', message)
