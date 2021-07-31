import * as chess from "./chess";
import * as fen from "./fen";
import { Piece } from "./piece";
import { Square } from "./square";

import { checkAllowedMoves } from "./spec_utils";

describe("Game", () => {
  describe("empty", () => {
    it("returns a Game with no pieces", () => {
      expect(chess.Game.empty()).toEqualValue(fen.parse("8/8/8/8/8/8/8/8")!);
    });
  });

  describe("fromStartingPosition", () => {
    it("returns a Game from the starting position", () => {
      expect(chess.Game.startingPosition()).toEqualValue(fen.parse("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")!);
    });
  });

  describe("equals and hashCode", () => {
    it("implements immutable.ValueObject correctly", () => {
      const game1 = chess.Game.empty()
        .addPiece(Piece.fromString("P")!, Square.fromString("E4")!)
        .addPiece(Piece.fromString("p")!, Square.fromString("E5")!);
      const game2 = chess.Game.empty()
        .addPiece(Piece.fromString("p")!, Square.fromString("E5")!)
        .addPiece(Piece.fromString("P")!, Square.fromString("E4")!);
      const game3 = chess.Game.empty()
        .addPiece(Piece.fromString("p")!, Square.fromString("E5")!)
        .addPiece(Piece.fromString("P")!, Square.fromString("E3")!);

      expect(game1.equals(game2)).toBe(true);
      expect(game1.hashCode()).toEqual(game2.hashCode());
      expect(game1.equals(game3)).toBe(false);
      expect(game2.equals(game3)).toBe(false);
    });
  });

  describe("addPiece", () => {
    it("returns a new Game with the provided piece added to the provided square", () => {
      const game = chess.Game.empty();
      const whitePawn = chess.Piece.fromString("P")!;
      const a1 = chess.Square.fromString("A1")!;
      const b2 = chess.Square.fromString("B2")!;

      expect(game.addPiece(whitePawn, a1).getPiece(a1)).toEqual(whitePawn);
      expect(game.addPiece(whitePawn, a1).getPiece(b2)).toBeUndefined();
      expect(game.addPiece(whitePawn, a1).addPiece(whitePawn, b2).getPiece(a1)).toEqual(whitePawn);
    });
  });

  describe("removePiece", () => {
    it("returns a new Game with the piece on the provided square removed", () => {
      const game = chess.Game.startingPosition();
      const e2 = Square.fromString("e2")!;
      expect(game.removePiece(e2).getPiece(e2)).toBeUndefined();
      expect(game.removePiece(Square.fromString("e4")!)).toEqualValue(game);
    });
  });

  describe("move", () => {
    describe("pawns", () => {
      it("moves the pawn", () => {
        let game = fen.parse("8/5p2/4p3/8/8/4P3/5P2/8")!;
        checkAllowedMoves(game, "f2", ["f3", "f4"]);
        checkAllowedMoves(game, "e3", ["e4"]);
        checkAllowedMoves(game, "f7", ["f6", "f5"]);
        checkAllowedMoves(game, "e6", ["e5"]);

        game = fen.parse("8/PPP5/PpP5/PPP5/ppp5/pPp5/ppp5/8")!;
        checkAllowedMoves(game, "b3", ["a4", "c4"]);
        checkAllowedMoves(game, "b6", ["a5", "c5"]);
      });
    });
  });
});
