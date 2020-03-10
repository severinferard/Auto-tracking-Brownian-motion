// console.log("test");
// window.onload = () => {
//     console.log("loaded");
    
//   function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
//     var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

//     return {
//       x: centerX + radius * Math.cos(angleInRadians),
//       y: centerY + radius * Math.sin(angleInRadians)
//     };
//   }

//   function describeArc(x, y, radius, startAngle, endAngle) {
//     var start = polarToCartesian(x, y, radius, endAngle);
//     var end = polarToCartesian(x, y, radius, startAngle);

//     var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

//     var d = [
//       "M",
//       start.x,
//       start.y,
//       "A",
//       radius,
//       radius,
//       0,
//       largeArcFlag,
//       0,
//       end.x,
//       end.y
//     ].join(" ");

//     return d;
//   }

//   var canvas = document.getElementById("progressbar-canvas");

// class ProgressBar {
//     constructor(svg) {
        

        
//       this.canvas = svg;
//       this.lefOffset = document.getElementsByClassName("sidenav")[0].getBoundingClientRect().width + 10;
//         console.log(this.lefOffset);
//       this.state = "setup-1";
//       this.bubble = { out: null, in: null };
//       this.bubbleTargetX = 0;
//       this.bubbleTargetY = 0;
//       this.bubbleVelX = 0;
//       this.bubbleVelY = 0;
//       this.bubbleTrackingSpeed = 0.1;
//       this.bubbleSpead = 4;
//       this.bubbleColor = "rgb(142, 200, 255)";
//       this.bubbleX = 0;
//       this.bubbleY = this.canvas.getBoundingClientRect().height / 2;
//       this.positions = [];
//       this.firstAnimationReached = false;
//       this.secondAnimationReached = false;

//       this.crossSpeed = 1;
//       this.cross = { x: null, y: null };
//       this.crossCenterX =
//         document.getElementsByClassName("flex-text")[0].getBoundingClientRect()
//           .x +
//           document.getElementsByClassName("flex-text")[1].getBoundingClientRect().width / 2 -
//         50 - this.lefOffset;
//       this.crossCenterY =
//         document
//           .getElementById("progressbar-topwrapper")
//           .getBoundingClientRect().height /
//           2 +
//         5;
//     }

//     setTarget() {
//       console.log("setTarget");

//       var middleX =
//         (document.getElementsByClassName("flex-text")[1].getBoundingClientRect()
//           .x +
//         document.getElementsByClassName("flex-text")[0].getBoundingClientRect()
//           .width /
//           2 - this.lefOffset);
//       var middleY = this.canvas.getBoundingClientRect().height / 2;
//       var numX = Math.floor(Math.random() * 20) + 1; // this will get a number between 1 and 99;
//       numX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
//       var numY = Math.floor(Math.random() * 20) + 1; // this will get a number between 1 and 99;
//       numY *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
//       this.bubbleTargetX = middleX + numX;
//       this.bubbleTargetY = middleY + numY;
//     //   setTimeout(this.setTarget.bind(this), 1000);
//     }

//     updateBubble() {
//       var tx = this.bubbleTargetX - this.bubbleX;
//       var ty = this.bubbleTargetY - this.bubbleY;
//       var dist = Math.sqrt(tx * tx + ty * ty);

//       var rad = Math.atan2(ty, tx);
//       var angle = (rad / Math.PI) * 180;

//       this.bubbleVelX = (tx / dist) * this.bubbleTrackingSpeed;
//       this.bubbleVelY = (ty / dist) * this.bubbleTrackingSpeed;

//       this.bubbleX += this.bubbleVelX;
//       this.bubbleY += this.bubbleVelY;

//       try {
//         this.canvas.removeChild(this.bubble.out);
//         this.canvas.removeChild(this.bubble.in);
//       } catch (err) {}

