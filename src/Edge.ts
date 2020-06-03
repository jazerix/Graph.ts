import { Vertex } from "./Vertex";
import { Position } from "./Position";

export class Edge {
    start: Vertex;
    private _end: Vertex | Position | null = null;

    constructor(start: Vertex) {
        this.start = start;
    }

    public draw(context: CanvasRenderingContext2D): void {
        if (this.endPosition() === null)
            return;
        var endPos: Position = this.endPosition();
        context.beginPath();
        context.strokeStyle = this._end instanceof Vertex ? "#000" : '#F56E6E';
        context.moveTo(this.start.position.x, this.start.position.y);
        context.lineTo(endPos.x, endPos.y);
        context.stroke();
    }

    private endPosition(): Position | null {
        if (this._end === null)
            return null;
        if (this._end instanceof Vertex)
            return new Position(this._end.position.x, this._end.position.y);
        return this._end;
    }


    public setEnd(end: Position|Vertex) {
        this._end = end;
    }
    

}
