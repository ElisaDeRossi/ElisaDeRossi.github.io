class Shape {
  constructor(shapeType) {
    this.shapeType = shapeType;
    this.path = new Path2D();
    this.lineWidth = 1;
    this.isSelected = false;
    this.anchors = [];
  }

  draw(ctx) {
    ctx.stroke(this.path);

    if (this.isSelected)
      this.anchors.forEach(anchor => {
        anchor.draw(ctx);
      });
  }
}

class Anchor extends Shape {
  constructor(type, center) {
    super("anchor");

    this.type = type;
    this.center = center;
    this.radius = 7;

    // Build shape
    this.path.arc(center[0], center[1], this.radius, 0, 2 * Math.PI);
  }
}

export class Line extends Shape {
  constructor(start, end) {
    super("line");

    this.anchors = [
      new Anchor("position", start), 
      new Anchor("position", end)
    ];

    // Build shape
    this.path.moveTo(start[0], start[1]);
    this.path.lineTo(end[0], end[1]);
  }
}

export class Circle extends Shape {
  constructor(center, radius) {
    super("circle");

    this.anchors = [
      new Anchor("position", center), 
      new Anchor("radius", [center[0] + radius, center[1]])
    ];

    // Build shape
    this.path.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  }
}

export class Ellipse extends Shape {
  constructor(start, end, rotation) {
    super("ellipse");

    this.radius = [Math.abs(end[0] - start[0])/2, Math.abs(end[1] - start[1])/2];
    this.rotation = rotation;   // In radians!

    this.anchors = [
      new Anchor("position", start), 
      new Anchor("radius", [start[0] + this.radius[0] * Math.cos(this.rotation), start[1] + this.radius[0] * Math.sin(this.rotation)]),
      new Anchor("radius", [start[0] + this.radius[1] * Math.sin(this.rotation), start[1] + this.radius[1] * Math.cos(this.rotation)]),
    ];

    // Build shape
    this.path.ellipse(start[0], start[1], this.radius[0], this.radius[1], this.rotation, 0, 2 * Math.PI, false);
  }
}

export class Rectangle extends Shape {
  constructor(start, end) {
    super("rectangle");

    this.width = end[0] - start[0];
    this.height = end[1] - start[1];

    this.anchors = [
      new Anchor("position", start), 
      new Anchor("position", [start[0] + this.width, start[1]]),
      new Anchor("position", [start[0], start[1] + this.height]),
      new Anchor("position", [start[0] + this.width, start[1] + this.height]),
    ];

    // Build shape
    this.path.rect(start[0], start[1], this.width, this.height);
  }
}

export class RoundRectangle extends Shape {
  constructor(start, end, cornerRadii) {
    super("roundRectangle");

    this.width = end[0] - start[0];
    this.height = end[1] - start[1];
    this.cornerRadii = cornerRadii;

    this.anchors = [
      new Anchor("position", start), 
      new Anchor("position", [start[0] + this.width, start[1]]),
      new Anchor("position", [start[0], start[1] + this.height]),
      new Anchor("position", [start[0] + this.width, start[1] + this.height]),
    ];

    // Build shape
    this.path.roundRect(start[0], start[1], this.width, this.height, this.cornerRadii);
  }
}

export class Image {
  constructor(HTMLelement, position, dimensions) {
    this.HTMLelement = HTMLelement;
    this.position = position;
    this.setDimensions(dimensions);
    console.log(this.dimensions[0], this.dimensions[1]);
  }

  setSource(path) {
    this.HTMLelement.src = path;    
    this.setDimensions([500, 500]);
  }

  setDimensions(dimensions) {

    // TODO c'è qualcosa che non va
    if (dimensions[0] == "auto") {
      this.dimensions = [dimensions[1] * this.HTMLelement.naturalWidth / this.HTMLelement.naturalHeight, dimensions[1]];
    }
    else if (dimensions[1] == "auto") {
      this.dimensions = [dimensions[0], dimensions[0] * this.HTMLelement.naturalHeight / this.HTMLelement.naturalWidth];
    }
    else {
      this.dimensions = dimensions;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.HTMLelement, this.position[0], this.position[1], this.dimensions[0], this.dimensions[1]);
  }

}
