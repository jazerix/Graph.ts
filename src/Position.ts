export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public compare(position: Position)
    {
        return this.x == position.x && this.y == position.y;
    }
}
