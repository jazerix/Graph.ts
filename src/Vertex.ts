import { Position } from "./Position"
import { ShouldUpdate } from "./ShouldUpdate";

export class Vertex {

    radius: number = 30;
    notifier: ShouldUpdate;
    position: Position;

    constructor(notifier: ShouldUpdate, position: Position) {
        this.notifier = notifier;
        this.position = position;
    }

    draw(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = '#fff';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = "#000";
        context.stroke();
    }

    public isWithin(position: Position): boolean {

        return Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2) < Math.pow(this.radius, 2);
    }
}