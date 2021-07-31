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
    const piece = this.getPiece(source);
    if (piece === undefined) {
      return immutable.Set();
    }

    let initialFile = Square.File._2;
    let oppositeColour = Piece.Colour.BLACK;
    let fileMultiplier = 1;
    if (piece.colour === Piece.Colour.BLACK) {
      initialFile = Square.File._7;
      oppositeColour = Piece.Colour.WHITE;
      fileMultiplier = -1;
    }

    let destinations = immutable.Set<Square>();

    this.destination(source, 1 * fileMultiplier, 0).ifEmpty((s) => (destinations = destinations.add(s)));
    if (source.file === initialFile) {
      this.destination(source, 2 * fileMultiplier, 0).ifEmpty((s) => (destinations = destinations.add(s)));
    }
    this.destination(source, 1 * fileMultiplier, -1).ifPiece(oppositeColour, (s) => (destinations = destinations.add(s)));
    this.destination(source, 1 * fileMultiplier, 1).ifPiece(oppositeColour, (s) => (destinations = destinations.add(s)));

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

  private destination(square: Square, deltaFile: number, deltaColumn: number): MaybeSquare {
    const dest = square.addFile(deltaFile)?.addColumn(deltaColumn);
    let piece: Piece | undefined;
    if (dest !== undefined) {
      piece = this.getPiece(dest);
    }
    return new MaybeSquare(dest, piece);
  }
}

class MaybeSquare {
  private square: Square | undefined;
  private piece: Piece | undefined;

  constructor(square: Square | undefined, piece: Piece | undefined) {
    this.square = square;
    this.piece = piece;
  }

  ifEmpty(fn: (s: Square) => void) {
    if (this.square !== undefined && this.piece === undefined) {
      fn(this.square);
    }
  }

  ifPiece(colour: Piece.Colour, fn: (s: Square) => void) {
    if (this.square !== undefined && this.piece !== undefined && this.piece.colour === colour) {
      fn(this.square);
    }
  }
}
