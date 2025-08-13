export class Shape {
  shapeType : string;
  lineWidth : number = 1;
  isSelected : boolean = false; 
  anchors : Anchor[] = [];
  path : Path2D = new Path2D();

  constructor(shapeType : string) {
    this.shapeType = shapeType;
  }

  draw(ctx : CanvasRenderingContext2D) {
    ctx.stroke(this.path);

    if (this.isSelected)
      this.anchors.forEach(anchor => {
        anchor.draw(ctx);
      });
  }

  updatePath(param ?: any) : void {}
}

class Anchor extends Shape{
  type : string;
  center : [number, number];

  constructor(type : string, center : [number, number]) {
    super("anchor");

    this.type = type;
    this.center = center;

    this.updatePath(center);
  }

  updatePath(center : [number, number]) {

    let radius = 7;
    this.path = new Path2D();
    this.center = center;

    switch (this.type) {
      case 'position':
        this.path.rect(this.center[0] - (radius + 3) / 2, this.center[1] - (radius + 3) / 2, radius + 3, radius + 3);
        break;

      case 'radius':
        this.path.arc(this.center[0], this.center[1], radius, 0, 2 * Math.PI);
        break;

      default:
        break;
    }
  }

  draw(ctx : CanvasRenderingContext2D) {
    super.draw(ctx);
  }
}

export class Line extends Shape {
  constructor(start : [number, number], end : [number, number]) {
    super("line");

    this.anchors = [
      new Anchor("position", start),
      new Anchor("position", end)
    ];

    this.updatePath();
  }

  updatePath(anchorIndex ?: number) {
    this.path = new Path2D();

    let start = this.anchors[0].center;
    let end = this.anchors[1].center;

    this.path.moveTo(start[0], start[1]);
    this.path.lineTo(end[0], end[1]);
  }

  draw(ctx : CanvasRenderingContext2D) {
    super.draw(ctx);
  }
}

export class Circle extends Shape {

  radius : number;

  constructor(center : [number, number], radius : number) {
    super("circle");

    this.radius = radius;

    this.anchors = [
      new Anchor("position", center),
      new Anchor("radius", [center[0] + radius, center[1]])
    ];

    this.updatePath();
  }

  updatePath(anchorIndex ?: number) {
    this.path = new Path2D();

    let center = this.anchors[0].center;

    switch (anchorIndex) {
      // Se sposto il centro sposto anche il raggio
      case 0:
        this.anchors[1].updatePath([center[0] + this.radius, center[1]]);
        break;

      // Se sposto il raggio, aggiusto la posizione sull'asse Y
      case 1:
        this.anchors[1].updatePath([this.anchors[1].center[0], center[1]]);
        break;
    }
    this.radius = Math.abs(this.anchors[1].center[0] - center[0]);

    this.path.arc(center[0], center[1], this.radius, 0, 2 * Math.PI);
  }
}

export class Ellipse extends Shape {

  radius : [number, number];
  rotation : number;

  constructor(start : [number, number], end : [number, number], rotation : number) {
    super("ellipse");

    this.radius = [Math.abs(end[0] - start[0]) / 2, Math.abs(end[1] - start[1]) / 2];
    this.rotation = rotation;   // In radians!

    this.anchors = [
      new Anchor("position", start),
      new Anchor("radius", [start[0] + this.radius[0] * Math.cos(this.rotation), start[1] + this.radius[0] * Math.sin(this.rotation)]),
      new Anchor("radius", [start[0] + this.radius[1] * Math.sin(this.rotation), start[1] + this.radius[1] * Math.cos(this.rotation)]),
    ];

    this.updatePath();
  }

  updatePath(anchorIndex ?: number) {
    this.path = new Path2D();

    let center : [number, number] = this.anchors[0].center;

    switch (anchorIndex) {
      // Se sposto il centro sposto anche i raggi
      case 0:
        this.anchors[1].updatePath([center[0] + this.radius[0], center[1]]);
        this.anchors[2].updatePath([center[0], center[1] + this.radius[1]]);
        break;

      // Se sposto il raggio1, aggiusto la posizione sull'asse Y
      case 1:
        this.anchors[1].updatePath([this.anchors[1].center[0], center[1]]);
        break;

      // Se sposto il raggio2, aggiusto la posizione sull'asse X
      case 2:
        this.anchors[2].updatePath([center[0], this.anchors[2].center[1]]);
        break;
    }

    this.radius = [
      Math.abs(this.anchors[1].center[0] - center[0]) / Math.cos(this.rotation),
      Math.abs(this.anchors[2].center[1] - center[1]) / Math.cos(this.rotation)
    ];

    this.path.ellipse(center[0], center[1], this.radius[0], this.radius[1], this.rotation, 0, 2 * Math.PI, false);
  }
}

