import requests

url = "http://127.0.0.1:8000/generate-image/"

file_paths = ["pranjal.webp", "suit_jacket.jpg", "suit_pants.webp"]
files = [("files", (path, open(path, "rb"), "image/webp")) for path in file_paths]

data = {
    "premade": "false",
    "image_name": "suited_pranjal"
}

response = requests.post(url, files=files, data=data)

print(response.json())
