import speech_recognition as sr
from flask import Flask, request,  jsonify, redirect
I

app = Flask(__name__)


r = sr.Recognizer()


@app.route('/transcribe/', methods=['POST'])
def transcribe():

    transcript = ""
    # if request.method == "POST":
    #             print("FORM DATA RECEIVED")
    file = request.files["file"]

    if "file" not in request.files:
        return redirect(request.url)

    if file.filename == "":
        return redirect(request.url)

    if file:
        recognizer = sr.Recognizer()
        audioFile = sr.AudioFile(file)
        with audioFile as source:
            data = recognizer.record(source)
            transcript = recognizer.recognize_google(data, key=None)
    result = transcript,
    status = True
    print(result)
    response = jsonify(result=result, status=status)
    response.headers.add('Access-Control-Allow-Origin', '*')
    # response.headers.add('Access-Control-Allow-Origin', 'origin-list')

    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
