import * as chess from "./chess";

export function parse(fen: string): chess.Game | undefined {
  let game = chess.Game.empty();
  const files = fen.split("/");

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
