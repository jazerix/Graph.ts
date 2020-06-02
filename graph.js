window.onload = () => {
    var canvas = document.getElementById("d");
    var app = new Application(canvas);
};
class Application {
    constructor(canvas) {
        this.vertices = [];
        this.edges = [];
        this.connecting = null;
        this.context = canvas.getContext("2d");
        this.canvas = canvas;
        canvas.addEventListener("click", (e) => this.handleClick(e));
        canvas.addEventListener("mousemove", (e) => this.handleHover(e));
        window.addEventListener("keydown", (e) => {
            console.log(e.key);
            if (e.key === "Escape") {
                this.connecting = null;
                this.update();
            }
        });
    }
    update() {
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
    handleClick(e) {
        var position = this.getMousePos(e);
        var clickedVertex = this.vertexAt(position);
        if (clickedVertex == null) {
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
    elementExistsAt(position) {
        let shouldChange = false;
        for (let item of this.vertices) {
            if (item.isWithin(position))
                shouldChange = true;
        }
        return shouldChange;
    }
    vertexAt(position) {
        for (let vertex of this.vertices) {
            if (vertex.isWithin(position))
                return vertex;
        }
        return null;
    }
    handleHover(e) {
        let shouldChange = this.elementExistsAt(this.getMousePos(e));
        document.body.style.cursor = shouldChange ? "pointer" : "default";
        if (this.connecting === null) {
            return;
        }
        this.connecting.setEnd(this.getMousePos(e));
        this.update();
    }
    getMousePos(e) {
        var rect = this.canvas.getBoundingClientRect();
        return new Position(e.clientX - rect.left, e.clientY - rect.top);
    }
}
class Elem {
    constructor(notifier, position) {
        this.notifier = notifier;
        this.position = position;
    }
}
class Vertex extends Elem {
    constructor(notifier, position) {
        super(notifier, position);
        this.radius = 30;
    }
    draw(context) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = '#fff';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = "#000";
        context.stroke();
    }
    isWithin(position) {
        return Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2) < Math.pow(this.radius, 2);
    }
}
class Edge {
    constructor(start) {
        this._end = null;
        this.start = start;
    }
    draw(context) {
        if (this.endPosition() === null)
            return;
        var endPos = this.endPosition();
        context.beginPath();
        context.strokeStyle = this._end instanceof Vertex ? "#000" : '#F56E6E';
        context.moveTo(this.start.position.x, this.start.position.y);
        context.lineTo(endPos.x, endPos.y);
        context.stroke();
    }
    endPosition() {
        if (this._end === null)
            return null;
        if (this._end instanceof Vertex)
            return new Position(this._end.position.x, this._end.position.y);
        return this._end;
    }
    setEnd(end) {
        this._end = end;
    }
}
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
//# sourceMappingURL=graph.js.map