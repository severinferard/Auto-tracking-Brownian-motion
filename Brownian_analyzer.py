from argparse import ArgumentParser
import cv2
import sys
from random import randint
import math
import xlsxwriter




class Tracker():

    def __init__(self, videopath):
        self.videopath = videopath
        self.circle_color = (0, 255, 0)
        self.txt_color = (0, 255, 0)
        self.positions = {}


    @staticmethod
    def Dist_between_two_points(pos1, pos2):
        x1 = pos1[0]
        y1 = pos1[1]
        x2 = pos2[0]
        y2 = pos2[1]
        dist = math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
        return(dist)

    def track(self):
        if self.videopath == -1:
            return("VideopathError")


        num_of_img = 0
        countimage = 0


        # Create a video capture object to read videos
        print("videopath provided", self.videopath)
        cap = cv2.VideoCapture(self.videopath)

        # Read first frame
        success, frame = cap.read()
        # quit if unable to read the video file
        if not success:
            print('Failed to read video')
            sys.exit(1)

        bboxes = []
        colors = []

        # OpenCV's selectROI function doesn't work for selecting multiple objects in Python
        # So we will call this function in a loop till we are done selecting all objects

        while True:
            # draw bounding boxes over objects
            # selectROI's default behaviour is to draw box starting from the center
            # when fromCenter is set to false, you can draw box starting from top left corner
            cv2.namedWindow('ROI Selecter', cv2.WINDOW_NORMAL)
            cv2.resizeWindow('ROI Selecter', 1000, 700)
            cv2.moveWindow('ROI Selecter', 10, 50)
            cv2.imshow('ROI Selecter', frame)
            bbox = cv2.selectROI('ROI Selecter', frame)
            bboxes.append(bbox)
            colors.append((randint(0, 255), randint(0, 255), randint(0, 255)))
            print("\n")
            print("Press q to quit selecting boxes and start tracking")
            print("Press any other key to select next object")
            print("Click on the frame window and press escape to quit")
            k = cv2.waitKey(0) & 0xFF
            if (k == 113):  # q is pressed
                break

        cv2.destroyWindow('ROI Selecter')
        print('Selected bounding boxes {}'.format(bboxes))

        trackerType = "CSRT"

        print(bboxes)
        # Create MultiTracker object
        multiTracker = cv2.MultiTracker_create()

        # Initialize MultiTracker
        for bbox in bboxes:
            print("test", bbox)
            multiTracker.add(cv2.TrackerCSRT_create(), frame, bbox)

        while cap.isOpened():

            success, frame = cap.read()
            if not success:
                cv2.imwrite('img_path{}_lastframe.jpg'.format(num_of_img), lastframe)
                num_of_img += 1
                print("\n Last Image save in your working directory !")
                break
            lastframe = frame
            success, boxes = multiTracker.update(frame)  # get updated location of objects in subsequent frames

            if countimage < 1:  # initialize dataframes type
                for i, newbox in enumerate(boxes):
                    self.positions[i] = []

            # draw tracked objects
            for i, newbox in enumerate(boxes):
                # coordinates of the tracking box
                p1 = (int(newbox[0]), int(newbox[1]))
                p2 = (int(newbox[0] + newbox[2]), int(newbox[1] + newbox[3]))
                cv2.rectangle(frame, p1, p2, colors[i], 2, 1)
                # append the center of the box to dict "self.positions[index of box]" according to refresh rate
                if countimage:
                    xcenter = (p1[0] + p2[0]) / 2
                    ycenter = (p1[1] + p2[1]) / 2
                    self.positions[i].append((xcenter, ycenter))

                for pos in self.positions[i]:
                    xcenter = pos[0]
                    ycenter = pos[1]
                    cv2.circle(frame, (int(xcenter), int(ycenter)), 1, self.circle_color, -1)

                countimage += 1
            cv2.putText(frame, f"Frame no{countimage}", (10, 37), cv2.FONT_HERSHEY_PLAIN, 1, (0, 0, 0), 1)
            cv2.imshow('Analysis', frame)

            # quit on ESC button and save last frame
            if cv2.waitKey(1) & 0xFF == 27:  # Esc pressed
                cv2.imwrite('img_path{}_lastframe.jpg'.format(num_of_img), frame)
                num_of_img += 1
                print("\n Last Image save in your working directory !")
                break

        return(self.positions)

    def write_results(self):
        workbook = xlsxwriter.Workbook(f'{"test"}.xlsx')
        for sheet in range(len(self.positions)):
            self.worksheet = workbook.add_worksheet(f"point{sheet}")
            self.worksheet.write('A1', "Frame")
            self.worksheet.write('B1', "x")
            self.worksheet.write('C1', "y")

            listx = [i[0] for i in self.positions[sheet]]
            listy = [i[1] for i in self.positions[sheet]]
            listt = [i + 1 for i in range(len(self.positions[0]))]
            self.worksheet.write_column('A2', listt)
            self.worksheet.write_column('B2', listx)
            self.worksheet.write_column('C2', listy)
        workbook.close()
        return()


if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("-f", "--file", dest="myFile", help="Open specified file")
    args = parser.parse_args()

    tracker = Tracker(args.myFile)
    tracker.track()
    tracker.write_results()
