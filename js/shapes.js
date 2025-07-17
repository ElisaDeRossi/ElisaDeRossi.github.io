class Shape {
  constructor(shapeType) {
    this.shapeType = shapeType;
  }
}

export class Line extends Shape {
  constructor(start, end) {
    super("line");
    this.start = start;
    this.end = end;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.start[0], this.start[1]);
    ctx.lineTo(this.end[0], this.end[1]);
    ctx.stroke();
    ctx.closePath();
  }
}

export class Circle extends Shape {
  constructor(center, radius) {
    super("circle");
    this.center = center;
    this.radius = radius;
  }

  draw(ctx) {
    ctx.beginPath();
    // ctx.arc(centerX, centerY, radius)
    ctx.arc(this.center[0], this.center[1], this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  }
}

export class Ellipse extends Shape {
  constructor(start, end, rotation) {
    super("ellipse");
    this.start = start;
    this.radius = [Math.abs(end[0] - start[0])/2, Math.abs(end[1] - start[1])/2];
    this.rotation = rotation;
  }

  draw(ctx) {
    ctx.beginPath();
    // ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    ctx.ellipse(this.start[0], this.start[1], this.radius[0], this.radius[1], this.rotation, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();
  }
}

export class Rectangle extends Shape {
  constructor(start, end) {
    super("rectangle");
    this.start = start;
    this.width = end[0] - start[0];
    this.height = end[1] - start[1];
  }

  draw(ctx) {
    ctx.beginPath();
    // ctx.rect(startX, startY, width, height)
    ctx.rect(this.start[0], this.start[1], this.width, this.height);
    ctx.stroke();
    ctx.closePath();
  }
}

export class RoundRectangle extends Shape {
  constructor(start, end, cornerRadii) {
    super("roundRectangle");
    this.start = start;
    this.width = end[0] - start[0];
    this.height = end[1] - start[1];
    this.cornerRadii = cornerRadii;
  }

  draw(ctx) {
    ctx.beginPath();
    // ctx.roundRect(x, y, width, height, radii)
    ctx.roundRect(this.start[0], this.start[1], this.width, this.height, this.cornerRadii);
    ctx.stroke();
    ctx.closePath();
  }
}
