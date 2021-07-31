import * as chess from "./chess";

// TODO handle invalid strings
export function parse(fen: string): chess.Game | undefined {
  let game = chess.Game.empty();
  const [board, nextToMove] = fen.split(" ");
  if (nextToMove.toLowerCase() === "b") {
    game = game.withNextToMove(chess.Piece.Colour.BLACK);
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
