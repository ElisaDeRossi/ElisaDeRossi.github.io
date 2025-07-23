class Shape {
  constructor(shapeType) {
    this.shapeType = shapeType;
    this.lineWidth = 1;
    this.isSelected = false;
    this.anchors = [];
    this.path = new Path2D();
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
  }

  draw(ctx) {
    let radius = 7;

    ctx.beginPath();

    switch (this.type) {
      case 'position':
        ctx.rect(this.center[0] - (radius+3) / 2, this.center[1] - (radius+3) / 2, radius + 3, radius + 3);
        break;

      case 'radius':
        ctx.arc(this.center[0], this.center[1], radius, 0, 2 * Math.PI);
        break;
    
      default: 
        break;
    }

    ctx.closePath();
    ctx.stroke();
  }
}

export class Line extends Shape {
  constructor(start, end) {
    super("line");

    this.anchors = [
      new Anchor("position", start), 
      new Anchor("position", end)
    ];

    this.updatePath();
  }

  updatePath() {
    this.path = new Path2D();

    let start = this.anchors[0].center;
    let end = this.anchors[1].center;

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

    this.updatePath();
  }

  updatePath() {
    this.path = new Path2D();

    let center = this.anchors[0].center;
    let radius = this.anchors[1].center[0] - this.anchors[0].center[0];

    this.path.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  }
}

export class Ellipse extends Shape {
  constructor(start, end, rotation) {
    super("ellipse");

    let radius = [Math.abs(end[0] - start[0])/2, Math.abs(end[1] - start[1])/2];
    this.rotation = rotation;   // In radians!

    this.anchors = [
      new Anchor("position", start), 
      new Anchor("radius", [start[0] + radius[0] * Math.cos(this.rotation), start[1] + radius[0] * Math.sin(this.rotation)]),
      new Anchor("radius", [start[0] + radius[1] * Math.sin(this.rotation), start[1] + radius[1] * Math.cos(this.rotation)]),
    ];

    this.updatePath();
  }

  updatePath() {
    this.path = new Path2D();

    let start = this.anchors[0].center;
    let radius = [
      (this.anchors[1].center[0] - start[0]) / Math.cos(this.rotation), 
      (this.anchors[2].center[1] - start[1]) / Math.cos(this.rotation)
    ];

    this.path.ellipse(start[0], start[1], radius[0], radius[1], this.rotation, 0, 2 * Math.PI, false);
  }
}

export class Rectangle extends Shape {
  constructor(start, end) {
    super("rectangle");

    this.anchors = [
      new Anchor("position", start), 
      new Anchor("position", [end[0],   start[1]]),
      new Anchor("position", [start[0], end[1]]),
      new Anchor("position", [end[0],   end[1]]),
    ];

    this.updatePath();
  }

  updatePath() {
    this.path = new Path2D();

    let start = this.anchors[0].center;
    let width = this.anchors[1].center[0] - start[0];
    let height = this.anchors[2].center[1] - start[1];

    this.path.rect(start[0], start[1], width, height);
  }
}

export class RoundRectangle extends Shape {
  constructor(start, end, cornerRadii) {
    super("roundRectangle");

    this.cornerRadii = cornerRadii;

    this.anchors = [
      new Anchor("position", start), 
      new Anchor("position", [end[0],   start[1]]),
      new Anchor("position", [start[0], end[1]]),
      new Anchor("position", [end[0],   end[1]]),
    ];

    this.updatePath();
  }

  updatePath() {
    this.path = new Path2D();

    let start = this.anchors[0].center;
    let width = this.anchors[1].center[0] - start[0];
    let height = this.anchors[2].center[1] - start[1];

    this.path.roundRect(start[0], start[1], width, height, this.cornerRadii);
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
