export default class Controller {
  constructor(game, view) {
    this.game = game;
    this.view = view;

    // Фигура будет падать без нашего участия
    setInterval(() => {
      this.update();
    }, 1000);

    // Движение блока
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    // this.view.renderStartScreen();
  }

  update() {
    this.game.movePieceDown();
    this.view.renderMainScreen(this.game.getState());
  }

  handleKeyDown(event) {
    switch (event.keyCode) {
      // Enter
      case 13:
        this.view.renderMainScreen(this.game.getState());

      // 37 - left arrow
      case 37:
        this.game.movePieceLeft();
        this.view.renderMainScreen(game.getState());
        break;

      // 38 - au arrow
      case 38:
        this.game.rotatePiece();
        this.view.renderMainScreen(game.getState());
        break;

      // 39 -  Right arrow
      case 39:
        this.game.movePieceRight();
        this.view.renderMainScreen(game.getState());
        break;

      // 40 - down arrow
      case 40:
        this.game.movePieceDown();
        this.view.renderMainScreen(game.getState());
        break;
    }
  }
}
