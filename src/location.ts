import * as immutable from "immutable";

export class Location implements immutable.ValueObject {
    private column: Location.Column;
    private file: Location.File;
  
    constructor(column: Location.Column, file: Location.File) {
      this.column = column;
      this.file = file;
    }
  
    static fromString(str: string): Location | undefined {
      if (str.length != 2) {
        return undefined;
      }
  
      let column: Location.Column;
      switch (str.toUpperCase()[0]) {
        case "A":
          column = Location.Column.A;
          break;
        case "B":
          column = Location.Column.B;
          break;
        case "C":
          column = Location.Column.C;
          break;
        case "D":
          column = Location.Column.D;
          break;
        case "E":
          column = Location.Column.E;
          break;
        case "F":
          column = Location.Column.F;
          break;
        case "G":
          column = Location.Column.G;
          break;
        case "H":
          column = Location.Column.H;
          break;
        default:
          return undefined;
      }
  
      let file: Location.File;
      switch (str.toUpperCase()[1]) {
        case "1":
          file = Location.File._1;
          break;
        case "2":
          file = Location.File._2;
          break;
        case "3":
          file = Location.File._3;
          break;
        case "4":
          file = Location.File._4;
          break;
        case "5":
          file = Location.File._5;
          break;
        case "6":
          file = Location.File._6;
          break;
        case "7":
          file = Location.File._7;
          break;
        case "8":
          file = Location.File._8;
          break;
        default:
          return undefined;
      }
  
      return new Location(column, file);
    }
  
    equals(other: Location): boolean {
      return this.column === other.column && this.file === other.file;
    }
  
    hashCode(): number {
      return this.column * 10 + this.file;
    }
  }
  
  export namespace Location {
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
  