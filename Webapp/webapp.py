from flask import Flask
from RecognitionTracking import Detector, Tracker
from flask import Flask, render_template, Response, request
import webbrowser
import threading
import logging


# config = {'videopath':None, 'state':0, 'minSizeSlider':0, 'maxSizeSlider':0, 'firstFrame':0}


import cv2

class VideoFeed(object):
    def __init__(self):
        self.videopath = None
        self.state = 0
        self.minSizeSlider = 0
        self.maxSizeSlider = 0
        self.firstFrame = 0
        self.lastFrame = None
        self.videolength = None
        self.countimage = 0
        self.maxParticles = 200
        self.numParticles = 0
        self.config = {'videopath':self.videopath,
                    'state':self.state,
                    'minSizeSlider':self.minSizeSlider,
                    'maxSizeSlider':self.maxSizeSlider,
                    'firstFrame':self.firstFrame,
                    'lastFrame':self.lastFrame
                    }
        self.video = cv2.VideoCapture(self.videopath)



    def __setitem__(self, key, value):
        if key == 'videopath':
            if value == 'reset':
                self.videopath = None
                self.state = 0
            else:
                self.videopath = value.split('\\')[-1]
                self.video = cv2.VideoCapture(self.videopath)
                self.videolength = int(self.video.get(cv2.CAP_PROP_FRAME_COUNT))
        if key == 'state':
            self.state = int(value)
        if key == 'minSizeSlider':
            self.minSizeSlider = int(value)
        if key == 'maxSizeSlider':
            self.maxSizeSlider = int(value)
        if key == 'firstFrame':
            self.firstFrame = int(value)
        if key == 'lastFrame':
            self.lastFrame = int(value)
        if key == 'maxParticles':
            self.maxParticles = int(value)


    def __del__(self):
        self.video.release()

    def get_frame(self):
        success, image = self.video.read()
        ret, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()


    def preview(self):
        detector = Detector(self.videopath, int(self.minSizeSlider), int(self.minSizeSlider))
        detector.logger.setLevel(logging.WARNING)
        last_maxSize = None
        last_minSize = None

        while not self.state:

            # if (last_maxSize != int(self.maxSizeSlider)) or (last_minSize != int(self.minSizeSlider) or (last_firstFrame != self.firstFrame)):
            # print("changed")
            detector.minSize = int(self.minSizeSlider)
            detector.maxSize = int(self.maxSizeSlider)
            detector.maxParticles = int(self.maxParticles)
            print(detector.maxParticles)
            detector.detect(frame=int(self.firstFrame))
            ret, jpeg = cv2.imencode('.jpg', detector.preview)
            frame = jpeg.tobytes()
            last_minSize = detector.minSize
            last_maxSize = detector.maxSize
            last_firstFrame = self.firstFrame
            self.numParticles = len(detector.circles)

            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

    def runAnalysis(self):
        print('runAnalysis')
        self.tracker = Tracker(self.videopath, self.minSizeSlider, self.maxSizeSlider, self.firstFrame, self.maxParticles)
        for frame in self.tracker.track():
                ret, jpeg = cv2.imencode('.jpg', frame)
                frame = jpeg.tobytes()
                self.countimage = self.tracker.countimage
                print('in run analysis',self.countimage)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')



    def display(self):
        print(self.state)
        if self.state == 0:
            return Response(self.preview(),
                            mimetype='multipart/x-mixed-replace; boundary=frame')
        elif self.state == 1:
            return Response(self.runAnalysis(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')




def recieveFromJs(request):
    global videofeed
    if request.is_json:
        print('json')
        data = request.get_json()
        print('data',data)
        for key, value in data.items():
            videofeed[key] = value

    else:
        try:
            print('no json')
            data = request.form['myFile']
            print('data',data)

            if data == 'Reset videopath':
                videofeed['videopath'] = None
            else:
                videofeed['videopath'] = data
        except:
            pass

videofeed = VideoFeed()
app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def index():
    global videofeed
    return render_template('index.html', videop=videofeed.videopath, state=videofeed.state)

@app.route('/preview', methods=['POST', 'GET'])
def preview():
    global videofeed
    videofeed.state = 0
    if request.method == 'POST':
        for key, value in request.form.items():
            print(key, value)
            videofeed[key] = value

        print(videofeed.videopath, videofeed.videolength)
    return render_template('preview.html', videopath=videofeed.videopath, videolength=videofeed.videolength, numParticles=videofeed.numParticles)

@app.route('/track', methods=['POST', 'GET'])
def track():
    global videofeed
    videofeed.state = 1
    if request.method == 'POST':
        for key, value in request.form.items():
            print(key, value)
            videofeed[key] = value
    try:
        ci = videofeed.tracker.countimage
    except:
        ci = 0
    print(ci)
    return render_template('track.html', videolength=videofeed.videolength, countimage=ci)

@app.route('/video_feed')
def video_feed():
    global videofeed
    return videofeed.display()

@app.route('/data')
def data():
    try:
        ci = videofeed.tracker.countimage
        print('worked')
    except:
        ci = 0
    print('ci',ci)
    s = f'''"videopath" : "{videofeed.videopath}",
            "state" : "{videofeed.state}",
            "countimage" : "{ci}",
            "videolength" : "{videofeed.videolength}"'''
    return('{' + s + '}')


if __name__ == '__main__':
    # threading.Timer(1.25, lambda: webbrowser.open('http://localhost:5000', new=2, autoraise=True) ).start()
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='localhost', debug=True)
