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

    const column = parseColumn(str[0]);
    if (column === undefined) {
      return undefined;
    }

    const file = parseFile(str[1]);
    if (file === undefined) {
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

function parseColumn(str: string): Square.Column | undefined {
  switch (str.toUpperCase()) {
    case "A":
      return Square.Column.A;
    case "B":
      return Square.Column.B;
    case "C":
      return Square.Column.C;
    case "D":
      return Square.Column.D;
    case "E":
      return Square.Column.E;
    case "F":
      return Square.Column.F;
    case "G":
      return Square.Column.G;
    case "H":
      return Square.Column.H;
  }
}

function parseFile(str: string): Square.File | undefined {
  switch (str) {
    case "1":
      return Square.File._1;
    case "2":
      return Square.File._2;
    case "3":
      return Square.File._3;
    case "4":
      return Square.File._4;
    case "5":
      return Square.File._5;
    case "6":
      return Square.File._6;
    case "7":
      return Square.File._7;
    case "8":
      return Square.File._8;
  }
}
