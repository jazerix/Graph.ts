import { ShouldUpdate } from "./ShouldUpdate";
import { Vertex } from "./Vertex";
import { Edge } from "./Edge";
import { Position } from "./Position";

window.onload = () => {
    var canvas = <HTMLCanvasElement>document.getElementById("d");
    var app = new Graph(canvas);
}

export class Graph implements ShouldUpdate {


    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    vertices: Array<Vertex> = []
    edges: Array<Edge> = [];
    connecting: Edge | null = null;

    preventClick: boolean = false;
    dragStartPosition: Position = null;
    dragging: Vertex = null;

    preventClickTime: number = 0;
    clickDelay: number = 100;

    constructor(canvas: HTMLCanvasElement) {
        this.context = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.canvas = canvas;
        canvas.addEventListener("click", (e) => this.handleClick(e))
        canvas.addEventListener("mousemove", (e) => this.handleHover(e));
        canvas.addEventListener("mousedown", (e) => this.startDrag(e))
        canvas.addEventListener("mouseup", (e) => this.endDrag(e));
        canvas.addEventListener("dblclick", (e) => {
            //console.log("db click");
        })
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.connecting = null;
                this.update();
            }

        });
    }

    update(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let edge of this.edges) {
            edge.draw(this.context);
        }
        if (this.connecting !== null)
            this.connecting.draw(this.context);
        for (let item of this.vertices) {
            item.draw(this.context);
        }
    }

    startDrag(e: MouseEvent) {
        this.dragStartPosition = this.getMousePos(e);
        this.dragging = this.vertexAt(this.dragStartPosition);
        this.preventClickTime = Date.now();
    }

    endDrag(e: MouseEvent) {
        let endPos: Position = this.getMousePos(e);
        let threshold: number = 10;

        if (this.dragging != null) {
            this.preventClick = true;

        }

        this.dragging = null;
    }

    private isClickPrevented(): boolean {
        if (this.preventClickTime == 0)
            return true;
        return Date.now() - this.preventClickTime > this.clickDelay;
    }

    handleClick(e: MouseEvent) {
        if (this.isClickPrevented())
            return;

        var position = this.getMousePos(e);
        var clickedVertex = this.vertexAt(position);
        if (clickedVertex == null && this.connecting == null) {
            this.vertices.push(new Vertex(this, position));
        }
        else {
            if (this.connecting == null)
                this.connecting = new Edge(clickedVertex);
            else {
                this.connecting.setEnd(clickedVertex);
                this.edges.push(this.connecting);
                this.connecting = null;
            }
        }
        this.update();
    }

    private elementExistsAt(position: Position): boolean {
        let shouldChange: boolean = false;
        for (let item of this.vertices) {
            if (item.isWithin(position))
                shouldChange = true;
        }
        return shouldChange;
    }

    private vertexAt(position: Position): Vertex | null {
        for (let vertex of this.vertices) {
            if (vertex.isWithin(position))
                return vertex;
        }
        return null;
    }


    handleHover(e: MouseEvent): void {

        let reDraw: boolean = false;
        let shouldChange = this.elementExistsAt(this.getMousePos(e));
        document.body.style.cursor = shouldChange ? "pointer" : "default";

        if (this.connecting !== null) {
            this.connecting.setEnd(this.getMousePos(e));
            reDraw = true;
        }

        if (this.dragging !== null && Date.now() - this.preventClickTime > this.clickDelay) {
            this.dragging.position = this.getMousePos(e);
            reDraw = true;
        }

        if (reDraw)
            this.update();
    }

    private getMousePos(e: MouseEvent): Position {
        var rect = this.canvas.getBoundingClientRect();
        return new Position(e.clientX - rect.left, e.clientY - rect.top);
    }

}