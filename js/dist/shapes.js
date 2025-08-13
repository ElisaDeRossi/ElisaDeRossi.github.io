export class Shape {
    constructor(shapeType) {
        this.lineWidth = 1;
        this.isSelected = false;
        this.anchors = [];
        this.path = new Path2D();
        this.shapeType = shapeType;
    }
    draw(ctx) {
        ctx.stroke(this.path);
        if (this.isSelected)
            this.anchors.forEach(anchor => {
                anchor.draw(ctx);
            });
    }
    updatePath(param) { }
}
class Anchor extends Shape {
    constructor(type, center) {
        super("anchor");
        this.type = type;
        this.center = center;
        this.updatePath(center);
    }
    updatePath(center) {
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
    draw(ctx) {
        super.draw(ctx);
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
    updatePath(anchorIndex) {
        this.path = new Path2D();
        let start = this.anchors[0].center;
        let end = this.anchors[1].center;
        this.path.moveTo(start[0], start[1]);
        this.path.lineTo(end[0], end[1]);
    }
    draw(ctx) {
        super.draw(ctx);
    }
}
export class Circle extends Shape {
    constructor(center, radius) {
        super("circle");
        this.radius = radius;
        this.anchors = [
            new Anchor("position", center),
            new Anchor("radius", [center[0] + radius, center[1]])
        ];
        this.updatePath();
    }
    updatePath(anchorIndex) {
        this.path = new Path2D();
        let center = this.anchors[0].center;
        switch (anchorIndex) {
            case 0:
                this.anchors[1].updatePath([center[0] + this.radius, center[1]]);
                break;
            case 1:
                this.anchors[1].updatePath([this.anchors[1].center[0], center[1]]);
                break;
        }
        this.radius = Math.abs(this.anchors[1].center[0] - center[0]);
        this.path.arc(center[0], center[1], this.radius, 0, 2 * Math.PI);
    }
}
export class Ellipse extends Shape {
    constructor(start, end, rotation) {
        super("ellipse");
        this.radius = [Math.abs(end[0] - start[0]) / 2, Math.abs(end[1] - start[1]) / 2];
        this.rotation = rotation;
        this.anchors = [
            new Anchor("position", start),
            new Anchor("radius", [start[0] + this.radius[0] * Math.cos(this.rotation), start[1] + this.radius[0] * Math.sin(this.rotation)]),
            new Anchor("radius", [start[0] + this.radius[1] * Math.sin(this.rotation), start[1] + this.radius[1] * Math.cos(this.rotation)]),
        ];
        this.updatePath();
    }
    updatePath(anchorIndex) {
        this.path = new Path2D();
        let center = this.anchors[0].center;
        switch (anchorIndex) {
            case 0:
                this.anchors[1].updatePath([center[0] + this.radius[0], center[1]]);
                this.anchors[2].updatePath([center[0], center[1] + this.radius[1]]);
                break;
            case 1:
                this.anchors[1].updatePath([this.anchors[1].center[0], center[1]]);
                break;
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
    constructor(start, end, cornerRadii) {
        super("rectangle");
        this.cornerRadii = cornerRadii;
        this.anchors = [
            new Anchor("position", start),
            new Anchor("position", [end[0], start[1]]),
            new Anchor("position", [start[0], end[1]]),
            new Anchor("position", end),
            new Anchor("position", [start[0] + (end[0] - start[0]) / 2, start[1] + (end[1] - start[1]) / 2])
        ];
        this.updatePath();
    }
    updatePath(anchorIndex) {
        this.path = new Path2D();
        if (anchorIndex != null) {
            let anchorPosition = this.anchors[anchorIndex].center;
            switch (anchorIndex) {
                case 0:
                    this.anchors[1].updatePath([this.anchors[1].center[0], anchorPosition[1]]);
                    this.anchors[2].updatePath([anchorPosition[0], this.anchors[2].center[1]]);
                    break;
                case 1:
                    this.anchors[0].updatePath([this.anchors[0].center[0], anchorPosition[1]]);
                    this.anchors[3].updatePath([anchorPosition[0], this.anchors[3].center[1]]);
                    break;
                case 2:
                    this.anchors[0].updatePath([anchorPosition[0], this.anchors[0].center[1]]);
                    this.anchors[3].updatePath([this.anchors[3].center[0], anchorPosition[1]]);
                    break;
                case 3:
                    this.anchors[1].updatePath([anchorPosition[0], this.anchors[1].center[1]]);
                    this.anchors[2].updatePath([this.anchors[2].center[0], anchorPosition[1]]);
                    break;
                case 4:
                    let width = this.anchors[1].center[0] - this.anchors[0].center[0];
                    let height = this.anchors[2].center[1] - this.anchors[0].center[1];
                    let start = [anchorPosition[0] - width / 2, anchorPosition[1] - height / 2];
                    let end = [anchorPosition[0] + width / 2, anchorPosition[1] + height / 2];
                    this.anchors[0].updatePath(start);
                    this.anchors[1].updatePath([end[0], start[1]]);
                    this.anchors[2].updatePath([start[0], end[1]]);
                    this.anchors[3].updatePath(end);
                    break;
            }
            if (anchorIndex != 4) {
                let end = this.anchors[3].center;
                let start = this.anchors[0].center;
                this.anchors[4].updatePath([start[0] + (end[0] - start[0]) / 2, start[1] + (end[1] - start[1]) / 2]);
            }
        }
        let start = this.anchors[0].center;
        let width = this.anchors[1].center[0] - start[0];
        let height = this.anchors[2].center[1] - start[1];
        this.path.roundRect(start[0], start[1], width, height, this.cornerRadii);
    }
}
export class Image {
    constructor(HTMLelement, position, dimensions) {
        this.dimensions = [-1, -1];
        this.HTMLelement = HTMLelement;
        this.position = position;
        this.dimensions = dimensions;
    }
    setSource(path) {
        this.HTMLelement.src = path;
        this.dimensions = [500, 500];
    }
    draw(ctx) {
        ctx.drawImage(this.HTMLelement, this.position[0], this.position[1], this.dimensions[0], this.dimensions[1]);
    }
}
