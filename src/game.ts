import * as immutable from "immutable";
import { Piece } from "./piece";
import { Square } from "./square";

class State extends immutable.Record({
  board: immutable.Map<Square, Piece>(),
  nextToMove: Piece.Colour.WHITE,
  enPassantSquare: undefined as Square | undefined,
  shortCastling: immutable.Set<Piece.Colour>(),
  longCastling: immutable.Set<Piece.Colour>(),
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
      .addPiece(Piece.fromString("r")!, Square.fromString("H8")!)
      .allowShortCastling(Piece.Colour.WHITE)
      .allowShortCastling(Piece.Colour.BLACK)
      .allowLongCastling(Piece.Colour.WHITE)
      .allowLongCastling(Piece.Colour.BLACK);
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

  allowShortCastling(colour: Piece.Colour): Game {
    return new Game(this.state.update("shortCastling", (c) => c.add(colour)));
  }

  allowLongCastling(colour: Piece.Colour): Game {
    return new Game(this.state.update("longCastling", (c) => c.add(colour)));
  }

  disallowShortCastling(colour: Piece.Colour): Game {
    return new Game(this.state.update("shortCastling", (c) => c.remove(colour)));
  }

  disallowLongCastling(colour: Piece.Colour): Game {
    return new Game(this.state.update("longCastling", (c) => c.remove(colour)));
  }

  canCastleShort(colour: Piece.Colour): boolean {
    return this.state.shortCastling.includes(colour);
  }

  canCastleLong(colour: Piece.Colour): boolean {
    return this.state.longCastling.includes(colour);
  }

  getEnPassantSquare(): Square | undefined {
    return this.state.enPassantSquare;
  }

  withEnPassantSquare(enPassantSquare: Square): Game {
    return new Game(this.state.set("enPassantSquare", enPassantSquare));
  }

  removeEnPassantSquare(): Game {
    return new Game(this.state.remove("enPassantSquare"));
  }

  move(source: Square, destination: Square): Game {
    const piece = this.getPiece(source);
    if (piece === undefined) {
      return this;
    }

    if (this.validDestinationSet(source, piece).includes(destination)) {
      let newGame = this.justMove(source, destination);

      newGame = newGame.performCastling(piece, source, destination);

      if (piece.type === Piece.Type.PAWN && Math.abs(destination.file - source.file) === 2) {
        newGame = newGame.withEnPassantSquare(this.destination(destination, piece.colour, -1, 0)!);
      } else {
        newGame = newGame.removeEnPassantSquare();
      }

      if (this.enPassant(destination)) {
        newGame = newGame.removePiece(this.destination(destination, piece.colour, -1, 0)!);
      }

      if (piece.type === Piece.Type.KING) {
        newGame = newGame.disallowShortCastling(this.state.nextToMove).disallowLongCastling(this.state.nextToMove);
      }

      if (piece.type == Piece.Type.ROOK && source.column == Square.Column.H) {
        newGame = newGame.disallowShortCastling(this.state.nextToMove);
      }

      if (piece.type == Piece.Type.ROOK && source.column == Square.Column.A) {
        newGame = newGame.disallowLongCastling(this.state.nextToMove);
      }

      return newGame.swapNextToMove();
    }

    return this;
  }

  private justMove(source: Square, destination: Square): Game {
    return this.mapBoard((board) => {
      return board.set(destination, board.get(source)!).delete(source);
    });
  }

  // TODO test
  allValidDestinations(): Map<Square, Square[]> {
    return new Map(this.state.board.mapEntries(([s, p]) => [s, this.validDestinations(s, p)]).entries());
  }

  private validDestinations(square: Square, piece: Piece): Square[] {
    return this.validDestinationSet(square, piece).toArray();
  }

  // TODO consider withMutations
  private validDestinationSet(source: Square, piece: Piece): immutable.Set<Square> {
    if (piece.colour !== this.state.nextToMove) {
      return immutable.Set();
    }

    let dests = this.pieceDestinations(source, piece).filter((d) => {
      return !this.justMove(source, d).inCheck();
    });

    return dests.union(this.shortCastleDestinations(source, piece)).union(this.longCastleDestinations(source, piece));
  }

  private pieceDestinations(source: Square, piece: Piece): immutable.Set<Square> {
    switch (piece.type) {
      case Piece.Type.PAWN:
        return this.pawnDestinations(source, piece.colour);
      case Piece.Type.KNIGHT:
        return this.knightDestinations(source, piece.colour);
      case Piece.Type.BISHOP:
        return this.bishopDestinations(source, piece.colour);
      case Piece.Type.ROOK:
        return this.rookDestinations(source, piece.colour);
      case Piece.Type.QUEEN:
        return this.queenDestinations(source, piece.colour);
      case Piece.Type.KING:
        return this.kingDestinations(source, piece.colour);
    }
  }

  private inCheck(): boolean {
    const kingSquare = this.state.board.findKey(
      (p) => p.type === Piece.Type.KING && p.colour === this.state.nextToMove
    );
    if (kingSquare === undefined) {
      return false;
    }
    return this.underAttack(kingSquare);
  }

  private pawnDestinations(source: Square, pieceColour: Piece.Colour): immutable.Set<Square> {
    let frontMoves: Array<[number, number]> = [[1, 0]];
    if (this.onInitialPawnFile(source)) {
      frontMoves.push([2, 0]);
    }

    return this.destinations(source, pieceColour, frontMoves)
      .takeWhile((s) => this.empty(s!))
      .union(
        this.destinations(source, pieceColour, [
          [1, -1],
          [1, 1],
        ]).filter((s) => this.occupiedByThem(s!, pieceColour) || this.enPassant(s!))
      );
  }

  private knightDestinations(source: Square, pieceColour: Piece.Colour): immutable.Set<Square> {
    return this.destinations(source, pieceColour, [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ]).filter((s) => this.empty(s) || this.occupiedByThem(s, pieceColour));
  }

  private bishopDestinations(source: Square, pieceColour: Piece.Colour): immutable.Set<Square> {
    return this.diagonalDestinations(source, pieceColour, -1, -1)
      .union(this.diagonalDestinations(source, pieceColour, 1, 1))
      .union(this.diagonalDestinations(source, pieceColour, -1, 1))
      .union(this.diagonalDestinations(source, pieceColour, 1, -1));
  }

  private rookDestinations(source: Square, pieceColour: Piece.Colour): immutable.Set<Square> {
    return this.verticalDestinations(source, pieceColour, 1)
      .union(this.verticalDestinations(source, pieceColour, -1))
      .union(this.horizontalDestinations(source, pieceColour, 1))
      .union(this.horizontalDestinations(source, pieceColour, -1));
  }

  private queenDestinations(source: Square, pieceColour: Piece.Colour): immutable.Set<Square> {
    return this.verticalDestinations(source, pieceColour, 1)
      .union(this.verticalDestinations(source, pieceColour, -1))
      .union(this.horizontalDestinations(source, pieceColour, 1))
      .union(this.horizontalDestinations(source, pieceColour, -1))
      .union(this.diagonalDestinations(source, pieceColour, -1, -1))
      .union(this.diagonalDestinations(source, pieceColour, 1, 1))
      .union(this.diagonalDestinations(source, pieceColour, -1, 1))
      .union(this.diagonalDestinations(source, pieceColour, 1, -1));
  }

  private kingDestinations(source: Square, pieceColour: Piece.Colour): immutable.Set<Square> {
    return this.destinations(source, pieceColour, [
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ]).filter((s) => this.empty(s) || this.occupiedByThem(s, pieceColour));
  }

  private lineDestinations(
    source: Square,
    pieceColour: Piece.Colour,
    deltas: immutable.Seq.Indexed<[number, number]>
  ): immutable.Set<Square> {
    let line = deltas
      .map(([dc, df]) => source.addColumn(dc)?.addFile(df))
      .takeWhile((s) => s !== undefined)
      .toList() as immutable.List<Square>;

    let dests = line.takeWhile((s) => this.empty(s)).toSet();
    const block = line.find((s) => !this.empty(s));
    // capture
    if (block && this.occupiedByThem(block, pieceColour)) {
      return dests.add(block);
    }

    return dests;
  }

  private diagonalDestinations(
    source: Square,
    pieceColour: Piece.Colour,
    xSign: number,
    ySign: number
  ): immutable.Set<Square> {
    return this.lineDestinations(
      source,
      pieceColour,
      immutable.Range(xSign, Infinity * xSign, xSign).zip(immutable.Range(ySign, Infinity * ySign, ySign))
    );
  }

  private verticalDestinations(source: Square, pieceColour: Piece.Colour, ySign: number): immutable.Set<Square> {
    return this.lineDestinations(
      source,
      pieceColour,
      immutable.Repeat(0).zip(immutable.Range(ySign, Infinity * ySign, ySign))
    );
  }

  private horizontalDestinations(source: Square, pieceColour: Piece.Colour, xSign: number): immutable.Set<Square> {
    return this.lineDestinations(
      source,
      pieceColour,
      immutable.Range(xSign, Infinity * xSign, xSign).zip(immutable.Repeat(0))
    );
  }

  private shortCastleDestinations(source: Square, piece: Piece): immutable.Set<Square> {
    if (
      piece.type == Piece.Type.KING &&
      this.canCastleShort(piece.colour) &&
      this.getPiece(source.addColumn(1)!) === undefined &&
      this.getPiece(source.addColumn(2)!) === undefined &&
      !this.underAttack(source) &&
      !this.underAttack(source.addColumn(1)!) &&
      !this.underAttack(source.addColumn(2)!)
    ) {
      return immutable.Set.of(source.addColumn(2)!);
    }
    return immutable.Set();
  }

  private longCastleDestinations(source: Square, piece: Piece): immutable.Set<Square> {
    if (
      piece.type == Piece.Type.KING &&
      this.canCastleLong(piece.colour) &&
      this.getPiece(source.addColumn(-1)!) === undefined &&
      this.getPiece(source.addColumn(-2)!) === undefined &&
      this.getPiece(source.addColumn(-3)!) === undefined
    ) {
      return immutable.Set.of(source.addColumn(-2)!);
    }
    return immutable.Set();
  }

  private performCastling(piece: Piece, source: Square, destination: Square): Game {
    if (piece.type !== Piece.Type.KING) {
      return this;
    }

    if (destination.column - source.column === 2) {
      return this.justMove(source.addColumn(3)!, source.addColumn(1)!);
    }

    if (destination.column - source.column === -2) {
      return this.justMove(source.addColumn(-4)!, source.addColumn(-1)!);
    }

    return this;
  }

  private mapBoard(fn: (board: immutable.Map<Square, Piece>) => immutable.Map<Square, Piece>): Game {
    return new Game(this.state.update("board", fn));
  }

  private occupiedByThem(square: Square, pieceColour: Piece.Colour): boolean {
    const piece = this.getPiece(square);
    return piece !== undefined && piece.colour !== pieceColour;
  }

  private underAttack(square: Square): boolean {
    return (
      this.state.board.find(
        (p, s) => p.colour !== this.state.nextToMove && this.pieceDestinations(s, p).includes(square)
      ) !== undefined
    );
  }

  private empty(square: Square): boolean {
    return this.getPiece(square) === undefined;
  }

  private enPassant(square: Square): boolean {
    return this.state.enPassantSquare?.equals(square) ?? false;
  }

  private destination(
    source: Square,
    pieceColour: Piece.Colour,
    deltaFile: number,
    deltaColumn: number
  ): Square | undefined {
    const directionMultiplier = pieceColour === Piece.Colour.WHITE ? 1 : -1;
    return source.addFile(deltaFile * directionMultiplier)?.addColumn(deltaColumn * directionMultiplier);
  }

  private destinations(
    source: Square,
    pieceColour: Piece.Colour,
    deltas: Array<[number, number]>
  ): immutable.Set<Square> {
    return immutable
      .Set(deltas)
      .map(([df, dc]) => this.destination(source, pieceColour, df, dc))
      .filter((s) => s !== undefined) as immutable.Set<Square>;
  }

  private onInitialPawnFile(square: Square) {
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
