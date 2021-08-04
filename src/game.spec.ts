import * as chess from "./chess";
import * as fen from "./fen";

import { checkAllowedMoves } from "./spec_utils";

describe("Game", () => {
  describe("empty", () => {
    it("returns a Game with no pieces and white to move", () => {
      expect(chess.Game.empty()).toEqualValue(fen.parse("8/8/8/8/8/8/8/8 w")!);
    });
  });

  describe("fromStartingPosition", () => {
    it("returns a Game from the starting position with white to move", () => {
      expect(chess.Game.startingPosition()).toEqualValue(fen.parse("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w")!);
    });
  });

  describe("equals and hashCode", () => {
    it("implements immutable.ValueObject correctly", () => {
      const game1 = chess.Game.empty()
        .addPiece(chess.Piece.fromString("P")!, chess.Square.fromString("E4")!)
        .addPiece(chess.Piece.fromString("p")!, chess.Square.fromString("E5")!);
      const game2 = chess.Game.empty()
        .addPiece(chess.Piece.fromString("p")!, chess.Square.fromString("E5")!)
        .addPiece(chess.Piece.fromString("P")!, chess.Square.fromString("E4")!);
      const game3 = chess.Game.empty()
        .addPiece(chess.Piece.fromString("p")!, chess.Square.fromString("E5")!)
        .addPiece(chess.Piece.fromString("P")!, chess.Square.fromString("E3")!);
      const game4 = chess.Game.empty()
        .withNextToMove(chess.Piece.Colour.BLACK)
        .addPiece(chess.Piece.fromString("P")!, chess.Square.fromString("E4")!)
        .addPiece(chess.Piece.fromString("p")!, chess.Square.fromString("E5")!);

      expect(game1.equals(game2)).toBe(true);
      expect(game1.hashCode()).toEqual(game2.hashCode());
      expect(game1.equals(game3)).toBe(false);
      expect(game2.equals(game3)).toBe(false);
      expect(game1.equals(game4)).toBe(false);
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
      const e2 = chess.Square.fromString("e2")!;
      expect(game.removePiece(e2).getPiece(e2)).toBeUndefined();
      expect(game.removePiece(chess.Square.fromString("e4")!)).toEqualValue(game);
    });
  });

  describe("nextToMove", () => {
    it("sets/gets the next colour to move", () => {
      expect(chess.Game.empty().withNextToMove(chess.Piece.Colour.BLACK).getNextToMove()).toEqual(
        chess.Piece.Colour.BLACK
      );
    });
  });

  describe("move", () => {
    it("switches the next to move colour", () => {
      let game = chess.Game.startingPosition();
      expect(game.getNextToMove()).toEqual(chess.Piece.Colour.WHITE);
      checkAllowedMoves(game, "e2", ["e3", "e4"]);
      checkAllowedMoves(game, "e7", []);

      game = game.move(chess.Square.fromString("e2")!, chess.Square.fromString("e4")!);
      expect(game.getNextToMove()).toEqual(chess.Piece.Colour.BLACK);
      checkAllowedMoves(game, "e4", []);
      checkAllowedMoves(game, "e7", ["e6", "e5"]);
    });

    describe("pawns", () => {
      it("moves the pawn", () => {
        let game = fen.parse("8/8/4p3/8/8/4P3/5P2/8 w")!;
        checkAllowedMoves(game, "f2", ["f3", "f4"]);
        checkAllowedMoves(game, "e3", ["e4"]);
        checkAllowedMoves(game, "e6", []);

        game = fen.parse("8/5p2/4p3/8/8/4P3/8/8 b")!;
        checkAllowedMoves(game, "e3", []);
        checkAllowedMoves(game, "f7", ["f6", "f5"]);
        checkAllowedMoves(game, "e6", ["e5"]);

        game = fen.parse("8/PPP5/PpP5/PPP5/ppp5/pPp5/ppp5/8 w")!;
        checkAllowedMoves(game, "b3", ["a4", "c4"]);
        checkAllowedMoves(game, "b6", []);

        game = fen.parse("8/PPP5/PpP5/PPP5/ppp5/pPp5/ppp5/8 b")!;
        checkAllowedMoves(game, "b3", []);
        checkAllowedMoves(game, "b6", ["a5", "c5"]);
      });

      it("allows en passant captures", () => {
        let game = chess.Game.startingPosition()
          .move(chess.Square.fromString("e2")!, chess.Square.fromString("e4")!)
          .move(chess.Square.fromString("c7")!, chess.Square.fromString("c5")!)
          .move(chess.Square.fromString("e4")!, chess.Square.fromString("e5")!)
          .move(chess.Square.fromString("c5")!, chess.Square.fromString("c4")!)
          .move(chess.Square.fromString("d2")!, chess.Square.fromString("d4")!);

        checkAllowedMoves(game, "c4", ["c3", "d3"]);

        let missedEnPassantGame = game
          .move(chess.Square.fromString("a7")!, chess.Square.fromString("a6")!)
          .move(chess.Square.fromString("a2")!, chess.Square.fromString("a3")!);

        checkAllowedMoves(missedEnPassantGame, "c4", ["c3"]);

        game = game.move(chess.Square.fromString("f7")!, chess.Square.fromString("f5")!);

        checkAllowedMoves(game, "e5", ["e6", "f6"]);

        missedEnPassantGame = game
          .move(chess.Square.fromString("a2")!, chess.Square.fromString("a3")!)
          .move(chess.Square.fromString("a7")!, chess.Square.fromString("a6")!);

        checkAllowedMoves(missedEnPassantGame, "e5", ["e6"]);
      });
    });

    describe("knights", () => {
      it("moves the knight", () => {
        const game = chess.Game.empty().addPiece(chess.Piece.fromString("N")!, chess.Square.fromString("d4")!);
        checkAllowedMoves(game, "d4", ["e6", "f5", "f3", "e2", "c2", "b3", "b5", "c6"]);
      });

      it("doesn't allow non-existing or occupied-by-us squares", () => {
        const whiteGame = chess.Game.startingPosition();
        checkAllowedMoves(whiteGame, "b1", ["a3", "c3"]);
        checkAllowedMoves(whiteGame, "g1", ["f3", "h3"]);

        const blackGame = chess.Game.startingPosition().withNextToMove(chess.Piece.Colour.BLACK);
        checkAllowedMoves(blackGame, "b8", ["a6", "c6"]);
        checkAllowedMoves(blackGame, "g8", ["f6", "h6"]);
      });
    });

    describe("bishops", () => {
      it("moves the bishop", () => {
        const game = chess.Game.empty().addPiece(chess.Piece.fromString("B")!, chess.Square.fromString("d4")!);
        checkAllowedMoves(game, "d4", ["c3", "b2", "a1", "c5", "b6", "a7", "e5", "f6", "g7", "h8", "e3", "f2", "g1"]);
      });

      it("doesn't allow blocked squares", () => {
        const game = chess.Game.empty()
          .addPiece(chess.Piece.fromString("B")!, chess.Square.fromString("d4")!)
          .addPiece(chess.Piece.fromString("n")!, chess.Square.fromString("g7")!)
          .addPiece(chess.Piece.fromString("P")!, chess.Square.fromString("b6")!);

        checkAllowedMoves(game, "d4", ["c3", "b2", "a1", "c5", "e5", "f6", "g7", "e3", "f2", "g1"]);
      });
    });

    describe("rooks", () => {
      it("moves the rook", () => {
        const game = chess.Game.empty().addPiece(chess.Piece.fromString("R")!, chess.Square.fromString("d4")!);
        // prettier-ignore
        checkAllowedMoves(game, "d4", [
          "d1", "d2", "d3", "d5", "d6", "d7", "d8",
          "a4", "b4", "c4", "e4", "f4", "g4", "h4",
        ]);
      });

      it("doesn't allow blocked squares", () => {
        const game = chess.Game.empty()
          .addPiece(chess.Piece.fromString("R")!, chess.Square.fromString("d4")!)
          .addPiece(chess.Piece.fromString("n")!, chess.Square.fromString("d2")!)
          .addPiece(chess.Piece.fromString("P")!, chess.Square.fromString("f4")!);

        checkAllowedMoves(game, "d4", ["d2", "d3", "d5", "d6", "d7", "d8", "a4", "b4", "c4", "e4"]);
      });
    });

    describe("queens", () => {
      it("moves the queen", () => {
        const game = chess.Game.empty().addPiece(chess.Piece.fromString("Q")!, chess.Square.fromString("d4")!);
        // prettier-ignore
        checkAllowedMoves(game, "d4", [
          "d1", "d2", "d3", "d5", "d6", "d7", "d8",
          "a4", "b4", "c4", "e4", "f4", "g4", "h4",
          "a1", "b2", "c3", "e5", "f6", "g7", "h8",
          "a7", "b6", "c5", "e3", "f2", "g1",
        ]);
      });

      it("doesn't allow blocked squares", () => {
        const game = chess.Game.empty()
          .addPiece(chess.Piece.fromString("Q")!, chess.Square.fromString("d4")!)
          .addPiece(chess.Piece.fromString("n")!, chess.Square.fromString("g7")!)
          .addPiece(chess.Piece.fromString("b")!, chess.Square.fromString("d5")!)
          .addPiece(chess.Piece.fromString("R")!, chess.Square.fromString("b4")!)
          .addPiece(chess.Piece.fromString("P")!, chess.Square.fromString("b6")!);

        // prettier-ignore
        checkAllowedMoves(game, "d4", [
          "d1", "d2", "d3", "d5",
          "c4", "e4", "f4", "g4", "h4",
          "a1", "b2", "c3", "e5", "f6", "g7",
          "c5", "e3", "f2", "g1",
        ]);
      });
    });

    describe("kings", () => {
      it("moves the king", () => {
        const game = chess.Game.empty().addPiece(chess.Piece.fromString("K")!, chess.Square.fromString("d4")!);
        checkAllowedMoves(game, "d4", ["d5", "e5", "e4", "e3", "d3", "c3", "c4", "c5"]);
      });

      it("doesn't allow non-existing or occupied-by-us squares", () => {
        const game = chess.Game.empty()
          .addPiece(chess.Piece.fromString("K")!, chess.Square.fromString("e1")!)
          .addPiece(chess.Piece.fromString("p")!, chess.Square.fromString("e2")!)
          .addPiece(chess.Piece.fromString("P")!, chess.Square.fromString("d1")!);

        checkAllowedMoves(game, "e1", ["e2", "d2", "f2", "f1"]);
      });
    });
  });
});
