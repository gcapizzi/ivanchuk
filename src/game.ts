import * as immutable from "immutable";

import { Square } from "./square";
import { Piece } from "./piece";

class State extends immutable.Record({
  board: immutable.Map<Square, Piece>(),
  nextToMove: Piece.Colour.WHITE,
  enPassantSquare: undefined as Square | undefined,
}) {}

export class Game implements immutable.ValueObject {
  private state: State;

  private constructor(state: State) {
    this.state = state;
  }

  static empty(): Game {
    return new Game(new State());
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
    return this.state.equals(other.state);
  }

  hashCode(): number {
    return this.state.hashCode();
  }

  // TODO test
  toString(): string {
    return this.state.toString();
  }

  addPiece(piece: Piece, square: Square): Game {
    return this.mapBoard((board) => board.set(square, piece));
  }

  getPiece(square: Square): Piece | undefined {
    return this.state.board.get(square);
  }

  removePiece(square: Square): Game {
    return this.mapBoard((board) => board.delete(square));
  }

  withNextToMove(nextToMove: Piece.Colour): Game {
    return new Game(this.state.set("nextToMove", nextToMove));
  }

  getNextToMove(): Piece.Colour {
    return this.state.nextToMove;
  }

  withEnPassantSquare(enPassantSquare: Square): Game {
    return new Game(this.state.set("enPassantSquare", enPassantSquare));
  }

  removeEnPassantSquare(): Game {
    return new Game(this.state.remove("enPassantSquare"));
  }

  move(source: Square, destination: Square): Game {
    if (this.validDestinationSet(source).includes(destination)) {
      let newGame = this.mapBoard((board) => {
        return board.set(destination, board.get(source)!).delete(source);
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

  allValidDestinations(): Map<Square, Square[]> {
    return new Map(this.state.board.mapEntries(([s, p]) => [s, this.validDestinations(s)]).entries());
  }

  validDestinations(square: Square): Square[] {
    return this.validDestinationSet(square).toArray();
  }

  // TODO consider withMutations
  private validDestinationSet(source: Square): immutable.Set<Square> {
    const piece = this.getPiece(source);
    if (piece === undefined || piece.colour !== this.state.nextToMove) {
      return immutable.Set();
    }

    switch (piece.type) {
      case Piece.Type.PAWN:
        return this.validPawnDestinations(source);
      case Piece.Type.KNIGHT:
        return this.validKnightDestinations(source);
      case Piece.Type.BISHOP:
        return this.validBishopDestinations(source);
      case Piece.Type.ROOK:
        return this.validRookDestinations(source);
      case Piece.Type.QUEEN:
        return this.validQueenDestinations(source);
      case Piece.Type.KING:
        return this.validKingDestinations(source);
    }
  }

  private validPawnDestinations(source: Square): immutable.Set<Square> {
    let frontMoves: Array<[number, number]> = [[1, 0]];
    if (this.onInitialFile(source)) {
      frontMoves.push([2, 0]);
    }

    return this.destinations(source, frontMoves)
      .filter((s) => this.empty(s!))
      .union(
        this.destinations(source, [
          [1, -1],
          [1, 1],
        ]).filter((s) => this.occupiedByThem(s!) || this.enPassant(s!))
      );
  }

  private validKnightDestinations(source: Square): immutable.Set<Square> {
    return this.destinations(source, [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ]).filter((s) => this.empty(s) || this.occupiedByThem(s));
  }

  private validBishopDestinations(source: Square): immutable.Set<Square> {
    return this.validDiagonalDestinations(source, -1, -1)
      .union(this.validDiagonalDestinations(source, 1, 1))
      .union(this.validDiagonalDestinations(source, -1, 1))
      .union(this.validDiagonalDestinations(source, 1, -1));
  }

  private validRookDestinations(source: Square): immutable.Set<Square> {
    return this.validVerticalDestinations(source, 1)
      .union(this.validVerticalDestinations(source, -1))
      .union(this.validHorizontalDestinations(source, 1))
      .union(this.validHorizontalDestinations(source, -1));
  }

  private validQueenDestinations(source: Square): immutable.Set<Square> {
    return this.validVerticalDestinations(source, 1)
      .union(this.validVerticalDestinations(source, -1))
      .union(this.validHorizontalDestinations(source, 1))
      .union(this.validHorizontalDestinations(source, -1))
      .union(this.validDiagonalDestinations(source, -1, -1))
      .union(this.validDiagonalDestinations(source, 1, 1))
      .union(this.validDiagonalDestinations(source, -1, 1))
      .union(this.validDiagonalDestinations(source, 1, -1));
  }

  private validKingDestinations(source: Square): immutable.Set<Square> {
    return this.destinations(source, [
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ]).filter((s) => this.empty(s) || this.occupiedByThem(s));
  }

  private validLineDestinations(
    source: Square,
    deltas: immutable.Seq.Indexed<[number, number]>
  ): immutable.Set<Square> {
    let line = deltas
      .map(([dc, df]) => source.addColumn(dc)?.addFile(df))
      .takeWhile((s) => s !== undefined)
      .toList() as immutable.List<Square>;

    let dests = line.takeWhile((s) => this.empty(s)).toSet();
    const block = line.find((s) => !this.empty(s));
    // capture
    if (block && this.occupiedByThem(block)) {
      return dests.add(block);
    }

    return dests;
  }

  private validDiagonalDestinations(source: Square, xSign: number, ySign: number): immutable.Set<Square> {
    return this.validLineDestinations(
      source,
      immutable.Range(xSign, Infinity * xSign, xSign).zip(immutable.Range(ySign, Infinity * ySign, ySign))
    );
  }

  private validVerticalDestinations(source: Square, ySign: number): immutable.Set<Square> {
    return this.validLineDestinations(source, immutable.Repeat(0).zip(immutable.Range(ySign, Infinity * ySign, ySign)));
  }

  private validHorizontalDestinations(source: Square, xSign: number): immutable.Set<Square> {
    return this.validLineDestinations(source, immutable.Range(xSign, Infinity * xSign, xSign).zip(immutable.Repeat(0)));
  }

  private mapBoard(fn: (board: immutable.Map<Square, Piece>) => immutable.Map<Square, Piece>): Game {
    return new Game(this.state.update("board", fn));
  }

  private occupiedByThem(square: Square): boolean {
    const piece = this.getPiece(square);
    return piece !== undefined && piece.colour !== this.state.nextToMove;
  }

  private empty(square: Square): boolean {
    return this.getPiece(square) === undefined;
  }

  private enPassant(square: Square): boolean {
    return this.state.enPassantSquare?.equals(square) ?? false;
  }

  private destination(source: Square, deltaFile: number, deltaColumn: number): Square | undefined {
    const directionMultiplier = this.state.nextToMove === Piece.Colour.WHITE ? 1 : -1;
    return source.addFile(deltaFile * directionMultiplier)?.addColumn(deltaColumn * directionMultiplier);
  }

  private destinations(source: Square, deltas: Array<[number, number]>): immutable.Set<Square> {
    return immutable
      .Set(deltas)
      .map(([df, dc]) => this.destination(source, df, dc))
      .filter((s) => s !== undefined) as immutable.Set<Square>;
  }

  private onInitialFile(square: Square) {
    if (this.state.nextToMove == Piece.Colour.WHITE) {
      return square.file === Square.File._2;
    } else {
      return square.file === Square.File._7;
    }
  }

  private swapNextToMove(): Game {
    return this.withNextToMove(this.state.nextToMove === Piece.Colour.WHITE ? Piece.Colour.BLACK : Piece.Colour.WHITE);
  }
}
