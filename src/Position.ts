export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public compare(position: Position) {
        return this.x == position.x && this.y == position.y;
    }

    public offset(distance: number, angle: number): Position {
        let x = this.x + Math.cos(angle) * distance;
        let y = this.y + Math.sin(angle) * distance;
        return new Position(x, y);
    }

    public angle(x: number, y: number): number {
        return Math.atan2(y - this.y, x - this.x);
    }

}
