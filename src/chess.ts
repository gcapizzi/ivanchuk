import * as immutable from "immutable";

import { Location } from "./location";
import { Piece } from "./piece";

export * from "./location";
export * from "./piece";

export class Game {
  public board = immutable.Map<Location, Piece>();

  static empty(): Game {
    return new Game();
  }

  static fromStartingPosition(): Game {
    return Game.empty()
      .addPiece(Piece.fromString("R")!, Location.fromString("A1")!)
      .addPiece(Piece.fromString("N")!, Location.fromString("B1")!)
      .addPiece(Piece.fromString("B")!, Location.fromString("C1")!)
      .addPiece(Piece.fromString("Q")!, Location.fromString("D1")!)
      .addPiece(Piece.fromString("K")!, Location.fromString("E1")!)
      .addPiece(Piece.fromString("B")!, Location.fromString("F1")!)
      .addPiece(Piece.fromString("N")!, Location.fromString("G1")!)
      .addPiece(Piece.fromString("R")!, Location.fromString("H1")!)
      .addPiece(Piece.fromString("P")!, Location.fromString("A2")!)
      .addPiece(Piece.fromString("P")!, Location.fromString("B2")!)
      .addPiece(Piece.fromString("P")!, Location.fromString("C2")!)
      .addPiece(Piece.fromString("P")!, Location.fromString("D2")!)
      .addPiece(Piece.fromString("P")!, Location.fromString("E2")!)
      .addPiece(Piece.fromString("P")!, Location.fromString("F2")!)
      .addPiece(Piece.fromString("P")!, Location.fromString("G2")!)
      .addPiece(Piece.fromString("P")!, Location.fromString("H2")!)
      .addPiece(Piece.fromString("p")!, Location.fromString("A7")!)
      .addPiece(Piece.fromString("p")!, Location.fromString("B7")!)
      .addPiece(Piece.fromString("p")!, Location.fromString("C7")!)
      .addPiece(Piece.fromString("p")!, Location.fromString("D7")!)
      .addPiece(Piece.fromString("p")!, Location.fromString("E7")!)
      .addPiece(Piece.fromString("p")!, Location.fromString("F7")!)
      .addPiece(Piece.fromString("p")!, Location.fromString("G7")!)
      .addPiece(Piece.fromString("p")!, Location.fromString("H7")!)
      .addPiece(Piece.fromString("r")!, Location.fromString("A8")!)
      .addPiece(Piece.fromString("n")!, Location.fromString("B8")!)
      .addPiece(Piece.fromString("b")!, Location.fromString("C8")!)
      .addPiece(Piece.fromString("q")!, Location.fromString("D8")!)
      .addPiece(Piece.fromString("k")!, Location.fromString("E8")!)
      .addPiece(Piece.fromString("b")!, Location.fromString("F8")!)
      .addPiece(Piece.fromString("n")!, Location.fromString("G8")!)
      .addPiece(Piece.fromString("r")!, Location.fromString("H8")!);
  }

  addPiece(piece: Piece, location: Location): Game {
    const newGame = new Game();
    newGame.board = this.board.set(location, piece);
    return newGame;
  }

  getPieceAt(location: Location): Piece | undefined {
    return this.board.get(location);
  }
}
