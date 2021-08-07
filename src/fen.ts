import * as immutable from "immutable";
import * as chess from "./chess";

// TODO handle invalid strings
export function parse(fen: string): chess.Game | undefined {
  let game = chess.Game.empty();
  const [board, nextToMove, _, enPassant] = fen.split(" ");
  if (nextToMove.toLowerCase() === "b") {
    game = game.withNextToMove(chess.Piece.Colour.BLACK);
  }
  if (enPassant !== "-") {
    game = game.withEnPassantSquare(chess.Square.fromString(enPassant)!);
  }

  return immutable
    .Range(chess.Square.File._8, chess.Square.File._1 - 1, -1)
    .zip(immutable.Seq(board.split("/")))
    .flatMap(([file, fileStr]) => parseFile(file, fileStr))
    .reduce((g, [s, p]) => g.addPiece(p, s), game);
}

function parseFile(file: chess.Square.File, fileStr: string): immutable.Seq.Indexed<[chess.Square, chess.Piece]> {
  const pieces = immutable.Seq(fileStr.split("")).flatMap((c) => {
    let emptySquares = parseInt(c);
    if (isNaN(emptySquares)) {
      return [chess.Piece.fromString(c)!];
    } else {
      return Array<chess.Piece>(emptySquares);
    }
  });

  return immutable
    .Seq(chess.Square.Columns)
    .map((c) => new chess.Square(c, file))
    .zip(pieces)
    .filter(([_, p]) => p !== undefined);
}

export function render(game: chess.Game): string {
  const board = immutable
    .Range(chess.Square.File._8, chess.Square.File._1 - 1, -1)
    .map((f) => renderFile(game, f))
    .join("/");

  let nextToMove = "w";
  if (game.getNextToMove() === chess.Piece.Colour.BLACK) {
    nextToMove = "b";
  }

  const enPassantSquare = game.getEnPassantSquare();
  let enPassant = "-";
  if (enPassantSquare !== undefined) {
    enPassant = enPassantSquare.toString().toLowerCase();
  }

  return board + " " + nextToMove + " - " + enPassant;
}

function renderFile(game: chess.Game, file: chess.Square.File) {
  const [board, count] = immutable
    .Seq(chess.Square.Columns)
    .map((c) => new chess.Square(c, file))
    .map((s) => game.getPiece(s))
    .reduce(
      ([s, c], p) => {
        if (p !== undefined) {
          return [s + numToString(c) + p.toString(), 0] as [string, number];
        } else {
          return [s, c + 1] as [string, number];
        }
      },
      ["", 0] as [string, number]
    );

  return board + numToString(count);
}

function numToString(n: number): string {
  return n === 0 ? "" : n.toString();
}
