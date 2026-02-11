import requests

url = "http://localhost:8000/api/chat/chat/"
data = {"message": "hello"}

# Assuming we need a token (the view has IsAuthenticated)
# Let's try to get a token first or just bypass it for a moment if possible? 
# Wait, I'll just check if I can get a token from the test staff account.
print("Attempting to test chat API...")
try:
    # First, login to get a token
    login_url = "http://localhost:8000/api/auth/login/"
    login_data = {"email": "guest@example.com", "password": "Password123!"}
    login_res = requests.post(login_url, json=login_data)
    
    if login_res.status_code == 200:
        token = login_res.json().get('access')
        headers = {"Authorization": f"Bearer {token}"}
        res = requests.post(url, json=data, headers=headers)
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.text}")
    else:
        print(f"Login failed: {login_res.status_code} - {login_res.text}")
        
except Exception as e:
    print(f"Error: {e}")
