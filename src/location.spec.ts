import * as chess from "./chess";

describe("Location", () => {
  describe("fromString", () => {
    it("builds a Location from a PGN-like string", () => {
      expect(chess.Location.fromString("d4")).toEqual(
        new chess.Location(chess.Location.Column.D, chess.Location.File._4)
      );
      expect(chess.Location.fromString("E5")).toEqual(
        new chess.Location(chess.Location.Column.E, chess.Location.File._5)
      );
    });

    describe("when the string is invalid", () => {
      it("returns undefined", () => {
        expect(chess.Location.fromString("")).toBeUndefined();
        expect(chess.Location.fromString("j4")).toBeUndefined();
        expect(chess.Location.fromString("a9")).toBeUndefined();
        expect(chess.Location.fromString("d42")).toBeUndefined();
      });
    });
  });

  describe("equals", () => {
    it("returns true if the two pieces are equal, false otherwise", () => {
      expect(chess.Location.fromString("e4")?.equals(chess.Location.fromString("e4")!)).toBe(true);
      expect(chess.Location.fromString("e4")?.equals(chess.Location.fromString("e5")!)).toBe(false);
      expect(chess.Location.fromString("e4")?.equals(chess.Location.fromString("d4")!)).toBe(false);
    });
  });

  describe("hashCode", () => {
    it("returns the same number if the two pieces are equal, different numbers otherwise", () => {
      expect(chess.Location.fromString("e4")?.hashCode()).toEqual(chess.Location.fromString("e4")?.hashCode());
      expect(chess.Location.fromString("e4")?.hashCode()).not.toEqual(chess.Location.fromString("e5")?.hashCode());
      expect(chess.Location.fromString("e4")?.hashCode()).not.toEqual(chess.Location.fromString("d4")?.hashCode());
    });
  });
});
