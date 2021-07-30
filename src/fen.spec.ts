import * as chess from "./chess";
import * as fen from "./fen";
import "./spec_utils";

describe("parse", () => {
  it("parses a position in FEN format", () => {
    expect(fen.parse("8/8/8/8/8/8/8/8")).toEqualValue(chess.Game.empty());
    expect(fen.parse("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")).toEqualValue(chess.Game.startingPosition());
    expect(fen.parse("rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R")).toEqualValue(
      chess.Game.startingPosition()
        .removePiece(chess.Square.fromString("e2")!)
        .addPiece(chess.Piece.fromString("P")!, chess.Square.fromString("e4")!)
        .removePiece(chess.Square.fromString("c7")!)
        .addPiece(chess.Piece.fromString("p")!, chess.Square.fromString("c5")!)
        .removePiece(chess.Square.fromString("g1")!)
        .addPiece(chess.Piece.fromString("N")!, chess.Square.fromString("f3")!)
    );
  });
});
