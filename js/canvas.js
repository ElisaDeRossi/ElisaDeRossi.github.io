import { Line, Circle, Rectangle, RoundRectangle, Ellipse, Image } from './shapes.js';

var canvas = document.getElementById("myCanvas");
if (canvas) {
  var ctx = canvas.getContext("2d");
  if (ctx) {

    var requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;

    let shapeList = [];
    let tempShape;
    let isDragging = false;
    let rect = canvas.getBoundingClientRect();
    let startX, startY;
    let currentX, currentY;
    let shapeElement = document.getElementById('shapeType');
    let shapeType = shapeElement.elements['shapeType'].value;
    let selectedShape = -1;
    let selectedAnchor = -1;

    let mode = document.getElementById('mode');

    // Events
    window.onresize = function () {
      rect = canvas.getBoundingClientRect();
    };

    mode.onchange = () => {
      
      switch (mode.elements['mode'].value) {
        case 'shape':

          shapeElement.style.display = 'block';
          shapeList.forEach(shape => { shape.isSelected = false; });
          selectedShape = -1;
          selectedAnchor = -1;
          rect = canvas.getBoundingClientRect();

          isDragging = false;

          // Mouse down event
          canvas.onmousedown = (event) => {
            isDragging = true;
            startX = event.clientX - rect.left;
            startY = event.clientY - rect.top;
            shapeType = document.getElementById('shapeType').elements['shapeType'].value;
          };

          // Mouse move event
          canvas.onmousemove = (event) => {
            if (isDragging) {
              currentX = event.clientX - rect.left;
              currentY = event.clientY - rect.top;

              switch (shapeType) {
                case 'circle':
                  tempShape = new Circle([startX, startY], Math.sqrt((currentX - startX) ** 2 + (currentY - startY) ** 2));
                  break;

                case 'ellipse':
                  tempShape = new Ellipse([startX, startY], [currentX, currentY], 0);
                  break;

                case 'rect':
                  tempShape = new Rectangle([startX, startY], [currentX, currentY]);
                  break;

                case 'roundRect':
                  tempShape = new RoundRectangle([startX, startY], [currentX, currentY], [8, 8, 8, 8]);
                  break;

                default: // default is line
                  tempShape = new Line([startX, startY], [currentX, currentY]);
                  break;
              }
            }
          };

          // Mouse up event
          canvas.onmouseup = (event) => {
            if (tempShape) {
              tempShape = null;
              if (startX !== currentX && startY !== currentY)
                switch (shapeType) {
                  case 'circle':
                    shapeList.push(new Circle([startX, startY], Math.sqrt((currentX - startX) ** 2 + (currentY - startY) ** 2)));
                    break;

                  case 'ellipse':
                    shapeList.push(new Ellipse([startX, startY], [currentX, currentY], 0));
                    break;

                  case 'rect':
                    shapeList.push(new Rectangle([startX, startY], [currentX, currentY]));
                    break;

                  case 'roundRect':
                    shapeList.push(new RoundRectangle([startX, startY], [currentX, currentY], [8, 8, 8, 8]));
                    break;

                  default: // default is line
                    shapeList.push(new Line([startX, startY], [currentX, currentY]));
                    break;
                }
            }
            isDragging = false;
          };

          break;

        case 'select':

          shapeElement.style.display = 'none';
          rect = canvas.getBoundingClientRect();

          isDragging = false;

          // Mouse down event
          canvas.onmousedown = (event) => {
            currentX = event.clientX - rect.left;
            currentY = event.clientY - rect.top;

            isDragging = true;

            selectedAnchor = -1;
            if (selectedShape != -1) {
              for (let i = 0; i < shapeList[selectedShape].anchors.length; i++)
                if (ctx.isPointInPath(shapeList[selectedShape].anchors[i].path, currentX, currentY))
                  selectedAnchor = i;
            }
          };

          // Mouse move event
          canvas.onmousemove = (event) => {
            if (isDragging) {
              currentX = event.clientX - rect.left;
              currentY = event.clientY - rect.top;

              if (selectedShape != -1 && selectedAnchor != -1) {
                shapeList[selectedShape].anchors[selectedAnchor].updatePath([currentX, currentY]);
                shapeList[selectedShape].updatePath(selectedAnchor);
              }
            }
          };

          // Mouse up event
          canvas.onmouseup = (event) => {

            let isPointInStroke = false;
            let selected = false;
            for (let i = 0; i < shapeList.length; i++) {
              ctx.lineWidth = shapeList[i].lineWidth + 9;    // To allow some error in the detection
              isPointInStroke = ctx.isPointInStroke(shapeList[i].path, currentX, currentY);
              ctx.lineWidth = shapeList[i].lineWidth;        // Restore original dimension
              if (isPointInStroke && !selected) {
                shapeList[i].isSelected = true;
                selectedShape = i;
                selected = true;
              }
              else
                shapeList[i].isSelected = false;
            }

            if (!selected)
              selectedShape = -1;

            isDragging = false;
          };

          // Keyup event
          document.onkeydown = (event) => {
            // Delete shape
            if (selectedShape != -1 && event.code == 'Delete') {
              shapeList.splice(selectedShape, 1);
              selectedShape = -1;
              selectedAnchor = -1;
            }
          };

          break;
      }
    };

    /*
    let image = new Image(document.getElementById('source'), [0, 0], [50, 50]);
    let maleHead = document.getElementById('maleHead').elements['maleHead'];
    maleHead.forEach(value => {
      value.addEventListener("click", function () {
        image.setSource("/img/canvas/" + document.getElementById('maleHead').elements['maleHead'].value + ".png");
      }, false);
    });
    */

    function drawEverything() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background image
      // if (image.HTMLelement.getAttribute('src') != "") {
      // image.draw(ctx);
      // }

      // Draw shapes
      for (var i = 0; i < shapeList.length; i++) {
        shapeList[i].draw(ctx);
      }

      // Draw temporary shapes
      if (tempShape)
        tempShape.draw(ctx);

      // console.log(selectedShape, selectedAnchor);

      requestAnimationFrame(drawEverything);
    }
    drawEverything();
  }
}
