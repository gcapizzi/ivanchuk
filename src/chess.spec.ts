import * as chess from "./chess";

describe("Game", () => {
  describe("empty", () => {
    it("returns a Game with no pieces", () => {
      const game = chess.Game.empty();

      for (let column of chess.Square.Columns) {
        for (let file of chess.Square.Files) {
          expect(game.getPieceAt(new chess.Square(column, file))).toBeUndefined();
        }
      }
    });
  });

  describe("fromStartingPosition", () => {
    it("returns a Game from the starting position", () => {
      const game = chess.Game.fromStartingPosition();

      expect(game.getPieceAt(chess.Square.fromString("a1")!)).toEqual(chess.Piece.fromString("R"));
      expect(game.getPieceAt(chess.Square.fromString("b1")!)).toEqual(chess.Piece.fromString("N"));
      expect(game.getPieceAt(chess.Square.fromString("c1")!)).toEqual(chess.Piece.fromString("B"));
      expect(game.getPieceAt(chess.Square.fromString("d1")!)).toEqual(chess.Piece.fromString("Q"));
      expect(game.getPieceAt(chess.Square.fromString("e1")!)).toEqual(chess.Piece.fromString("K"));
      expect(game.getPieceAt(chess.Square.fromString("f1")!)).toEqual(chess.Piece.fromString("B"));
      expect(game.getPieceAt(chess.Square.fromString("g1")!)).toEqual(chess.Piece.fromString("N"));
      expect(game.getPieceAt(chess.Square.fromString("h1")!)).toEqual(chess.Piece.fromString("R"));

      for (let loc of ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"]) {
        expect(game.getPieceAt(chess.Square.fromString(loc)!)).toEqual(chess.Piece.fromString("P"));
      }

      // prettier-ignore
      for (let loc of [
        "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
        "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
        "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
        "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"
      ]) {
        expect(game.getPieceAt(chess.Square.fromString(loc)!)).toBeUndefined();
      }

      for (let loc of ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"]) {
        expect(game.getPieceAt(chess.Square.fromString(loc)!)).toEqual(chess.Piece.fromString("p"));
      }

      expect(game.getPieceAt(chess.Square.fromString("a8")!)).toEqual(chess.Piece.fromString("r"));
      expect(game.getPieceAt(chess.Square.fromString("b8")!)).toEqual(chess.Piece.fromString("n"));
      expect(game.getPieceAt(chess.Square.fromString("c8")!)).toEqual(chess.Piece.fromString("b"));
      expect(game.getPieceAt(chess.Square.fromString("d8")!)).toEqual(chess.Piece.fromString("q"));
      expect(game.getPieceAt(chess.Square.fromString("e8")!)).toEqual(chess.Piece.fromString("k"));
      expect(game.getPieceAt(chess.Square.fromString("f8")!)).toEqual(chess.Piece.fromString("b"));
      expect(game.getPieceAt(chess.Square.fromString("g8")!)).toEqual(chess.Piece.fromString("n"));
      expect(game.getPieceAt(chess.Square.fromString("h8")!)).toEqual(chess.Piece.fromString("r"));
    });
  });

  describe("addPiece", () => {
    it("returns a new Game with the provided piece added to the provided square", () => {
      const game = chess.Game.empty();
      const whitePawn = new chess.Piece(chess.Piece.Colour.WHITE, chess.Piece.Type.PAWN);
      const a1 = new chess.Square(chess.Square.Column.A, chess.Square.File._1);
      const b2 = new chess.Square(chess.Square.Column.B, chess.Square.File._2);

      expect(game.addPiece(whitePawn, a1).getPieceAt(a1)).toEqual(whitePawn);
      expect(game.addPiece(whitePawn, a1).getPieceAt(b2)).toBeUndefined();
      expect(game.addPiece(whitePawn, a1).addPiece(whitePawn, b2).getPieceAt(a1)).toEqual(whitePawn);
    });
  });
});
