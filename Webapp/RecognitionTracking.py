

import cv2
import numpy as np
import xlsxwriter
import logging
import sys


handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)


class Detector:

    def __init__(self, videopath, minSize, maxSize):
        self.videopath = videopath
        self.minSize = minSize
        self.maxSize = maxSize
        self.logger = logging.getLogger(self.__class__.__name__)
        self.logger.setLevel(logging.DEBUG)
        self.logger.addHandler(handler)
        self.logger.info('Detector object created')
        self.maxParticles = 200

    def getFirstFrame(self, n=0):
        cap = cv2.VideoCapture(self.videopath)
        if n != 0:
            total_frames = cap.get(7)
            cap.set(1, n)
        success, self.frame = cap.read()
        cap.release()
        self.logger.debug('First frame extracted')

    def detect(self, frame=0):
        self.logger.info(f'Searching for circles from size {self.minSize} to {self.maxSize}')
        self.getFirstFrame(n=frame)
        img = cv2.cvtColor(self.frame, cv2.COLOR_BGR2GRAY)
        img = cv2.medianBlur(img,5)
        self.preview = cv2.cvtColor(img,cv2.COLOR_GRAY2BGR)

        circles = cv2.HoughCircles(img,cv2.HOUGH_GRADIENT,1,20,
                                    param1=50,param2=30,minRadius=self.minSize,maxRadius=self.maxSize)
        if circles is not None:
            circles = np.uint16(np.around(circles))
            for i in circles[0,:self.maxParticles]:
                cv2.circle(self.preview,(i[0],i[1]),i[2],(0,255,0),2)# draw the outer circle
                cv2.circle(self.preview,(i[0],i[1]),2,(0,0,255),3)# draw the center of the circle
        #
        # cv2.imshow('detected circles',self.preview)
        # cv2.waitKey(1)
        # cv2.destroyAllWindows()

            self.circles = circles[0:self.maxParticles]
            self.logger.info(f'{len(self.circles)} circles found')
        else:
            self.logger.info(f'0 circles found')
        return(self.circles)

