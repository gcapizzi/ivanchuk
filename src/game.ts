import * as immutable from "immutable";

import { Square } from "./square";
import { Piece } from "./piece";

export class Game implements immutable.ValueObject {
  private board = immutable.Map<Square, Piece>();
  private nextToMove = Piece.Colour.WHITE;

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
    return this.board.equals(other.board) && this.nextToMove === other.nextToMove;
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

  withNextToMove(nextToMove: Piece.Colour): Game {
    const newGame = new Game();
    newGame.board = this.board;
    newGame.nextToMove = nextToMove;
    return newGame;
  }

  getNextToMove(): Piece.Colour {
    return this.nextToMove;
  }

  move(source: Square, destination: Square): Game {
    if (this.validDestinations(source).includes(destination)) {
      return this.movePiece(source, destination);
    }

    return this;
  }

  // TODO consider withMutations
  validDestinations(source: Square): immutable.Set<Square> {
    const piece = this.getPiece(source);
    if (piece === undefined || piece.colour !== this.nextToMove) {
      return immutable.Set();
    }

    let destinations = immutable.Set<Square>();

    this.ifDestinationIsEmpty(source, 1, 0, (d) => (destinations = destinations.add(d)));
    if (this.onInitialFile(source)) {
      this.ifDestinationIsEmpty(source, 2, 0, (d) => (destinations = destinations.add(d)));
    }
    this.ifDestinationIsOccupiedByOpponent(source, 1, -1, (d) => (destinations = destinations.add(d)));
    this.ifDestinationIsOccupiedByOpponent(source, 1, 1, (d) => (destinations = destinations.add(d)));

    return destinations;
  }

  private movePiece(source: Square, destination: Square): Game {
    return this.mapBoard((board) => {
      const srcPiece = board.get(source)!;
      return board.delete(source).set(destination, srcPiece);
    }).swapNextToMove();
  }

  private mapBoard(fn: (board: immutable.Map<Square, Piece>) => immutable.Map<Square, Piece>): Game {
    const newGame = new Game();
    newGame.nextToMove = this.nextToMove;
    newGame.board = fn(this.board);
    return newGame;
  }

  private ifDestinationIsEmpty(
    source: Square,
    deltaFile: number,
    deltaColumn: number,
    fn: (destination: Square) => void
  ) {
    this.withExistingDestination(source, deltaFile, deltaColumn, (d, p) => {
      if (p === undefined) {
        fn(d);
      }
    });
  }

  private ifDestinationIsOccupiedByOpponent(
    source: Square,
    deltaFile: number,
    deltaColumn: number,
    fn: (destination: Square) => void
  ) {
    this.withExistingDestination(source, deltaFile, deltaColumn, (d, p) => {
      if (p !== undefined && p.colour !== this.nextToMove) {
        fn(d);
      }
    });
  }

  private withExistingDestination(
    source: Square,
    deltaFile: number,
    deltaColumn: number,
    fn: (destination: Square, piece: Piece | undefined) => void
  ) {
    const destination = this.destination(source, deltaFile, deltaColumn);
    if (destination !== undefined) {
      fn(destination, this.getPiece(destination));
    }
  }

  private destination(source: Square, deltaFile: number, deltaColumn: number) {
    const directionMultiplier = this.nextToMove === Piece.Colour.WHITE ? 1 : -1;
    return source.addFile(deltaFile * directionMultiplier)?.addColumn(deltaColumn * directionMultiplier);
  }

  private onInitialFile(square: Square) {
    if (this.nextToMove == Piece.Colour.WHITE) {
      return square.file === Square.File._2;
    } else {
      return square.file === Square.File._7;
    }
  }

  private swapNextToMove(): Game {
    return this.withNextToMove(this.nextToMove === Piece.Colour.WHITE ? Piece.Colour.BLACK : Piece.Colour.WHITE);
  }
}
