from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torchaudio
from audiocraft.models import MusicGen
import os

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate_music():
    data = request.json
    descriptions = data.get('descriptions', ['ambient'])
    model = MusicGen.get_pretrained('facebook/musicgen-medium')
    model.set_generation_params(duration=10)
    wav = model.generate(descriptions)

    file_path = "output.wav"
    torchaudio.save(file_path, wav, 16000)
    
    return send_file(file_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
