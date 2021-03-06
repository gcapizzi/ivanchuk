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

  // TODO test
  toString(): string {
    return columnStr(this.column) + fileStr(this.file);
  }

  equals(other: Square): boolean {
    return this.column === other.column && this.file === other.file;
  }

  hashCode(): number {
    return this.column * 10 + this.file;
  }

  addFile(n: number): Square | undefined {
    const newFile = this.file + n;
    if (newFile >= 0 && newFile <= 7) {
      return new Square(this.column, newFile);
    }
  }

  addColumn(n: number): Square | undefined {
    const newColumn = this.column + n;
    if (newColumn >= 0 && newColumn <= 7) {
      return new Square(newColumn, this.file);
    }
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

  export const Files = [File._1, File._2, File._3, File._4, File._5, File._6, File._7, File._8];
}

function parseColumn(str: string): Square.Column | undefined {
  switch (str.toLowerCase()) {
    case "a":
      return Square.Column.A;
    case "b":
      return Square.Column.B;
    case "c":
      return Square.Column.C;
    case "d":
      return Square.Column.D;
    case "e":
      return Square.Column.E;
    case "f":
      return Square.Column.F;
    case "g":
      return Square.Column.G;
    case "h":
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

function columnStr(column: Square.Column): string {
  switch (column) {
    case Square.Column.A:
      return "a";
    case Square.Column.B:
      return "b";
    case Square.Column.C:
      return "c";
    case Square.Column.D:
      return "d";
    case Square.Column.E:
      return "e";
    case Square.Column.F:
      return "f";
    case Square.Column.G:
      return "g";
    case Square.Column.H:
      return "h";
  }
}

function fileStr(file: Square.File): string {
  switch (file) {
    case Square.File._1:
      return "1";
    case Square.File._2:
      return "2";
    case Square.File._3:
      return "3";
    case Square.File._4:
      return "4";
    case Square.File._5:
      return "5";
    case Square.File._6:
      return "6";
    case Square.File._7:
      return "7";
    case Square.File._8:
      return "8";
  }
}
