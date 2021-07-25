import * as chess from "./chess";

describe("Piece", () => {
  describe("fromString", () => {
    it("builds a Piece from a FEN-like string", () => {
      expect(chess.Piece.fromString("P")).toEqual(new chess.Piece(chess.Piece.Colour.WHITE, chess.Piece.Type.PAWN));
      expect(chess.Piece.fromString("N")).toEqual(new chess.Piece(chess.Piece.Colour.WHITE, chess.Piece.Type.KNIGHT));
      expect(chess.Piece.fromString("B")).toEqual(new chess.Piece(chess.Piece.Colour.WHITE, chess.Piece.Type.BISHOP));
      expect(chess.Piece.fromString("R")).toEqual(new chess.Piece(chess.Piece.Colour.WHITE, chess.Piece.Type.ROOK));
      expect(chess.Piece.fromString("Q")).toEqual(new chess.Piece(chess.Piece.Colour.WHITE, chess.Piece.Type.QUEEN));
      expect(chess.Piece.fromString("K")).toEqual(new chess.Piece(chess.Piece.Colour.WHITE, chess.Piece.Type.KING));
      expect(chess.Piece.fromString("p")).toEqual(new chess.Piece(chess.Piece.Colour.BLACK, chess.Piece.Type.PAWN));
      expect(chess.Piece.fromString("n")).toEqual(new chess.Piece(chess.Piece.Colour.BLACK, chess.Piece.Type.KNIGHT));
      expect(chess.Piece.fromString("b")).toEqual(new chess.Piece(chess.Piece.Colour.BLACK, chess.Piece.Type.BISHOP));
      expect(chess.Piece.fromString("r")).toEqual(new chess.Piece(chess.Piece.Colour.BLACK, chess.Piece.Type.ROOK));
      expect(chess.Piece.fromString("q")).toEqual(new chess.Piece(chess.Piece.Colour.BLACK, chess.Piece.Type.QUEEN));
      expect(chess.Piece.fromString("k")).toEqual(new chess.Piece(chess.Piece.Colour.BLACK, chess.Piece.Type.KING));
    });

    describe("when the string is invalid", () => {
      it("returns undefined", () => {
        expect(chess.Piece.fromString("")).toBeUndefined();
        expect(chess.Piece.fromString("Pp")).toBeUndefined();
        expect(chess.Piece.fromString("X")).toBeUndefined();
      });
    });
  });

  describe("equals", () => {
    it("returns true if the two pieces are equal, false otherwise", () => {
      expect(chess.Piece.fromString("B")?.equals(chess.Piece.fromString("B")!)).toBe(true);
      expect(chess.Piece.fromString("B")?.equals(chess.Piece.fromString("b")!)).toBe(false);
      expect(chess.Piece.fromString("B")?.equals(chess.Piece.fromString("Q")!)).toBe(false);
    });
  });

  describe("hashCode", () => {
    it("returns the same number if the two pieces are equal, different numbers otherwise", () => {
      expect(chess.Piece.fromString("B")?.hashCode()).toEqual(chess.Piece.fromString("B")?.hashCode());
      expect(chess.Piece.fromString("B")?.hashCode()).not.toEqual(chess.Piece.fromString("b")?.hashCode());
      expect(chess.Piece.fromString("B")?.hashCode()).not.toEqual(chess.Piece.fromString("Q")?.hashCode());
    });
  });
});
