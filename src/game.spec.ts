import * as chess from "./chess";
import { Piece } from "./piece";
import { Square } from "./square";

import { checkAllowedMoves, newGame } from "./spec_utils";

describe("Game", () => {
  describe("empty", () => {
    it("returns a Game with no pieces", () => {
      const game = chess.Game.empty();

      for (let column of chess.Square.Columns) {
        for (let file of chess.Square.Files) {
          expect(game.getPiece(new chess.Square(column, file))).toBeUndefined();
        }
      }
    });
  });

  describe("fromStartingPosition", () => {
    it("returns a Game from the starting position", () => {
      const game = chess.Game.startingPosition();

      expect(game.getPiece(chess.Square.fromString("a1")!)).toEqual(chess.Piece.fromString("R"));
      expect(game.getPiece(chess.Square.fromString("b1")!)).toEqual(chess.Piece.fromString("N"));
      expect(game.getPiece(chess.Square.fromString("c1")!)).toEqual(chess.Piece.fromString("B"));
      expect(game.getPiece(chess.Square.fromString("d1")!)).toEqual(chess.Piece.fromString("Q"));
      expect(game.getPiece(chess.Square.fromString("e1")!)).toEqual(chess.Piece.fromString("K"));
      expect(game.getPiece(chess.Square.fromString("f1")!)).toEqual(chess.Piece.fromString("B"));
      expect(game.getPiece(chess.Square.fromString("g1")!)).toEqual(chess.Piece.fromString("N"));
      expect(game.getPiece(chess.Square.fromString("h1")!)).toEqual(chess.Piece.fromString("R"));

      for (let loc of ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"]) {
        expect(game.getPiece(chess.Square.fromString(loc)!)).toEqual(chess.Piece.fromString("P"));
      }

      // prettier-ignore
      for (let loc of [
        "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
        "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
        "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
        "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"
      ]) {
        expect(game.getPiece(chess.Square.fromString(loc)!)).toBeUndefined();
      }

      for (let loc of ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"]) {
        expect(game.getPiece(chess.Square.fromString(loc)!)).toEqual(chess.Piece.fromString("p"));
      }

      expect(game.getPiece(chess.Square.fromString("a8")!)).toEqual(chess.Piece.fromString("r"));
      expect(game.getPiece(chess.Square.fromString("b8")!)).toEqual(chess.Piece.fromString("n"));
      expect(game.getPiece(chess.Square.fromString("c8")!)).toEqual(chess.Piece.fromString("b"));
      expect(game.getPiece(chess.Square.fromString("d8")!)).toEqual(chess.Piece.fromString("q"));
      expect(game.getPiece(chess.Square.fromString("e8")!)).toEqual(chess.Piece.fromString("k"));
      expect(game.getPiece(chess.Square.fromString("f8")!)).toEqual(chess.Piece.fromString("b"));
      expect(game.getPiece(chess.Square.fromString("g8")!)).toEqual(chess.Piece.fromString("n"));
      expect(game.getPiece(chess.Square.fromString("h8")!)).toEqual(chess.Piece.fromString("r"));
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
      const whitePawn = new chess.Piece(chess.Piece.Colour.WHITE, chess.Piece.Type.PAWN);
      const a1 = new chess.Square(chess.Square.Column.A, chess.Square.File._1);
      const b2 = new chess.Square(chess.Square.Column.B, chess.Square.File._2);

      expect(game.addPiece(whitePawn, a1).getPiece(a1)).toEqual(whitePawn);
      expect(game.addPiece(whitePawn, a1).getPiece(b2)).toBeUndefined();
      expect(game.addPiece(whitePawn, a1).addPiece(whitePawn, b2).getPiece(a1)).toEqual(whitePawn);
    });
  });

  describe("move", () => {
    describe("pawns", () => {
      const game = newGame(["P", "f2"], ["P", "e3"]);
      checkAllowedMoves(game, "f2", ["f3", "f4"]);
      checkAllowedMoves(game, "e3", ["e4"]);
      checkAllowedMoves(
        newGame(
          ["P", "b3"],
          ["p", "b4"],
          ["p", "c4"],
          ["p", "c3"],
          ["p", "c2"],
          ["p", "b2"],
          ["p", "a2"],
          ["p", "a3"],
          ["p", "a4"]
        ),
        "b3",
        ["a4", "c4"]
      );
    });
  });
});