class Tracker():

    def __init__(self, videopath, minSize, maxSize, firstFrame, maxParticles):
        self.videopath = videopath
        self.circle_color = (0, 255, 0)
        self.txt_color = (0, 255, 0)
        self.positions = {}
        self.detector = Detector(self.videopath, minSize, maxSize)
        self.detector.maxParticles = maxParticles
        self.circles = self.detector.detect(frame=firstFrame)[0].tolist()
        print("DSRTYUGFXDFWGUYI", len(self.circles))
        self.logger = logging.getLogger(self.__class__.__name__)
        self.logger.setLevel(logging.DEBUG)
        self.logger.addHandler(handler)
        self.logger.debug('Tracker object created')
        self.logger.info(f'Video path provided : {self.videopath}')
        self.current_frame = None
        self.countimage = 0
        self.firstFrame = firstFrame

    def track(self):
        if self.videopath == -1:
            self.logger.error('Videopath error')
            return("VideopathError")

        num_of_img = 0
        self.countimage = 0

        cap = cv2.VideoCapture(self.videopath)
        cap.set(1, self.firstFrame)
        success, frame = cap.read()# Read first frame
        self.video_length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        if not success:
            self.logger.error('Failed to read video')
            sys.exit(1)

        bboxes = []
        colors = []

        a = 2
        self.bboxes = []
        for circle in self.circles:
            x = circle[0]
            y = circle[1]
            radius = circle[2]
            width = radius * 2
            height = width
            self.bboxes.append( (x-(radius+a),y-(radius+a), width, height))

        self.logger.debug(f'{len(self.bboxes)} tracking boxes have been created')

        trackerType = "CSRT"
        multiTracker = cv2.MultiTracker_create()# Create MultiTracker object

        for bbox in self.bboxes: # Initialize MultiTracker
            multiTracker.add(cv2.TrackerCSRT_create(), frame, bbox)

        self.logger.info(f'Starting the tracking of {len(self.bboxes)} particles')
        while cap.isOpened():

            success, frame = cap.read()
            if not success:
                cv2.imwrite('img_path{}_lastframe.jpg'.format(num_of_img), lastframe)
                num_of_img += 1
                self.logger.info("\n Last Image save in your working directory !")
                break

            lastframe = frame
            success, boxes = multiTracker.update(frame)  # get updated location of objects in subsequent frames

            if self.countimage < 1:  # initialize dataframes type
                for i, newbox in enumerate(boxes):
                    self.positions[i] = []

            # draw tracked objects
            for i, newbox in enumerate(boxes):
                # coordinates of the tracking box
                p1 = (int(newbox[0]), int(newbox[1]))
                p2 = (int(newbox[0] + newbox[2]), int(newbox[1] + newbox[3]))
                cv2.rectangle(frame, p1, p2, (255, 0, 0), 2, 1)
                # append the center of the box to dict "self.positions[index of box]" according to refresh rate
                if self.countimage:
                    xcenter = (p1[0] + p2[0]) / 2
                    ycenter = (p1[1] + p2[1]) / 2
                    self.positions[i].append((xcenter, ycenter))

                for pos in self.positions[i]:
                    xcenter = pos[0]
                    ycenter = pos[1]
                    cv2.circle(frame, (int(xcenter), int(ycenter)), 1, self.circle_color, -1)

            self.countimage += 1
            cv2.putText(frame, f"Frame no{self.countimage}", (10, 37), cv2.FONT_HERSHEY_PLAIN, 1, (0, 0, 0), 1)
            # cv2.imshow('Analysis', frame)
            self.current_frame = frame

            yield frame

            # quit on ESC button and save last frame
            if cv2.waitKey(1) & 0xFF == 27:  # Esc pressed
                cv2.imwrite('img_path{}_lastframe.jpg'.format(num_of_img), frame)
                num_of_img += 1
                self.logger.info("\n Last Image save in your working directory !")
                break
            print_progress(self.countimage, self.video_length)
        return(self.positions)


    def writeToExcelFile(self):
        workbook = xlsxwriter.Workbook(f'{self.videopath.split("/")[-1]}.xlsx')
        worksheet = workbook.add_worksheet()

        col = 1
        listt = [i + 1 for i in range(len(self.positions[0]))]
        worksheet.write_column('A2', listt)
        worksheet.write('A1', 'Frame')

        for i in range(len(self.positions)):
            listx = [i[0] for i in self.positions[i]]
            listy = [i[1] for i in self.positions[i]]
            worksheet.write(f'{xlsxwriter.utility.xl_col_to_name(col)}1', 'x')
            worksheet.write_column(f'{xlsxwriter.utility.xl_col_to_name(col)}2', listx)
            worksheet.write(f'{xlsxwriter.utility.xl_col_to_name(col + 1)}1', 'y')
            worksheet.write_column(f'{xlsxwriter.utility.xl_col_to_name(col + 1)}2', listy)

            col += 3
        workbook.close()

    global print_progress
    def print_progress(iteration, total, prefix='', suffix='', decimals=1, bar_length=100):
        # https://gist.github.com/aubricus/f91fb55dc6ba5557fbab06119420dd6a
        """
        Call in a loop to create terminal progress bar
        @params:
            iteration   - Required  : current iteration (Int)
            total       - Required  : total iterations (Int)
            prefix      - Optional  : prefix string (Str)
            suffix      - Optional  : suffix string (Str)
            decimals    - Optional  : positive number of decimals in percent complete (Int)
            bar_length  - Optional  : character length of bar (Int)
        """
        str_format = "{0:." + str(decimals) + "f}"
        percents = str_format.format(100 * (iteration / float(total)))
        filled_length = int(round(bar_length * iteration / float(total)))
        bar = '█' * filled_length + '-' * (bar_length - filled_length)
        sys.stdout.write('\r%s |%s| %s%s %s' % (prefix, bar, percents, '%', suffix)),


if __name__ == '__main__':
	tracker = Tracker('test video.mov', 0, 15)
	tracker.track()
	tracker.writeToExcelFile()
