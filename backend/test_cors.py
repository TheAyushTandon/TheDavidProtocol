import urllib.request
req = urllib.request.Request(
    'http://localhost:8000/auth/register',
    method='OPTIONS',
    headers={
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
    }
)
try:
    with urllib.request.urlopen(req) as response:
        print("CORS Success Status Code:", response.status)
        print("CORS Headers:", response.headers.items())
except Exception as e:
    print("CORS Failed:", e)
