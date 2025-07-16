function drawLine(canvas, start, end) {
  let ctx = canvas.getContext("2d"); if (!ctx) return;
  ctx.beginPath();
  ctx.moveTo(start[0], start[1]);
  ctx.lineTo(end[0], end[1]);
  ctx.stroke();
  ctx.closePath();
}

function drawCircle(canvas, center, radius) {
  let ctx = canvas.getContext("2d"); if (!ctx) return;
  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}

var canvas = document.getElementById("myCanvas");
if (canvas) {
  let isDragging = false;
  const rect = canvas.getBoundingClientRect();
  let startX, startY;
  let currentX, currentY;

  // Mouse down event
  canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.clientX - rect.left;
    startY = event.clientY - rect.top;
  });

  // Mouse move event
  canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
      currentX = event.clientX - rect.left;
      currentY = event.clientY - rect.top;
    }
  });

  // Mouse up event
  canvas.addEventListener('mouseup', () => {
    isDragging = false;
    drawLine(canvas, [startX, startY], [currentX, currentY]);
  });
}
