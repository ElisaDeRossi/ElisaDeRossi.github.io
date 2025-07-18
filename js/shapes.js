class Shape {
  constructor(shapeType) {
    this.shapeType = shapeType;
    this.path = new Path2D();
    this.lineWidth = 1;
    this.isSelected = false;
  }

  draw(ctx) {
    ctx.stroke(this.path);
  }
}

export class Line extends Shape {
  constructor(start, end) {
    super("line");

    this.start = start;
    this.end = end;

    // Build shape
    this.path.moveTo(this.start[0], this.start[1]);
    this.path.lineTo(this.end[0], this.end[1]);

    // Anchors
    this.anchorStart = new Anchor(this.start, 10);
    this.anchorEnd = new Anchor(this.end, 10);
  }

  draw(ctx) {
    super.draw(ctx);

    if (this.isSelected) {
      this.anchorStart.draw(ctx);
      this.anchorEnd.draw(ctx);
    }
  }
}

class Anchor extends Shape {
  constructor(center, radius) {
    super("circle");

    this.center = center;
    this.radius = radius;

    // Build shape
    // ctx.arc(centerX, centerY, radius, begin, end)
    this.path.arc(this.center[0], this.center[1], this.radius, 0, 2 * Math.PI);
  }

  draw(ctx) {
    super.draw(ctx);
  }
}

export class Circle extends Shape {
  constructor(center, radius) {
    super("circle");

    this.center = center;
    this.radius = radius;

    // Build shape
    // ctx.arc(centerX, centerY, radius, begin, end)
    this.path.arc(this.center[0], this.center[1], this.radius, 0, 2 * Math.PI);

    // Anchors
    this.anchorCenter = new Anchor(this.center, 10);
    this.anchorRadius = new Anchor([this.center[0] + this.radius, this.center[1]], 10);
  }

  draw(ctx) {
    super.draw(ctx);

    if (this.isSelected) {
      this.anchorCenter.draw(ctx);
      this.anchorRadius.draw(ctx);
    }
  }
}

export class Ellipse extends Shape {
  constructor(start, end, rotation) {
    super("ellipse");

    this.center = start;
    this.radius = [Math.abs(end[0] - start[0])/2, Math.abs(end[1] - start[1])/2];
    this.rotation = rotation;   // In radians!

    // Build shape
    // ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    this.path.ellipse(this.center[0], this.center[1], this.radius[0], this.radius[1], this.rotation, 0, 2 * Math.PI, false);

    // Anchors
    this.anchorCenter = new Anchor(this.center, 10);
    this.anchorRadiusH = new Anchor([this.center[0] + this.radius[0] * Math.cos(this.rotation), this.center[1] + this.radius[0] * Math.sin(this.rotation)], 10);
    this.anchorRadiusV = new Anchor([this.center[0] + this.radius[1] * Math.sin(this.rotation), this.center[1] + this.radius[1] * Math.cos(this.rotation)], 10);
  }

  draw(ctx) {
    super.draw(ctx);

    if (this.isSelected) {
      this.anchorCenter.draw(ctx);
      this.anchorRadiusH.draw(ctx);
      this.anchorRadiusV.draw(ctx);
    }
  }
}

export class Rectangle extends Shape {
  constructor(start, end) {
    super("rectangle");

    this.start = start;
    this.width = end[0] - start[0];
    this.height = end[1] - start[1];

    // Build shape
    // ctx.rect(startX, startY, width, height)
    this.path.rect(this.start[0], this.start[1], this.width, this.height);

    // Anchors
    this.anchorPoint1 = new Anchor(this.start, 10);
    this.anchorPoint2 = new Anchor([this.start[0] + this.width, this.start[1]], 10);
    this.anchorPoint3 = new Anchor([this.start[0], this.start[1] + this.height], 10);
    this.anchorPoint4 = new Anchor([this.start[0] + this.width, this.start[1] + this.height], 10);
  }

  draw(ctx) {
    super.draw(ctx);

    if (this.isSelected) {
      this.anchorPoint1.draw(ctx);
      this.anchorPoint2.draw(ctx);
      this.anchorPoint3.draw(ctx);
      this.anchorPoint4.draw(ctx);
    }
  }
}

export class RoundRectangle extends Shape {
  constructor(start, end, cornerRadii) {
    super("roundRectangle");
    this.start = start;
    this.width = end[0] - start[0];
    this.height = end[1] - start[1];
    this.cornerRadii = cornerRadii;

    // Build shape
    // ctx.roundRect(x, y, width, height, radii)
    this.path.roundRect(this.start[0], this.start[1], this.width, this.height, this.cornerRadii);

    // Anchors
    this.anchorPoint1 = new Anchor(this.start, 10);
    this.anchorPoint2 = new Anchor([this.start[0] + this.width, this.start[1]], 10);
    this.anchorPoint3 = new Anchor([this.start[0], this.start[1] + this.height], 10);
    this.anchorPoint4 = new Anchor([this.start[0] + this.width, this.start[1] + this.height], 10);
  }

  draw(ctx) {
    super.draw(ctx);

    if (this.isSelected) {
      this.anchorPoint1.draw(ctx);
      this.anchorPoint2.draw(ctx);
      this.anchorPoint3.draw(ctx);
      this.anchorPoint4.draw(ctx);
    }
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
