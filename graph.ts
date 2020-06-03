import { Application } from "./Application";


window.onload = () => {
    var canvas = <HTMLCanvasElement>document.getElementById("d");
    var app = new Application(canvas);
}
