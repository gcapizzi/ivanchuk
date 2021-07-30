import * as immutable from "immutable";
import * as chess from "./chess";
import { Game } from "./game";
import { Piece } from "./piece";
import { Square } from "./square";

export function checkAllowedMoves(game: Game, from: string, to: Array<string>) {
  const source = Square.fromString(from)!;
  const piece = game.getPiece(source)!;
  const allowedDestinations = immutable.Set(to.map(Square.fromString));

  for (let column of Square.Columns) {
    for (let file of Square.Files) {
      const destination = new Square(column, file);

      if (destination.equals(source)) {
        continue;
      }

      const moveStr = source.toString() + " -> " + destination.toString();
      const newGame = game.move(source, destination);

      if (allowedDestinations.includes(destination)) {
        try {
          expect(newGame.getPiece(source)).toBeUndefined();
          expect(newGame.getPiece(destination)?.equals(piece)).toBe(true);
        } catch (e) {
          throw new Error(`Move was not allowed: ${moveStr}`);
        }
      } else {
        try {
          expect(newGame.equals(game)).toBe(true);
        } catch (e) {
          throw new Error(`Move was allowed: ${moveStr} (resulting in: ${game.toString()} -> ${newGame.toString()})`);
        }
      }
    }
  }
}

expect.extend({
  toEqualValue<E extends immutable.ValueObject>(got: E, expected: E) {
    let pass = got.equals(expected);
    let message = () => {
      if (pass) {
        return `${got} should not be equal to ${expected}`
      } else {
        return `${got} should be equal to ${expected}`
      }
    };
    return { pass, message };
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualValue<E extends immutable.ValueObject>(expected: E): R;
    }
  }
}