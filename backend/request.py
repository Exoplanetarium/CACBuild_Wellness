import requests
import os

def check_audio_status(audio_id):
    url = f"https://suno-api-iota-henna.vercel.app/api/get?ids={audio_id}"
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        print(data)
        if data and "audio_url" in data[0] and data[0]["audio_url"]:
            audio_url = data[0]["audio_url"]
            print("Audio URL:", audio_url)
            save_audio_file(audio_url, audio_id)
        else:
            print("Audio generation is not complete yet. Status:", data[0].get("status", "Unknown"))
    except requests.exceptions.RequestException as e:
        print(f"Error checking audio status: {e}")

def save_audio_file(audio_url, audio_id):
    try:
        response = requests.get(audio_url, stream=True)
        response.raise_for_status()
        os.makedirs("static", exist_ok=True)
        file_path = os.path.join("static", f"{audio_id}.mp3")
        with open(file_path, "wb") as audio_file:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    audio_file.write(chunk)
        print(f"Audio file saved to {file_path}")
    except requests.exceptions.RequestException as e:
        print(f"Error downloading audio file: {e}")

audio_id = "586fc4d5-17cd-4944-a91c-5bfc168acc38"  # Replace with your actual audio ID
check_audio_status(audio_id)
