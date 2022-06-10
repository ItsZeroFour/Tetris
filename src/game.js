export default class Game {
  static points = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200,
  };

  score = 0;
  lines = 19;
  // Игровое поле
  playfield = this.createPlayfield();
  // Координаты движения блока
  activePiece = this.createPiece();
  // Слудающая вигура
  nextPiece = this.createPiece();

  // Системя уровней
  get level() {
    // Округляем уровень в нижнюю сторону
    return Math.floor(this.lines * 0.1);
  }

  getState() {
    const playfield = this.createPlayfield();
    const { y: pieceY, x: pieceX, blocks } = this.activePiece;

    for (let y = 0; y < this.playfield.length; y++) {
      playfield[y] = [];

      for (let x = 0; x < this.playfield[y].length; x++) {
        playfield[y][x] = this.playfield[y][x];
      }
    }

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          playfield[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }

    return {
      score: this.score,
      level: this.level,
      lines: this.lines,
      nextPiece: this.nextPiece,
      playfield,
    };
  }

  createPlayfield() {
    const playfield = [];

    for (let y = 0; y < 20; y++) {
      playfield[y] = [];

      for (let x = 0; x < 10; x++) {
        playfield[y][x] = 0;
      }
    }

    return playfield;
  }

  createPiece() {
    // Рандомная фигура
    const index = Math.floor(Math.random() * 7);
    const type = "IJLOSTZ"[index];
    const piece = {};

    // Генерация новой фигуры
    switch (type) {
      case "I":
        piece.blocks = [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        break;

      case "J":
        piece.blocks = [
          [0, 0, 0],
          [2, 2, 2],
          [0, 0, 2],
        ];
        break;

      case "L":
        piece.blocks = [
          [0, 0, 0],
          [3, 3, 3],
          [3, 0, 0],
        ];
        break;
      case "O":
        piece.blocks = [
          [0, 0, 0, 0],
          [0, 4, 4, 0],
          [0, 4, 4, 0],
          [0, 0, 0, 0],
        ];
        break;
      case "S":
        piece.blocks = [
          [0, 0, 0],
          [0, 5, 5],
          [5, 5, 0],
        ];
        break;
      case "T":
        piece.blocks = [
          [0, 0, 0],
          [6, 6, 6],
          [0, 6, 0],
        ];
        break;
      case "Z":
        piece.blocks = [
          [0, 0, 0],
          [7, 7, 0],
          [0, 7, 7],
        ];
        break;

      default:
        throw new Error("Неизвестный тип фигуры");
    }

    // Появление фигуры по центру игрвого поля
    piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
    // выравниваем фигуру (делаем ее появление чуть выше)
    piece.y = -1;

    return piece;
  }

  // Движение блока
  movePieceLeft() {
    this.activePiece.x -= 1;
    // Если блок уходит за границы игрового поля c левой стороны
    if (this.hasCollision()) {
      this.activePiece.x += 1;
    }
  }

  movePieceRight() {
    this.activePiece.x += 1;

    // Если блок уходит за границы игрового поля c правой стороны
    if (this.hasCollision()) {
      this.activePiece.x -= 1;
    }
  }

  movePieceDown() {
    this.activePiece.y += 1;

    // Если блок уходит за границы игрового поля c низу
    if (this.hasCollision()) {
      this.activePiece.y -= 1;
      this.lockPiece();
      const clearedLines = this.clearLines();
      this.updateScore(clearedLines);
      this.updatePieces();
    }
  }

  rotatePiece() {
    this.rotateBlocks();
    if (this.hasCollision()) {
      this.rotateBlocks(false);
    }
  }

  rotateBlocks(clockwise = true) {
    const blocks = this.activePiece.blocks;
    const length = blocks.length;
    const x = Math.floor(length / 2);
    const y = length - 1;

    for (let i = 0; i < x; i++) {
      for (let k = i; k < y - i; k++) {
        const temp = blocks[i][k];

        if (clockwise) {
          blocks[i][k] = blocks[y - k][i];
          blocks[y - k][i] = blocks[y - i][y - k];
          blocks[y - i][y - k] = blocks[k][y - i];
          blocks[k][y - i] = temp;
        } else {
          blocks[i][k] = blocks[k][y - i];
          blocks[k][y - i] = blocks[y - i][y - k];
          blocks[y - i][y - k] = blocks[y - k][i];
          blocks[y - k][i] = temp;
        }
      }
    }
  }

  // Если блок уходит за границы игрового поля
  hasCollision() {
    const { y: pieceY, x: pieceX, blocks } = this.activePiece;

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (
          blocks[y][x] &&
          // Проверка блока на нахождении его в игровом поле
          ((this.playfield[pieceY + y] === undefined ||
            this.playfield[pieceY + y][pieceX + x] === undefined) ||
            // Если другой блок уже стоит:
            this.playfield[pieceY + y][pieceX + x])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  lockPiece() {
    const { y: pieceY, x: pieceX, blocks } = this.activePiece;

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }
  }

  // Функция по определению, какая из строчек заполнена
  clearLines() {
    const rows = 20;
    const columns = 10;
    let lines = [];

    for (let y = rows - 1; y >= 0; y--) {
      let numberOfBlocks = 0;

      for (let x = 0; x < columns; x++) {
        if (this.playfield[y][x]) {
          numberOfBlocks += 1;
        }
      }

      if (numberOfBlocks === 0) {
        break;
      } else if (numberOfBlocks < columns) {
        continue;
      } else if (numberOfBlocks === columns) {
        lines.unshift(y);
      }
    }

    // Удаление заполненной строчки
    for (let index of lines) {
      this.playfield.splice(index, 1);
      this.playfield.unshift(new Array(columns).fill(0));
    }

    return lines.length;
  }

  updateScore(clearedLines) {
    if (clearedLines > 0) {
      this.score += Game.points[clearedLines] * (this.level + 1);
      this.lines += clearedLines;
    }
  }

  updatePieces() {
    this.activePiece = this.nextPiece;
    this.nextPiece = this.createPiece();
  }
}