export class Rectangle extends Shape {

  cornerRadii : number[]|number;

  constructor(start : [number, number], end : [number, number], cornerRadii : number[]|number) {
    super("rectangle");

    this.cornerRadii = cornerRadii;

    this.anchors = [
      new Anchor("position", start),                // Top-left
      new Anchor("position", [end[0], start[1]]),   // Top-right
      new Anchor("position", [start[0], end[1]]),   // Bottom-left
      new Anchor("position", end),                  // Bottom-right
      new Anchor("position", [start[0] + (end[0] - start[0]) / 2, start[1] + (end[1] - start[1]) / 2]) // Center
    ];

    this.updatePath();
  }

  updatePath(anchorIndex ?: number) {
    this.path = new Path2D();

    if (anchorIndex != null) {
      let anchorPosition = this.anchors[anchorIndex].center;

      switch (anchorIndex) {

        // Se cambio angolo top-left, cambio anche angolo top-right e bottom-left
        case 0:
          this.anchors[1].updatePath([this.anchors[1].center[0], anchorPosition[1]]);
          this.anchors[2].updatePath([anchorPosition[0], this.anchors[2].center[1]]);
          break;

        // Se cambio angolo top-right, cambio anche angolo top-left e bottom-right
        case 1:
          this.anchors[0].updatePath([this.anchors[0].center[0], anchorPosition[1]]);
          this.anchors[3].updatePath([anchorPosition[0], this.anchors[3].center[1]]);
          break;

        // Se cambio angolo bottom-left, cambio anche angolo top-left e bottom-right
        case 2:
          this.anchors[0].updatePath([anchorPosition[0], this.anchors[0].center[1]]);
          this.anchors[3].updatePath([this.anchors[3].center[0], anchorPosition[1]]);
          break;

        // Se cambio angolo bottom-right, cambio anche angolo top-right e bottom-left
        case 3:
          this.anchors[1].updatePath([anchorPosition[0], this.anchors[1].center[1]]);
          this.anchors[2].updatePath([this.anchors[2].center[0], anchorPosition[1]]);
          break;

        // Se cambio il centro, cambio anche gli angoli
        case 4:
          let width : number = this.anchors[1].center[0] - this.anchors[0].center[0];
          let height : number = this.anchors[2].center[1] - this.anchors[0].center[1];
          let start : [number, number] = [anchorPosition[0] - width / 2, anchorPosition[1] - height / 2];
          let end : [number, number] = [anchorPosition[0] + width / 2, anchorPosition[1] + height / 2];
          this.anchors[0].updatePath(start);
          this.anchors[1].updatePath([end[0], start[1]]);
          this.anchors[2].updatePath([start[0], end[1]]);
          this.anchors[3].updatePath(end);
          break;
      }

      if (anchorIndex != 4) {
        let end : [number, number] = this.anchors[3].center;
        let start : [number, number] = this.anchors[0].center;
        this.anchors[4].updatePath([start[0] + (end[0] - start[0]) / 2, start[1] + (end[1] - start[1]) / 2]);
      }
    }

    let start : [number, number] = this.anchors[0].center;
    let width : number = this.anchors[1].center[0] - start[0];
    let height : number = this.anchors[2].center[1] - start[1];

    this.path.roundRect(start[0], start[1], width, height, this.cornerRadii);
  }
}

export class Image {

  HTMLelement : HTMLImageElement;
  position : [number, number];
  dimensions : [number, number] = [-1,-1];

  constructor(HTMLelement : HTMLImageElement, position : [number, number], dimensions : [number, number]) {
    this.HTMLelement = HTMLelement;
    this.position = position;
    this.dimensions = dimensions;
  }

  setSource(path : string) {
    this.HTMLelement.src = path;
    this.dimensions = [500,500];
  }

  draw(ctx : CanvasRenderingContext2D) {
    ctx.drawImage(this.HTMLelement, this.position[0], this.position[1], this.dimensions[0], this.dimensions[1]);
  }

}
