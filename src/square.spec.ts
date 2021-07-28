import * as chess from "./chess";

describe("Square", () => {
  describe("fromString", () => {
    it("builds a Square from a PGN-like string", () => {
      expect(chess.Square.fromString("d4")).toEqual(new chess.Square(chess.Square.Column.D, chess.Square.File._4));
      expect(chess.Square.fromString("E5")).toEqual(new chess.Square(chess.Square.Column.E, chess.Square.File._5));
    });

    describe("when the string is invalid", () => {
      it("returns undefined", () => {
        expect(chess.Square.fromString("")).toBeUndefined();
        expect(chess.Square.fromString("j4")).toBeUndefined();
        expect(chess.Square.fromString("a9")).toBeUndefined();
        expect(chess.Square.fromString("d42")).toBeUndefined();
      });
    });
  });

  describe("equals", () => {
    it("returns true if the two pieces are equal, false otherwise", () => {
      expect(chess.Square.fromString("e4")?.equals(chess.Square.fromString("e4")!)).toBe(true);
      expect(chess.Square.fromString("e4")?.equals(chess.Square.fromString("e5")!)).toBe(false);
      expect(chess.Square.fromString("e4")?.equals(chess.Square.fromString("d4")!)).toBe(false);
    });
  });

  describe("hashCode", () => {
    it("returns the same number if the two pieces are equal, different numbers otherwise", () => {
      expect(chess.Square.fromString("e4")?.hashCode()).toEqual(chess.Square.fromString("e4")?.hashCode());
      expect(chess.Square.fromString("e4")?.hashCode()).not.toEqual(chess.Square.fromString("e5")?.hashCode());
      expect(chess.Square.fromString("e4")?.hashCode()).not.toEqual(chess.Square.fromString("d4")?.hashCode());
    });
  });

  describe("addFile", () => {
    it("returns a new square n files ahead (or behind if negative", () => {
      expect(chess.Square.fromString("e2")?.addFile(2)?.equals(chess.Square.fromString("e4")!)).toBe(true);
      expect(chess.Square.fromString("e5")?.addFile(-3)?.equals(chess.Square.fromString("e2")!)).toBe(true);
      expect(chess.Square.fromString("e8")?.addFile(1)).toBeUndefined();
      expect(chess.Square.fromString("e1")?.addFile(-1)).toBeUndefined();
    });
  });

  describe("addColumn", () => {
    it("returns a new square n columns right (or left if negative", () => {
      expect(chess.Square.fromString("e2")?.addColumn(2)?.equals(chess.Square.fromString("g2")!)).toBe(true);
      expect(chess.Square.fromString("e5")?.addColumn(-3)?.equals(chess.Square.fromString("b5")!)).toBe(true);
      expect(chess.Square.fromString("h1")?.addColumn(1)).toBeUndefined();
      expect(chess.Square.fromString("a1")?.addColumn(-1)).toBeUndefined();
    });
  });
});
