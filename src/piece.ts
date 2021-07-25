import * as immutable from "immutable";

export class Piece implements immutable.ValueObject {
  readonly colour: Piece.Colour;
  readonly type: Piece.Type;

  constructor(colour: Piece.Colour, type: Piece.Type) {
    this.colour = colour;
    this.type = type;
  }

  static fromString(str: string): Piece | undefined {
    switch (str) {
      case "P":
        return new Piece(Piece.Colour.WHITE, Piece.Type.PAWN);
      case "N":
        return new Piece(Piece.Colour.WHITE, Piece.Type.KNIGHT);
      case "B":
        return new Piece(Piece.Colour.WHITE, Piece.Type.BISHOP);
      case "R":
        return new Piece(Piece.Colour.WHITE, Piece.Type.ROOK);
      case "Q":
        return new Piece(Piece.Colour.WHITE, Piece.Type.QUEEN);
      case "K":
        return new Piece(Piece.Colour.WHITE, Piece.Type.KING);
      case "p":
        return new Piece(Piece.Colour.BLACK, Piece.Type.PAWN);
      case "n":
        return new Piece(Piece.Colour.BLACK, Piece.Type.KNIGHT);
      case "b":
        return new Piece(Piece.Colour.BLACK, Piece.Type.BISHOP);
      case "r":
        return new Piece(Piece.Colour.BLACK, Piece.Type.ROOK);
      case "q":
        return new Piece(Piece.Colour.BLACK, Piece.Type.QUEEN);
      case "k":
        return new Piece(Piece.Colour.BLACK, Piece.Type.KING);
    }

    return undefined;
  }

  equals(other: Piece): boolean {
    return this.colour === other.colour && this.type === other.type;
  }

  hashCode(): number {
    return this.colour * 10 + this.type;
  }
}

export namespace Piece {
  export enum Colour {
    WHITE,
    BLACK,
  }

  export const Colours = [Colour.WHITE, Colour.BLACK];

  export enum Type {
    PAWN,
    ROOK,
    KNIGHT,
    BISHOP,
    QUEEN,
    KING,
  }

  export const Types = [Type.PAWN, Type.ROOK, Type.KNIGHT, Type.BISHOP, Type.QUEEN, Type.KING];
}
