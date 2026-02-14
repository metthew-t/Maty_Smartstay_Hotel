import urllib.request
import urllib.error

def check_url(url, name):
    try:
        print(f"Checking {name} at {url}...")
        with urllib.request.urlopen(url) as response:
            print(f"{name} is UP. Status: {response.status}")
            return True
    except urllib.error.HTTPError as e:
        print(f"{name} is UP but returned status: {e.code}")
        return True
    except urllib.error.URLError as e:
        print(f"{name} is DOWN. Reason: {e.reason}")
        return False
    except Exception as e:
        print(f"{name} check failed: {e}")
        return False

def main():
    backend_up = check_url("http://localhost:8000/admin/login/", "Backend (Admin)")
    frontend_up = check_url("http://localhost:3000", "Frontend (Home)")
    
    if backend_up and frontend_up:
        print("\nSUCCESS: Both servers are running.")
    else:
        print("\nFAILURE: One or more servers are not reachable.")

if __name__ == "__main__":
    main()
