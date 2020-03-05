from flask import Flask
from RecognitionTracking import Detector, Tracker
from flask import Flask, render_template, Response, request
import webbrowser
import threading
import logging


config = {'videopath':None, 'state':'setup', 'minSizeSlider':0, 'maxSizeSlider':0, 'frameSlider':0}


import cv2

class Video(object):
    def __init__(self, videopath):

        self.video = cv2.VideoCapture(videopath)

    def __del__(self):
        self.video.release()

    def __getitem__(self, key):
        f = self.video.get(key)
        success, image = self.video.read()
        ret, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()

    def get_frame(self):
        success, image = self.video.read()
        ret, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()



def gen(video):
    while True:
        frame = video.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def stillframe(video, i):
    detector = Detector(config['videopath'], int(config['minSizeSlider']), int(config['maxSizeSlider']))
    detector.logger.setLevel(logging.WARNING)
    while True:

        detector.minSize = int(config['minSizeSlider'])
        detector.maxSize = int(config['maxSizeSlider'])
        detector.detect(frame=int(config['frameSlider']))
        ret, jpeg = cv2.imencode('.jpg', detector.preview)
        frame = jpeg.tobytes()

        yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


def recieveFromJs(request):
    global config
    if request.is_json:
        data = request.get_json()
        key = list(data.keys())[0]
        value = list(data.values())[0]
        config[key] = value
        print(config)
    else:
        config['videopath'] = request.form['myFile']
        if config['videopath'] == 'Reset videopath':
            config['videopath'] = None



app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        recieveFromJs(request)
    else:
        pass
    return render_template('index.html', videop=config['videopath'], state=config['state'])


@app.route('/video_feed')
def video_feed():
	global config
	if config['state'] == 'setup':
		return Response(stillframe(Video(config['videopath']), 0),
	                    mimetype='multipart/x-mixed-replace; boundary=frame')
	elif config['state'] == 'run':
		return Response(gen(Video(config['videopath'])),
                mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
	# threading.Timer(1.25, lambda: webbrowser.open('http://localhost:5000', new=2, autoraise=True) ).start()
	app.run(host='localhost', debug=True)
