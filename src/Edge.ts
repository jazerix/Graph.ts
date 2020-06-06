import { Vertex } from "./Vertex";
import { Position } from "./Position";

export class Edge {
    start: Vertex;
    directed: boolean = true;
    vertexSize: number = 30;
    private _end: Vertex | Position | null = null;

    constructor(start: Vertex) {
        this.start = start;
    }

    public draw(context: CanvasRenderingContext2D): void {
        if (this.endPosition() === null)
            return;
        var endPos: Position = this.endPosition();
        let angle = Math.atan2(endPos.y - this.start.position.y, endPos.x - this.start.position.x);

        context.beginPath();
        context.strokeStyle = this._end instanceof Vertex ? "#000" : '#F56E6E';
        let startPos = this.start.position.offset(this.vertexSize, angle);
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(endPos.x, endPos.y);

        context.stroke();
        //this.drawArrow(context, 250, 250, 350, 350, 0, 0, 20);
        //this.drawArrow(context, this.start.position.x, this.start.position.y, endPos.x, endPos.y, .5, 20)
    }

    private drawArrow(context: CanvasRenderingContext2D, x1, y1, x2, y2, angle, d) {
        var lineAngle = Math.atan2(y2 - y1, x2 - x1);
        x1 = x1 + Math.cos(lineAngle) * this.vertexSize;
        y1 = y1 + Math.sin(lineAngle) * this.vertexSize;

        x2 = x2 - Math.cos(lineAngle) * this.vertexSize;
        y2 = y2 - Math.sin(lineAngle) * this.vertexSize;

        var h = Math.abs(d / Math.cos(angle));

        var angle1 = lineAngle + Math.PI + angle;
        var topx = x2 + Math.cos(angle1) * h;
        var topy = y2 + Math.sin(angle1) * h;
        var angle2 = lineAngle + Math.PI - angle;
        var botx = x2 + Math.cos(angle2) * h;
        var boty = y2 + Math.sin(angle2) * h;


        //console.log(x2, y2, topx, topy, botx, boty);

        var radius = 1;
        var twoPI = 2 * Math.PI;
        //context.save();
        //context.moveTo(x1, y1);
        //context.lineTo(x2, y2);
        //context.lineTo(topx, topy);
        context.moveTo(botx, boty);
        context.lineTo(x2, y2)
        context.moveTo(topx, topy);
        context.lineTo(x2, y2);
        context.moveTo(x2, y2);
        context.lineTo(x1, y1);
        //context.arc(x2,y2,radius,0,twoPI,false);
        /*context.stroke();
        context.beginPath();
        context.arc(topx,topy,radius,0,twoPI,false);
        context.stroke();
        context.beginPath();
        context.arc(botx, boty,radius,0,twoPI,false);*/
        context.lineWidth = 5;
        context.stroke();
        //context.restore();


    }

    private endPosition(): Position | null {
        if (this._end === null)
            return null;
        if (this._end instanceof Vertex) {
            let angle = this.start.position.angle(this._end.position.x, this._end.position.y);
            return new Position(this._end.position.x, this._end.position.y).offset(-this.vertexSize, angle);
        }
        return this._end;
    }


    public setEnd(end: Position | Vertex) {
        this._end = end;
    }


}
