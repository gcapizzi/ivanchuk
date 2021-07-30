import * as chess from "./chess";
import * as fen from "./fen";

describe("parse", () => {
  it("parses a position in FEN format", () => {
    expect(fen.parse("8/8/8/8/8/8/8/8")?.equals(chess.Game.empty())).toBe(true);
    expect(fen.parse("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")?.equals(chess.Game.startingPosition())).toBe(true);
  });
});
