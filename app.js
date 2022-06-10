import Game from "./src/game.js";
import View from "./src/view.js";
import Controller from "./src/controller.js";

const root = document.querySelector("#root");

const game = new Game();
// Задаем парметры (Ширина, восота, кол-во рядов и колон)
const view = new View(root, 480, 640, 20, 10);
const controller = new Controller(game, view);

window.game = game;
window.view = view;
window.controller = controller;