


window.onload = () => {
    var canvas = document.getElementById("progressbar-canvas")

    class ProgressBar {

        constructor(canvas) {
          this.canvas = canvas;
          this.ctx = this.canvas.getContext("2d");
          this.state = "setup-1"
          this.bubbleTargetX = 0
          this.bubbleTargetY = 0
          this.bubbleVelX = 0
          this.bubbleVelY = 0
          this.bubbleSpeed = .1
          var txtElement = document.getElementsByClassName("flex-text")[1]
          this.stepTargetX = txtElement.getBoundingClientRect().x + (txtElement.getBoundingClientRect().width / 2)
          this.stepTargetY = (this.canvas.height / 3) * 0.7
          this.bubbleX = this.stepTargetX;
          this.bubbleY = this.stepTargetY;
          this.positions = []

          this.crossSpeed = 1;

          this.crossCenterX = document.getElementsByClassName("flex-text")[0]
            .getBoundingClientRect().x + (txtElement.getBoundingClientRect().width / 2) - 50;  
          this.crossCenterY = (this.canvas.height / 3) +5;

        }
    
        setTarget() {
            console.log("setTarget");
            

            var numX = Math.floor(Math.random()*20) + 1; // this will get a number between 1 and 99;
            numX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
            var numY = Math.floor(Math.random()*20) + 1; // this will get a number between 1 and 99;
            numY *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
            this.bubbleTargetX = this.stepTargetX + numX
            this.bubbleTargetY = this.stepTargetY + numY
            setTimeout(this.setTarget.bind(this), 1000)
            
            
        }
    
        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = 70;
        }
        
        trackingAnimation(){
            console.log("trackingAnimation");
            
            this.setTarget();
            this.updateBubble();
        }
        updateBubble() {
            //  console.log("updateBubble");
             
            var tx = this.bubbleTargetX - this.bubbleX;
            var ty = this.bubbleTargetY - this.bubbleY;
            var dist = Math.sqrt(tx*tx+ty*ty);
            
            var rad = Math.atan2(ty,tx);
            var angle = rad/Math.PI * 180;

            this.bubbleVelX = (tx/dist)*this.bubbleSpeed;
            this.bubbleVelY = (ty/dist)*this.bubbleSpeed;
        
            this.bubbleX += this.bubbleVelX
            this.bubbleY += this.bubbleVelY
            this.positions.push({x: this.bubbleX, y: this.bubbleY})
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.positions.length > 300) {
                this.positions.slice(Math.max(this.positions.length - 300, 1)).forEach(element => {
                    this.ctx.beginPath();
                this.ctx.strokeStyle = 'green';
                this.ctx.lineWidth = .5;
                this.ctx.arc(element.x, element.y, 1, 0, Math.PI*1.5, true);
                this.ctx.stroke();
                })
                    
            } else {
                this.positions.forEach(element => {
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'green';
                this.ctx.lineWidth = .5;
                this.ctx.arc(element.x, element.y, 1, 0, Math.PI*1.5, true);
                this.ctx.stroke();
            });} 
            
                

            this.ctx.beginPath();
            this.ctx.strokeStyle = '#8bc9ee';
            this.ctx.lineWidth = 2;
            this.ctx.arc(this.bubbleX, this.bubbleY, 10 - 3, 0, Math.PI*1.5, true);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(this.bubbleX, this.bubbleY, 10, 0, Math.PI*2, false);
            this.ctx.stroke();
        
            setTimeout(this.updateBubble.bind(this), 10);
            
        }

        setupAnimation() {
            switch (this.state) {
                case "setup-1":
                    
                   var middleX = document.getElementsByClassName("flex-text")[0]
                   .getBoundingClientRect().x 
                   + (document.getElementsByClassName("flex-text")[0].getBoundingClientRect().width / 2)
                   var middleY = (this.canvas.height / 2)
                   var limitX = middleX - 30;  
                   var limitY = middleY -25;
                   var tx = limitX - this.crossCenterX;
                   var ty = limitY - this.crossCenterY;
                   var dist = Math.sqrt(tx*tx+ty*ty);

                   if (dist < 2) {
                       this.lastLimitX = limitX
                       this.lastLimitY = limitY
                       this.state = "setup-2"
                       break
                   }

                   var rad = Math.atan2(ty,tx);
                   var angle = rad/Math.PI * 180;
       
                   this.crossVelX = (tx/dist)*this.crossSpeed;
                   this.crossVelY = (ty/dist)*this.crossSpeed;
               
                   this.crossCenterX += this.crossVelX
                   this.crossCenterY += this.crossVelY

                   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                   this.ctx.strokeStyle = '#000';
                   var l = 10;
                   this.ctx.beginPath();
                   this.ctx.moveTo(this.crossCenterX - l, this.crossCenterY)
                   this.ctx.lineTo(this.crossCenterX + l, this.crossCenterY)
                   this.ctx.stroke()

                   this.ctx.beginPath();
                   this.ctx.moveTo(this.crossCenterX, this.crossCenterY - l)
                   this.ctx.lineTo(this.crossCenterX, this.crossCenterY + l)
                   this.ctx.stroke()

                   this.ctx.beginPath();
                   this.ctx.strokeStyle = '#8bc9ee';
                   this.ctx.lineWidth = 2;
                   this.ctx.arc(middleX, middleY, 10 - 3, 0, Math.PI*1.5, true);
                   this.ctx.stroke();

                   this.ctx.beginPath();
                   this.ctx.arc(middleX, middleY, 10, 0, Math.PI*2, false);
                   this.ctx.stroke();
                   break;
                   
               case "setup-2":
                   var middleX = document.getElementsByClassName("flex-text")[0]
                   .getBoundingClientRect().x 
                   + (document.getElementsByClassName("flex-text")[0].getBoundingClientRect().width / 2)
                   var middleY = (this.canvas.height / 2)
                   var limitX = middleX + 30; 
                   var limitY = middleY + 20;
                   var tx = this.lastLimitX - this.crossCenterX;
                   var ty = this.lastLimitY - this.crossCenterY;
                   var dist = Math.sqrt(tx*tx+ty*ty);
                   

                   if (dist > 74) {
                       return
                   }
                   var tx = limitX - this.crossCenterX;
                   var ty = limitY - this.crossCenterY;
                   var dist = Math.sqrt(tx*tx+ty*ty);
                   
                   
                   this.crossVelX = (tx/dist)*this.crossSpeed;
                   this.crossVelY = (ty/dist)*this.crossSpeed;

                   this.crossCenterX += this.crossVelX
                   this.crossCenterY += this.crossVelY
                   
                   //cross
                   this.ctx.lineWidth = 1;
                   this.ctx.strokeStyle = '#000';
                   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                   var l = 10;
                   this.ctx.beginPath();
                   this.ctx.moveTo(this.crossCenterX - l, this.crossCenterY)
                   this.ctx.lineTo(this.crossCenterX + l, this.crossCenterY)
                   this.ctx.stroke()

                   this.ctx.beginPath();
                   this.ctx.moveTo(this.crossCenterX, this.crossCenterY - l)
                   this.ctx.lineTo(this.crossCenterX, this.crossCenterY + l)
                   this.ctx.stroke()

                   //bubble
                   this.ctx.beginPath();
                   this.ctx.strokeStyle = '#8bc9ee';
                   this.ctx.lineWidth = 2;
                   this.ctx.arc(middleX, middleY, 10 - 3, 0, Math.PI*1.5, true);
                   this.ctx.stroke();
       
                   this.ctx.beginPath();
                   this.ctx.arc(middleX, middleY, 10, 0, Math.PI*2, false);
                   this.ctx.stroke();

                   //rectangle
                   this.ctx.beginPath();
                   this.ctx.strokeStyle = 'red';
                   this.ctx.lineWidth = 3;
                   this.ctx.moveTo(this.lastLimitX, this.lastLimitY)
                   this.ctx.lineTo(this.crossCenterX, this.lastLimitY)
                   this.ctx.stroke()
                   this.ctx.beginPath();
                   this.ctx.moveTo(this.crossCenterX, this.lastLimitY)
                   this.ctx.lineTo(this.crossCenterX, this.crossCenterY)
                   this.ctx.stroke()
                   this.ctx.beginPath();
                   this.ctx.moveTo(this.lastLimitX, this.lastLimitY)
                   this.ctx.lineTo(this.lastLimitX, this.crossCenterY)
                   this.ctx.stroke()
                   this.ctx.beginPath();
                   this.ctx.moveTo(this.lastLimitX, this.crossCenterY)
                   this.ctx.lineTo(this.crossCenterX, this.crossCenterY)
                   this.ctx.stroke()
                   break;
                       
        }
        setTimeout(this.setupAnimation.bind(this), 10);
    }
    
        start() {
            console.log("start");
            // this.setupAnimation();
            // this.trackingAnimation();

    
        }
    
      }
    
    progressbar = new ProgressBar(canvas)
    progressbar.resizeCanvas()
    progressbar.start()
    
    document.getElementById("setupbutton").addEventListener("click" ,() => {
        progressbar.setupAnimation();
    })

    document.getElementById("analyzisbutton").addEventListener("click" ,() => {
        progressbar.trackingAnimation();
    })
    
    
    };

    