//       var pos = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "circle"
//       );
//       pos.setAttribute("cx", this.bubbleX);
//       pos.setAttribute("cy", this.bubbleY);
//       pos.setAttribute("r", 1);
//       pos.setAttribute("fill", "none");
//       pos.setAttribute("stroke-width", "1");
//       pos.setAttribute("stroke", "rgb(100, 255, 95)");

//       this.positions.push(pos);
//       this.canvas.append(pos);
//       this.canvas.removeChild(this.positions[0]);
//       this.positions.shift();

//       this.bubble.out = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "circle"
//       );
//       this.bubble.out.setAttribute("cx", this.bubbleX);
//       this.bubble.out.setAttribute("cy", this.bubbleY);
//       this.bubble.out.setAttribute("r", 10);
//       this.bubble.out.setAttribute("fill", "none");
//       this.bubble.out.setAttribute("stroke-width", "2");
//       this.bubble.out.setAttribute("stroke", this.bubbleColor);
//       this.canvas.append(this.bubble.out);
//       this.bubble.in = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "path"
//       );
//       this.bubble.in.setAttribute(
//         "d",
//         describeArc(this.bubbleX, this.bubbleY, 7, -10, 90)
//       );
//       this.bubble.in.setAttribute("fill", "none");
//       this.bubble.in.setAttribute("stroke-width", "2");
//       this.bubble.in.setAttribute("stroke", this.bubbleColor);
//       this.canvas.append(this.bubble.in);
//     }

//     goToAnimation(n) {
//       return new Promise((resolve, reject) => {
//         const intervalId = setInterval(() => {
//           var middleX =(
//             document
//               .getElementsByClassName("flex-text")
//               [n].getBoundingClientRect().x +
//             document
//               .getElementsByClassName("flex-text")[0]
//               .getBoundingClientRect().width /
//               2) - this.lefOffset;
//           var middleY = this.canvas.getBoundingClientRect().height / 2;
//           var tx = middleX - this.bubbleX;
//           var ty = middleY - this.bubbleY;
//           var dist = Math.sqrt(tx * tx + ty * ty);

//           var rad = Math.atan2(ty, tx);
//           var angle = (rad / Math.PI) * 180;

//           this.bubbleVelX = (tx / dist) * this.bubbleSpead;
//           this.bubbleVelY = (ty / dist) * this.bubbleSpead;

//           this.bubbleX += this.bubbleVelX;
//           this.bubbleY += this.bubbleVelY;

//           if (dist < 2) {
//             console.log("dist < 2");
//             this.canvas.removeChild(this.bubble.out);
//             this.canvas.removeChild(this.bubble.in);
//             this.secondAnimationReached = true;
//             clearInterval(intervalId);
//             resolve();
//           }

//           try {
//             this.canvas.removeChild(this.bubble.out);
//             this.canvas.removeChild(this.bubble.in);
//           } catch (err) {}
//           this.bubble.out = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             "circle"
//           );
//           this.bubble.out.setAttribute("cx", this.bubbleX);
//           this.bubble.out.setAttribute("cy", this.bubbleY);
//           this.bubble.out.setAttribute("r", 10);
//           this.bubble.out.setAttribute("fill", "none");
//           this.bubble.out.setAttribute("stroke-width", "2");
//           this.bubble.out.setAttribute("stroke", this.bubbleColor);
//           this.canvas.append(this.bubble.out);
//           this.bubble.in = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             "path"
//           );
//           this.bubble.in.setAttribute(
//             "d",
//             describeArc(this.bubbleX, this.bubbleY, 7, -10, 90)
//           );
//           this.bubble.in.setAttribute("fill", "none");
//           this.bubble.in.setAttribute("stroke-width", "2");
//           this.bubble.in.setAttribute("stroke", this.bubbleColor);
//           this.canvas.append(this.bubble.in);
//         }, 10);
//       });
//     }

