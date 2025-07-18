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
    const rect = canvas.getBoundingClientRect();
    let startX, startY;
    let currentX, currentY;
    let shapeType = document.getElementById('shapeType').elements['shapeType'].value;

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

      requestAnimationFrame(drawEverything);
    }

    // Mouse down event
    canvas.addEventListener('mousedown', (event) => {
      isDragging = true;
      startX = event.clientX - rect.left;
      startY = event.clientY - rect.top;
      shapeType = document.getElementById('shapeType').elements['shapeType'].value;
    });

    // Mouse move event
    canvas.addEventListener('mousemove', (event) => {
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
    });

    // Mouse up event
    canvas.addEventListener('mouseup', (event) => {
      if (tempShape) {  // User is drawing
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
      else  // User is selecting
      {
        currentX = event.clientX - rect.left;
        currentY = event.clientY - rect.top;

        let selected = false;
        shapeList.forEach(shape => {
          
          ctx.lineWidth = shape.lineWidth + 9;   // To allow some error in the detection
          const isPointInStroke = ctx.isPointInStroke(shape.path, currentX, currentY);
          ctx.lineWidth = shape.lineWidth;

          if (isPointInStroke && !selected) {
            shape.isSelected = true;
            console.log(shape);
            selected = true;
          }
          else
            shape.isSelected = false;

        });
      }

      isDragging = false;
    });

    drawEverything();
  }
}
