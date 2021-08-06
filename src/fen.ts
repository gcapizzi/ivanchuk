import * as chess from "./chess";

// TODO handle invalid strings
export function parse(fen: string): chess.Game | undefined {
  let game = chess.Game.empty();
  const [board, nextToMove, _, enPassant] = fen.split(" ");
  if (nextToMove.toLowerCase() === "b") {
    game = game.withNextToMove(chess.Piece.Colour.BLACK);
  }
  if (enPassant !== "-") {
    game = game.withEnPassantSquare(chess.Square.fromString(enPassant)!);
  }

  const files = board.split("/");
  let file = chess.Square.File._8;
  for (let f of files) {
    let col = chess.Square.Column.A;
    for (let c of f.split("")) {
      let emptySquares = parseInt(c);
      if (isNaN(emptySquares)) {
        game = game.addPiece(chess.Piece.fromString(c)!, new chess.Square(col, file));
        col += 1;
      } else {
        col += emptySquares;
      }
    }
    file -= 1;
  }
  return game;
}

export function render(game: chess.Game): string {
  let fileStrs = [];

  for (let file of chess.Square.Files.slice().reverse()) {
    let fileStr = "";
    let counter = 0;
    for (let column of chess.Square.Columns) {
      const piece = game.getPiece(new chess.Square(column, file));
      if (piece == undefined) {
        counter += 1;
      } else {
        if (counter > 0) {
          fileStr += counter;
          counter = 0;
        }
        fileStr += piece.toString();
      }
    }
    if (counter > 0) {
      fileStr += counter;
    }
    fileStrs.push(fileStr);
  }

  let nextToMove = "w";
  if (game.getNextToMove() === chess.Piece.Colour.BLACK) {
    nextToMove = "b";
  }

  const enPassantSquare = game.getEnPassantSquare();
  let enPassant = "-"
  if (enPassantSquare !== undefined) {
    enPassant = enPassantSquare.toString().toLowerCase();
  }

  return fileStrs.join("/") + " " + nextToMove + " - " + enPassant;
}
