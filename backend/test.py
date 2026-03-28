import urllib.request
import json
import urllib.error
req = urllib.request.Request(
    'http://localhost:8000/auth/register',
    data=json.dumps({'full_name':'T','email':'t@e.com','age':25,'gender':'male','password':'p'}).encode('utf-8'),
    headers={'Content-Type':'application/json'}
)
try:
    with urllib.request.urlopen(req) as response:
        print("Success:", response.read().decode())
except urllib.error.HTTPError as e:
    print("Error body:", e.read().decode())