//     updateBox() {
//       switch (this.state) {
//         case "setup-1":
//           var middleX =(
//             document
//               .getElementsByClassName("flex-text")[0]
//               .getBoundingClientRect().x +
//             document
//               .getElementsByClassName("flex-text")[0]
//               .getBoundingClientRect().width /
//               2) - this.lefOffset;
//           var middleY = this.canvas.getBoundingClientRect().height / 2;

//           var limitX = middleX - 30;
//           var limitY = middleY - 25;
//           var tx = limitX - this.crossCenterX;
//           var ty = limitY - this.crossCenterY;
//           var dist = Math.sqrt(tx * tx + ty * ty);

//           if (dist < 2) {
//             this.lastLimitX = limitX;
//             this.lastLimitY = limitY;
//             this.state = "setup-2";
//             break;
//           }

//           var rad = Math.atan2(ty, tx);
//           var angle = (rad / Math.PI) * 180;

//           this.crossVelX = (tx / dist) * this.crossSpeed;
//           this.crossVelY = (ty / dist) * this.crossSpeed;

//           this.crossCenterX += this.crossVelX;
//           this.crossCenterY += this.crossVelY;

//           var l = 10;
//           try {
//             this.canvas.removeChild(this.cross.x);
//             this.canvas.removeChild(this.cross.y);
//           } catch (err) {}

//           this.cross.x = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             "line"
//           );
//           this.cross.x.setAttribute("x1", this.crossCenterX - l);
//           this.cross.x.setAttribute("y1", this.crossCenterY);
//           this.cross.x.setAttribute("x2", this.crossCenterX + l);
//           this.cross.x.setAttribute("y2", this.crossCenterY);
//           this.cross.x.setAttribute("stroke-width", "2");
//           this.cross.x.setAttribute("stroke", "rgb(0, 0, 0)");
//           this.canvas.appendChild(this.cross.x);
//           this.cross.y = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             "line"
//           );
//           this.cross.y.setAttribute("x1", this.crossCenterX);
//           this.cross.y.setAttribute("y1", this.crossCenterY - l);
//           this.cross.y.setAttribute("x2", this.crossCenterX);
//           this.cross.y.setAttribute("y2", this.crossCenterY + l);
//           this.cross.y.setAttribute("stroke-width", "2");
//           this.cross.y.setAttribute("stroke", "rgb(0, 0, 0)");
//           this.canvas.appendChild(this.cross.y);
//           break;

//         case "setup-2":
//           var middleX =
//             (document
//               .getElementsByClassName("flex-text")[0]
//               .getBoundingClientRect().x +
//             document
//               .getElementsByClassName("flex-text")[0]
//               .getBoundingClientRect().width /
//               2 - this.lefOffset);
//           var middleY = this.canvas.getBoundingClientRect().height / 2;
//           var limitX = middleX + 30;
//           var limitY = middleY + 20;
//           var tx = this.lastLimitX - this.crossCenterX;
//           var ty = this.lastLimitY - this.crossCenterY;
//           var dist = Math.sqrt(tx * tx + ty * ty);

//           if (dist > 74) {
//             return;
//           }
//           var tx = limitX - this.crossCenterX;
//           var ty = limitY - this.crossCenterY;
//           var dist = Math.sqrt(tx * tx + ty * ty);

//           this.crossVelX = (tx / dist) * this.crossSpeed;
//           this.crossVelY = (ty / dist) * this.crossSpeed;

//           this.crossCenterX += this.crossVelX;
//           this.crossCenterY += this.crossVelY;

//           try {
//             this.canvas.removeChild(this.cross.x);
//             this.canvas.removeChild(this.cross.y);
//             this.canvas.removeChild(this.rectangle);
//           } catch (err) {}

