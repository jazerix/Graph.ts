import { Vertex } from "./Vertex";
import { Position } from "./Position";

export class Edge {
    start: Vertex;
    directed: boolean = true;
    vertexSize: number = 30;
    private _end: Vertex | Position | null = null;

    constructor(start: Vertex, directed: boolean = false) {
        this.start = start;
        this.directed = directed;
    }

    public draw(context: CanvasRenderingContext2D): void {
        if (this.endPosition() === null)
            return;
        let endPos = this.endPosition();
        if (endPos == null)
            return;
        let angle = Math.atan2(endPos.y - this.start.position.y, endPos.x - this.start.position.x);

        context.beginPath();
        context.strokeStyle = this._end instanceof Vertex ? "#000" : '#F56E6E';
        let startPos = this.start.position.offset(this.vertexSize, angle);
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(endPos.x, endPos.y);

        context.stroke();

        if (this.directed)
            this.drawArrow(context, .5, 20)
    }

    private drawArrow(context: CanvasRenderingContext2D, angle: number, distance: number) {
        let endPosition = this.endPosition();
        if (endPosition == null)
            return;
        /*if (this._end == null)
            return;*/

        var lineAngle = Math.atan2(endPosition.y - this.start.position.y, endPosition.x - this.start.position.x);
        endPosition = endPosition.offset(this.vertexSize, lineAngle);
        let x2 = endPosition.x - Math.cos(lineAngle) * this.vertexSize;
        let y2 = endPosition.y - Math.sin(lineAngle) * this.vertexSize;

        var h = Math.abs(distance / Math.cos(angle));

        var angle1 = lineAngle + Math.PI + angle;
        var topx = x2 + Math.cos(angle1) * h;
        var topy = y2 + Math.sin(angle1) * h;
        var angle2 = lineAngle + Math.PI - angle;
        var botx = x2 + Math.cos(angle2) * h;
        var boty = y2 + Math.sin(angle2) * h;

        context.moveTo(botx, boty);
        context.lineTo(x2, y2)
        context.moveTo(topx, topy);
        context.lineTo(x2, y2);
        context.moveTo(x2, y2);
        context.lineWidth = 5;
        context.stroke();


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

    public endVertex(): Vertex | null {
        return this._end instanceof Vertex ? this._end : null;
    }


    public setEnd(end: Position | Vertex) {
        this._end = end;
    }


}
