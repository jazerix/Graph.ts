import { ShouldUpdate } from "./ShouldUpdate";
import { Vertex } from "./Vertex";
import { Edge } from "./Edge";
import { Position } from "./Position";

export class Application implements ShouldUpdate {


    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    vertices: Array<Vertex> = []
    edges: Array<Edge> = [];
    connecting: Edge | null = null;


    constructor(canvas: HTMLCanvasElement) {
        this.context = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.canvas = canvas;
        canvas.addEventListener("click", (e) => this.handleClick(e))
        canvas.addEventListener("mousemove", (e) => this.handleHover(e));
        window.addEventListener("keydown", (e) => {
            console.log(e.key);
            if (e.key === "Escape") {
                this.connecting = null;
                this.update();
            }

        })
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

    handleClick(e: MouseEvent) {
        var position = this.getMousePos(e);
        var clickedVertex = this.vertexAt(position);
        if (clickedVertex == null) {
            this.vertices.push(new Vertex(this, position));
        }
        else {
            if (this.connecting == null)
                this.connecting = new Edge(clickedVertex);
            else
            {
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
        let shouldChange = this.elementExistsAt(this.getMousePos(e));
        document.body.style.cursor = shouldChange ? "pointer" : "default";

        if (this.connecting === null) {
            return;
        }
        this.connecting.setEnd(this.getMousePos(e));
        this.update();
    }

    private getMousePos(e: MouseEvent): Position {
        var rect = this.canvas.getBoundingClientRect();
        return new Position(e.clientX - rect.left, e.clientY - rect.top);
    }

}