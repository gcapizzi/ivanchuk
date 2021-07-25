import * as immutable from "immutable";

export class Square implements immutable.ValueObject {
  readonly column: Square.Column;
  readonly file: Square.File;

  constructor(column: Square.Column, file: Square.File) {
    this.column = column;
    this.file = file;
  }

  static fromString(str: string): Square | undefined {
    if (str.length != 2) {
      return undefined;
    }

    let column: Square.Column;
    switch (str.toUpperCase()[0]) {
      case "A":
        column = Square.Column.A;
        break;
      case "B":
        column = Square.Column.B;
        break;
      case "C":
        column = Square.Column.C;
        break;
      case "D":
        column = Square.Column.D;
        break;
      case "E":
        column = Square.Column.E;
        break;
      case "F":
        column = Square.Column.F;
        break;
      case "G":
        column = Square.Column.G;
        break;
      case "H":
        column = Square.Column.H;
        break;
      default:
        return undefined;
    }

    let file: Square.File;
    switch (str.toUpperCase()[1]) {
      case "1":
        file = Square.File._1;
        break;
      case "2":
        file = Square.File._2;
        break;
      case "3":
        file = Square.File._3;
        break;
      case "4":
        file = Square.File._4;
        break;
      case "5":
        file = Square.File._5;
        break;
      case "6":
        file = Square.File._6;
        break;
      case "7":
        file = Square.File._7;
        break;
      case "8":
        file = Square.File._8;
        break;
      default:
        return undefined;
    }

    return new Square(column, file);
  }

  equals(other: Square): boolean {
    return this.column === other.column && this.file === other.file;
  }

  hashCode(): number {
    return this.column * 10 + this.file;
  }

  // TODO test
  fileDiff(other: Square): number {
    return this.file - other.file;
  }

  columnDiff(other: Square): number {
    return this.column - other.column;
  }
}

export namespace Square {
  export enum Column {
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
  }

  export const Columns = [Column.A, Column.B, Column.C, Column.D, Column.E, Column.F, Column.G, Column.H];

  export enum File {
    _1,
    _2,
    _3,
    _4,
    _5,
    _6,
    _7,
    _8,
  }

  export const Files = [File._1, File._2, File._3, File._4, File._4, File._5, File._6, File._7, File._8];
}
