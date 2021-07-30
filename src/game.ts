import * as immutable from "immutable";

import { Square } from "./square";
import { Piece } from "./piece";

export class Game implements immutable.ValueObject {
  private board = immutable.Map<Square, Piece>();

  static empty(): Game {
    return new Game();
  }

  static startingPosition(): Game {
    return Game.empty()
      .addPiece(Piece.fromString("R")!, Square.fromString("A1")!)
      .addPiece(Piece.fromString("N")!, Square.fromString("B1")!)
      .addPiece(Piece.fromString("B")!, Square.fromString("C1")!)
      .addPiece(Piece.fromString("Q")!, Square.fromString("D1")!)
      .addPiece(Piece.fromString("K")!, Square.fromString("E1")!)
      .addPiece(Piece.fromString("B")!, Square.fromString("F1")!)
      .addPiece(Piece.fromString("N")!, Square.fromString("G1")!)
      .addPiece(Piece.fromString("R")!, Square.fromString("H1")!)
      .addPiece(Piece.fromString("P")!, Square.fromString("A2")!)
      .addPiece(Piece.fromString("P")!, Square.fromString("B2")!)
      .addPiece(Piece.fromString("P")!, Square.fromString("C2")!)
      .addPiece(Piece.fromString("P")!, Square.fromString("D2")!)
      .addPiece(Piece.fromString("P")!, Square.fromString("E2")!)
      .addPiece(Piece.fromString("P")!, Square.fromString("F2")!)
      .addPiece(Piece.fromString("P")!, Square.fromString("G2")!)
      .addPiece(Piece.fromString("P")!, Square.fromString("H2")!)
      .addPiece(Piece.fromString("p")!, Square.fromString("A7")!)
      .addPiece(Piece.fromString("p")!, Square.fromString("B7")!)
      .addPiece(Piece.fromString("p")!, Square.fromString("C7")!)
      .addPiece(Piece.fromString("p")!, Square.fromString("D7")!)
      .addPiece(Piece.fromString("p")!, Square.fromString("E7")!)
      .addPiece(Piece.fromString("p")!, Square.fromString("F7")!)
      .addPiece(Piece.fromString("p")!, Square.fromString("G7")!)
      .addPiece(Piece.fromString("p")!, Square.fromString("H7")!)
      .addPiece(Piece.fromString("r")!, Square.fromString("A8")!)
      .addPiece(Piece.fromString("n")!, Square.fromString("B8")!)
      .addPiece(Piece.fromString("b")!, Square.fromString("C8")!)
      .addPiece(Piece.fromString("q")!, Square.fromString("D8")!)
      .addPiece(Piece.fromString("k")!, Square.fromString("E8")!)
      .addPiece(Piece.fromString("b")!, Square.fromString("F8")!)
      .addPiece(Piece.fromString("n")!, Square.fromString("G8")!)
      .addPiece(Piece.fromString("r")!, Square.fromString("H8")!);
  }

  equals(other: Game): boolean {
    return this.board.equals(other.board);
  }

  hashCode(): number {
    return this.board.hashCode();
  }

  // TODO test
  toString(): string {
    return this.board.toString();
  }

  addPiece(piece: Piece, square: Square): Game {
    return this.mapBoard((board) => board.set(square, piece));
  }

  getPiece(square: Square): Piece | undefined {
    return this.board.get(square);
  }

  removePiece(square: Square): Game {
    return this.mapBoard((board) => board.delete(square));
  }

  move(source: Square, destination: Square): Game {
    if (this.board.get(source) === undefined) {
      return this;
    }

    if (this.validDestinations(source).includes(destination)) {
      return this.movePiece(source, destination);
    }

    return this;
  }

  // TODO consider withMutations
  private validDestinations(source: Square): immutable.Set<Square> {
    let destinations = immutable.Set<Square>();

    const frontSq = source.addFile(1);
    if (frontSq !== undefined && this.getPiece(frontSq) === undefined) {
      destinations = destinations.add(frontSq);
    }

    if (source.file === Square.File._2) {
      const secondFrontSq = source.addFile(2);
      if (secondFrontSq !== undefined && this.getPiece(secondFrontSq) === undefined) {
        destinations = destinations.add(secondFrontSq);
      }
    }

    const leftDiagonalSq = source.addFile(1)?.addColumn(-1);
    if (leftDiagonalSq !== undefined) {
      const leftDiagonalPiece = this.getPiece(leftDiagonalSq);
      if (leftDiagonalPiece !== undefined && leftDiagonalPiece.colour === Piece.Colour.BLACK) {
        destinations = destinations.add(leftDiagonalSq);
      }
    }

    const rightDiagonalSq = source.addFile(1)?.addColumn(1);
    if (rightDiagonalSq !== undefined) {
      const rightDiagonalPiece = this.getPiece(rightDiagonalSq);
      if (rightDiagonalPiece !== undefined && rightDiagonalPiece.colour === Piece.Colour.BLACK) {
        destinations = destinations.add(rightDiagonalSq);
      }
    }

    return destinations;
  }

  private movePiece(source: Square, destination: Square): Game {
    return this.mapBoard((board) => {
      const srcPiece = board.get(source)!;
      return board.delete(source).set(destination, srcPiece);
    });
  }

  private mapBoard(fn: (board: immutable.Map<Square, Piece>) => immutable.Map<Square, Piece>): Game {
    const newGame = new Game();
    newGame.board = fn(this.board);
    return newGame;
  }
}
