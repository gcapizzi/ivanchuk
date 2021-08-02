import * as immutable from "immutable";

import { Square } from "./square";
import { Piece } from "./piece";

export class Game implements immutable.ValueObject {
  private board: immutable.Map<Square, Piece>;
  private nextToMove: Piece.Colour;
  private enPassantSquare: Square | undefined;

  private constructor(
    board: immutable.Map<Square, Piece>,
    nextToMove: Piece.Colour,
    enPassantSquare: Square | undefined
  ) {
    this.board = board;
    this.nextToMove = nextToMove;
    this.enPassantSquare = enPassantSquare;
  }

  static empty(): Game {
    return new Game(immutable.Map<Square, Piece>(), Piece.Colour.WHITE, undefined);
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
    return new Game(this.board, nextToMove, this.enPassantSquare);
  }

  getNextToMove(): Piece.Colour {
    return this.nextToMove;
  }

  withEnPassantSquare(enPassantSquare: Square): Game {
    return new Game(this.board, this.nextToMove, enPassantSquare);
  }

  removeEnPassantSquare(): Game {
    return new Game(this.board, this.nextToMove, undefined);
  }

  move(source: Square, destination: Square): Game {
    const piece = this.getPiece(source);
    if (piece === undefined || piece.colour !== this.nextToMove) {
      return this;
    }

    if (this.validDestinations(piece, source).includes(destination)) {
      let newGame = this.mapBoard((board) => {
        return board.delete(source).set(destination, piece);
      });

      if (Math.abs(destination.file - source.file) === 2) {
        newGame = newGame.withEnPassantSquare(this.destination(destination, -1, 0)!);
      } else {
        newGame = newGame.removeEnPassantSquare();
      }

      return newGame.swapNextToMove();
    }

    return this;
  }

  // TODO consider withMutations
  private validDestinations(piece: Piece, source: Square): immutable.Set<Square> {
    switch (piece.type) {
      case Piece.Type.PAWN:
        return this.validPawnDestinations(source);
      case Piece.Type.KNIGHT:
        return this.validKnightDestinations(source);
    }

    return immutable.Set();
  }

  private validPawnDestinations(source: Square): immutable.Set<Square> {
    let destinations = immutable.Set<Square>();

    this.ifDestinationIsEmpty(source, 1, 0, (d) => (destinations = destinations.add(d)));
    if (this.onInitialFile(source)) {
      this.ifDestinationIsEmpty(source, 2, 0, (d) => (destinations = destinations.add(d)));
    }
    this.ifDestinationIsOccupiedByOpponent(source, 1, -1, (d) => (destinations = destinations.add(d)));
    this.ifDestinationIsOccupiedByOpponent(source, 1, 1, (d) => (destinations = destinations.add(d)));
    this.ifDestinationIsEnPassant(source, 1, -1, (d) => (destinations = destinations.add(d)));
    this.ifDestinationIsEnPassant(source, 1, 1, (d) => (destinations = destinations.add(d)));

    return destinations;
  }

  private validKnightDestinations(source: Square): immutable.Set<Square> {
    let destinations = immutable.Set<Square>();

    this.ifDestinationIsNotOccupiedByMe(source, 2, 1, (d) => (destinations = destinations.add(d)));
    this.ifDestinationIsNotOccupiedByMe(source, 2, -1, (d) => (destinations = destinations.add(d)));
    this.ifDestinationIsNotOccupiedByMe(source, -2, 1, (d) => (destinations = destinations.add(d)));
    this.ifDestinationIsNotOccupiedByMe(source, -2, -1, (d) => (destinations = destinations.add(d)));
    this.ifDestinationIsNotOccupiedByMe(source, 1, 2, (d) => (destinations = destinations.add(d)));
    this.ifDestinationIsNotOccupiedByMe(source, 1, -2, (d) => (destinations = destinations.add(d)));
    this.ifDestinationIsNotOccupiedByMe(source, -1, 2, (d) => (destinations = destinations.add(d)));
    this.ifDestinationIsNotOccupiedByMe(source, -1, -2, (d) => (destinations = destinations.add(d)));

    return destinations;
  }

  private mapBoard(fn: (board: immutable.Map<Square, Piece>) => immutable.Map<Square, Piece>): Game {
    return new Game(fn(this.board), this.nextToMove, this.enPassantSquare);
  }

  private ifDestinationIsEmpty(
    source: Square,
    deltaFile: number,
    deltaColumn: number,
    fn: (destination: Square) => void
  ) {
    this.ifDestinationExists(source, deltaFile, deltaColumn, (d, p) => {
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
    this.ifDestinationExists(source, deltaFile, deltaColumn, (d, p) => {
      if (p !== undefined && p.colour !== this.nextToMove) {
        fn(d);
      }
    });
  }

  private ifDestinationIsNotOccupiedByMe(
    source: Square,
    deltaFile: number,
    deltaColumn: number,
    fn: (destination: Square) => void
  ) {
    this.ifDestinationExists(source, deltaFile, deltaColumn, (d, p) => {
      if (p === undefined || p.colour !== this.nextToMove) {
        fn(d);
      }
    });
  }

  private ifDestinationIsEnPassant(
    source: Square,
    deltaFile: number,
    deltaColumn: number,
    fn: (destination: Square) => void
  ) {
    this.ifDestinationExists(source, deltaFile, deltaColumn, (d, _) => {
      if (this.enPassantSquare?.equals(d)) {
        fn(d);
      }
    });
  }

  private ifDestinationExists(
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
