import * as chess from "./chess";
import * as fen from "./fen";
import "./spec_utils";

describe("parse", () => {
  it("parses a position in FEN format", () => {
    expect(fen.parse("8/8/8/8/8/8/8/8 w - -")).toEqualValue(chess.Game.empty());
    expect(fen.parse("8/8/8/8/8/8/8/8 b - -")).toEqualValue(
      chess.Game.empty().withNextToMove(chess.Piece.Colour.BLACK)
    );
    expect(fen.parse("8/8/8/8/8/8/8/8 w - e3")).toEqualValue(
      chess.Game.empty().withEnPassantSquare(chess.Square.fromString("e3")!)
    );
    expect(fen.parse("8/8/8/8/8/8/8/8 w kQ -")).toEqualValue(
      chess.Game.empty().allowShortCastling(chess.Piece.Colour.BLACK).allowLongCastling(chess.Piece.Colour.WHITE)
    );
    expect(fen.parse("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqKQ -")).toEqualValue(
      chess.Game.startingPosition()
    );
    expect(fen.parse("rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b kKqQ -")).toEqualValue(
      chess.Game.startingPosition()
        .removePiece(chess.Square.fromString("e2")!)
        .addPiece(chess.Piece.fromString("P")!, chess.Square.fromString("e4")!)
        .removePiece(chess.Square.fromString("c7")!)
        .addPiece(chess.Piece.fromString("p")!, chess.Square.fromString("c5")!)
        .removePiece(chess.Square.fromString("g1")!)
        .addPiece(chess.Piece.fromString("N")!, chess.Square.fromString("f3")!)
        .withNextToMove(chess.Piece.Colour.BLACK)
    );
  });
});

describe("render", () => {
  it("renders a game into a FEN string", () => {
    expect(fen.render(fen.parse("8/8/8/8/8/8/8/8 w - -")!)).toEqual("8/8/8/8/8/8/8/8 w - -");
    expect(fen.render(fen.parse("8/8/8/8/8/8/8/8 b - -")!)).toEqual("8/8/8/8/8/8/8/8 b - -");
    expect(fen.render(fen.parse("8/8/8/8/8/8/8/8 w - e3")!)).toEqual("8/8/8/8/8/8/8/8 w - e3");
    expect(fen.render(fen.parse("8/8/8/8/8/8/8/8 w kQ e3")!)).toEqual("8/8/8/8/8/8/8/8 w Qk e3");
    expect(fen.render(fen.parse("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kKqQ -")!)).toEqual(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -"
    );
    expect(fen.render(fen.parse("rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b - -")!)).toEqual(
      "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b - -"
    );
  });
});
