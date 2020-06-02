
window.onload = () => {
    var canvas = <HTMLCanvasElement>document.getElementById("d");
    var app = new Application(canvas);
}


class Application implements ShouldUpdate {


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

interface ShouldUpdate {
    update(): void;
}

abstract class Elem {
    notifier: ShouldUpdate;
    position: Position;

    constructor(notifier: ShouldUpdate, position: Position) {
        this.notifier = notifier;
        this.position = position;
    }

    public abstract isWithin(position: Position): boolean;

    public abstract draw(context: CanvasRenderingContext2D): void;


}

class Vertex extends Elem {

    radius: number = 30;

    constructor(notifier: ShouldUpdate, position: Position) {
        super(notifier, position);
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

class Edge {
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

class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
