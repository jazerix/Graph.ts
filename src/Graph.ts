import { ShouldUpdate } from "./ShouldUpdate";
import { Vertex } from "./Vertex";
import { Edge } from "./Edge";
import { Position } from "./Position";
import { Mode } from "./GraphMode";

window.onload = () => {
    var canvas = <HTMLCanvasElement>document.getElementById("d");
    var app = new Graph(canvas);
    document.getElementById("clear")?.addEventListener("click", (e) => app.clear());
    document.getElementById("default")?.addEventListener("click", (e) => app.setMode(Mode.Default));
    document.getElementById("create")?.addEventListener("click", (e) => app.setMode(Mode.Create));
}

export class Graph implements ShouldUpdate {

    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    vertices: Array<Vertex> = []
    edges: Array<Edge> = [];
    connecting: Edge | null = null;
    selectedVertex: Vertex | null = null;

    preventClick: boolean = false;
    dragStartPosition: Position | null = null;
    dragging: Vertex | null = null;

    preventClickTime: number = 0;
    clickDelay: number = 125;
    mode: Mode = Mode.Create;

    constructor(canvas: HTMLCanvasElement) {
        this.context = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.canvas = canvas;
        canvas.addEventListener("click", (e) => this.handleClick(e))
        canvas.addEventListener("mousemove", (e) => this.handleHover(e));
        canvas.addEventListener("mousedown", (e) => this.startDrag(e))
        canvas.addEventListener("mouseup", (e) => this.endDrag(e));
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.connecting = null;
                this.update();
            } else if (e.key === "Delete") {
                this.deleteSelectedVertex();
            }

        });
    }

    update(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let item of this.vertices) {
            item.draw(this.context);
        }
        if (this.connecting !== null)
            this.connecting.draw(this.context);
        for (let edge of this.edges) {
            edge.draw(this.context);
        }
    }

    startDrag(e: MouseEvent) {
        this.dragStartPosition = this.getMousePos(e);
        this.dragging = this.vertexAt(this.dragStartPosition);
        this.preventClickTime = Date.now();
    }

    endDrag(e: MouseEvent) {
        if (this.dragging != null)
            this.preventClick = true;

        this.dragging = null;
    }

    private isClickPrevented(e: MouseEvent): boolean {
        let mousePos = this.getMousePos(e);
        if (this.preventClickTime == 0)
            return true;
        if (this.dragStartPosition != null && this.dragStartPosition.compare(mousePos))
            return false;

        return Date.now() - this.preventClickTime > this.clickDelay;
    }

    handleClick(e: MouseEvent) {
        if (this.isClickPrevented(e))
            return;

        this.handleMode(this.getMousePos(e));
        this.update();
    }

    private handleMode(position: Position): void {
        let clickedVertex = this.vertexAt(position);


        if (this.mode == Mode.Default) {
            this.selectVertex(clickedVertex);
            return;
        }
        else if (this.mode == Mode.Create) {
            this.createVertices(clickedVertex, position);
        }

    }

    private createVertices(vertex: Vertex | null, position: Position): void {
        if (vertex == null && this.connecting == null) {
            this.vertices.push(new Vertex(this, position));
            return;
        }
        if (vertex == null)
            return;
        if (this.connecting == null)
            this.connecting = new Edge(vertex);
        else {
            this.connecting.setEnd(vertex);
            this.edges.push(this.connecting);
            this.connecting = null;
        }
    }

    private selectVertex(vertex: Vertex | null): void {
        if (this.selectedVertex != null)
            this.selectedVertex.selected = false;
        if (this.selectedVertex == vertex || vertex == null) {
            this.selectedVertex = null;
            return;
        }

        vertex.selected = true;
        this.selectedVertex = vertex;
    }

    private deleteSelectedVertex(): void {
        if (this.selectedVertex == null)
            return;
        let deleteEdges = [];
        for (let edge of this.edges) {
            if (edge.start == this.selectedVertex) {
                deleteEdges.push(edge);
                continue;
            }
            if (edge.endVertex() != null && edge.endVertex() == this.selectedVertex)
                deleteEdges.push(edge);
        }
        this.deleteEdges(deleteEdges);
        
        let index = this.vertices.indexOf(this.selectedVertex, 0);
        if (index > -1)
            this.vertices.splice(index, 1);

        this.update();
    }

    private deleteEdges(edges: Array<Edge>): void {
        for (let edge of edges) {
            let index = this.edges.indexOf(edge, 0);
            if (index <= -1)
                continue;
            this.edges.splice(index, 1);
        }
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

    public clear(): void {
        this.edges = [];
        this.vertices = [];
        this.update();
    }

    public setMode(mode: Mode) {
        this.mode = mode;
    }

}