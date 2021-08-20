import * as immutable from "immutable";
import * as chess from "./chess";
import * as fen from "./fen";

export function checkAllowedMoves(game: chess.Game, from: string, to: Array<string>) {
  const source = chess.Square.fromString(from)!;
  const piece = game.getPiece(source)!;
  const allowedDestinations = immutable.Set(to.map(chess.Square.fromString));

  for (let column of chess.Square.Columns) {
    for (let file of chess.Square.Files) {
      const destination = new chess.Square(column, file);

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
          throw new Error(`Move was not allowed: ${moveStr} (${fen.render(game)} -> ${fen.render(newGame)})`);
        }
      } else {
        try {
          expect(newGame.equals(game)).toBe(true);
        } catch (e) {
          throw new Error(`Move was allowed: ${moveStr} (${fen.render(game)} -> ${fen.render(newGame)})`);
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
        return `${got} should not be equal to ${expected}`;
      } else {
        return `${got} should be equal to ${expected}`;
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
