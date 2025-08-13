import { Line, Circle, Rectangle, Ellipse } from './shapes.js';
function getCheckedFormElement(DOMelement) {
    for (let index = 0; index < DOMelement.elements.length; index++) {
        let element = DOMelement.elements[index];
        if (element.checked)
            return element.value;
    }
    return '';
}
let canvas = document.getElementById("myCanvas");
if (canvas) {
    let ctx = canvas.getContext("2d");
    if (ctx) {
        var requestAnimationFrame = window.requestAnimationFrame;
        let shapeList = [];
        let tempShape;
        let isDragging = false;
        let rect = canvas.getBoundingClientRect();
        let startX, startY;
        let currentX, currentY;
        let shapeElement = document.getElementById('shapeType');
        let shapeType = shapeElement ? getCheckedFormElement(shapeElement) : null;
        let selectedShape = -1;
        let selectedAnchor = -1;
        let modeElement = document.getElementById('mode');
        window.onresize = function () {
            rect = canvas.getBoundingClientRect();
        };
        modeElement.onchange = () => {
            let mode = modeElement ? getCheckedFormElement(modeElement) : 'shape';
            switch (mode) {
                case 'shape':
                    shapeElement.style.display = 'block';
                    shapeList.forEach(shape => { shape.isSelected = false; });
                    selectedShape = -1;
                    selectedAnchor = -1;
                    rect = canvas.getBoundingClientRect();
                    isDragging = false;
                    canvas.onmousedown = (event) => {
                        isDragging = true;
                        startX = event.clientX - rect.left;
                        startY = event.clientY - rect.top;
                        shapeType = getCheckedFormElement(shapeElement);
                    };
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
                                    tempShape = new Rectangle([startX, startY], [currentX, currentY], 0);
                                    break;
                                case 'roundRect':
                                    tempShape = new Rectangle([startX, startY], [currentX, currentY], [8, 8, 8, 8]);
                                    break;
                                default:
                                    tempShape = new Line([startX, startY], [currentX, currentY]);
                                    break;
                            }
                        }
                    };
                    canvas.onmouseup = () => {
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
                                        shapeList.push(new Rectangle([startX, startY], [currentX, currentY], 0));
                                        break;
                                    case 'roundRect':
                                        shapeList.push(new Rectangle([startX, startY], [currentX, currentY], [8, 8, 8, 8]));
                                        break;
                                    default:
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
                    canvas.onmouseup = () => {
                        let isPointInStroke = false;
                        let selected = false;
                        for (let i = 0; i < shapeList.length; i++) {
                            ctx.lineWidth = shapeList[i].lineWidth + 9;
                            isPointInStroke = ctx.isPointInStroke(shapeList[i].path, currentX, currentY);
                            ctx.lineWidth = shapeList[i].lineWidth;
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
                    document.onkeydown = (event) => {
                        if (selectedShape != -1 && event.code == 'Delete') {
                            shapeList.splice(selectedShape, 1);
                            selectedShape = -1;
                            selectedAnchor = -1;
                        }
                    };
                    break;
            }
        };
        function drawEverything() {
            if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (var i = 0; i < shapeList.length; i++) {
                    shapeList[i].draw(ctx);
                }
                if (tempShape)
                    tempShape.draw(ctx);
            }
            requestAnimationFrame(drawEverything);
        }
        drawEverything();
    }
}