//           this.rectangle = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             "rect"
//           );
//           this.rectangle.setAttribute("x", this.lastLimitX);
//           this.rectangle.setAttribute("y", this.lastLimitY);
//           this.rectangle.setAttribute(
//             "width",
//             this.crossCenterX - this.lastLimitX
//           );
//           this.rectangle.setAttribute(
//             "height",
//             this.crossCenterY - this.lastLimitY
//           );
//           this.rectangle.setAttribute("stroke-width", "2");
//           this.rectangle.setAttribute("stroke", "rgb(255, 0, 0)");
//           this.rectangle.setAttribute("fill", "transparent");
//           this.canvas.appendChild(this.rectangle);
//           var l = 10;
//           this.cross.x = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             "line"
//           );
//           this.cross.x.setAttribute("x1", this.crossCenterX - l);
//           this.cross.x.setAttribute("y1", this.crossCenterY);
//           this.cross.x.setAttribute("x2", this.crossCenterX + l);
//           this.cross.x.setAttribute("y2", this.crossCenterY);
//           this.cross.x.setAttribute("stroke-width", "2");
//           this.cross.x.setAttribute("stroke", "rgb(0, 0, 0)");
//           this.canvas.appendChild(this.cross.x);
//           this.cross.y = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             "line"
//           );
//           this.cross.y.setAttribute("x1", this.crossCenterX);
//           this.cross.y.setAttribute("y1", this.crossCenterY - l);
//           this.cross.y.setAttribute("x2", this.crossCenterX);
//           this.cross.y.setAttribute("y2", this.crossCenterY + l);
//           this.cross.y.setAttribute("stroke-width", "2");
//           this.cross.y.setAttribute("stroke", "rgb(0, 0, 0)");
//           this.canvas.appendChild(this.cross.y);

//           break;
//       }
//     }

//     setupAnimation() {

//         try {
//             this.canvas.removeChild(this.rectangle)
//             this.canvas.removeChild(this.cross.x)
//             this.canvas.removeChild(this.cross.y)
//         } catch (error) {
            
//         }
        
//       clearInterval(this.trackingInterval);
//       this.goToAnimation(0).then(() => {
//         // document.getElementsByClassName("flex-text")[0].style.fontSize = "30px"
//         setInterval(this.updateBox.bind(this), 10);
//       });
//     }

//     trackingAnimation() {
//       this.positions = [];
//       for (let i = 0; i < 300; i++) {
//         var pos = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "line"
//         );
//         pos.setAttribute("x1", 0);
//         pos.setAttribute("y1", 0);
//         pos.setAttribute("x2", 0);
//         pos.setAttribute("y2", 0);
//         pos.setAttribute("stroke-width", "1");
//         pos.setAttribute("stroke", "rgb(0, 0, 0)");
//         this.canvas.appendChild(pos);
//         this.positions.push(pos);
//       }
//       console.log(this.positions);

//       clearInterval(this.trackingInterval);
//       this.goToAnimation(1).then(() => {
//         this.trackingTargetInterval = setInterval(this.setTarget.bind(this), 500);
//         this.trackingInterval = setInterval(this.updateBubble.bind(this), 10);
//       });
//     }

//     start() {
//       console.log("start");
//     }
//   }

//   var progressbar = new ProgressBar(document.getElementById("progressbar-svg"));
//   progressbar.start();

// //   document.getElementById("setupbutton").addEventListener("click", () => {
// //     progressbar.setupAnimation();
// //   });

// //   document.getElementById("analyzisbutton").addEventListener("click", () => {
// //     progressbar.trackingAnimation();
// //   });

//     // progressbar.trackingAnimation();

//     document.onkeydown = checkKey;

// function checkKey(e) {
//     e = e || window.event;
//     if (e.keyCode == '38') {
//         // up arrow
//     }
//     else if (e.keyCode == '40') {
//         // down arrow
//     }
//     else if (e.keyCode == '37') {
//        // left arrow
//        progressbar.setupAnimation();
//     }
//     else if (e.keyCode == '39') {
//        // right arrow
//        progressbar.trackingAnimation();
//     }

// }
// progressbar.setupAnimation();

// };

