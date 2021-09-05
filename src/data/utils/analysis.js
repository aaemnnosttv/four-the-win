import invariant from 'invariant';
import groupBy from 'lodash.groupby';
import range from 'lodash.range';
import { MAX_COL_INDEX, MAX_ROW_INDEX, NUM_COLS, NUM_ROWS } from '../constants';

function createWinningConsecutiveTokensReducer(isConsecutiveToken) {
  return (acc = [], tokens = []) => {
    if (acc.length >= 4) {
      return acc; // we have a winner!
    }
    if (tokens.length < 4) {
      return acc; // not enough to win
    }
    let consecTokens = [];
    for (const currentToken of tokens) {
      if (!consecTokens.length) {
        // If there is no previous token, then the current token is the first in the new list.
        consecTokens.push(currentToken);
        continue;
      }

      const lastToken = consecTokens[consecTokens.length - 1];

      if (isConsecutiveToken({ currentToken, lastToken })) {
        consecTokens.push(currentToken);
      } else {
        // If the token isn't consecutive, restart the list
        consecTokens = [currentToken];
      }
    }

    if (consecTokens.length < 4) {
      return [];
    }

    return consecTokens;
  };
}

export function withTokens(_tokens) {
  invariant(Array.isArray(_tokens), 'tokens must be an array');

  const byColumn = () => Object.values(groupBy(_tokens, 0));
  const byRow = () => Object.values(groupBy(_tokens, 1));

  return {
    byColumn,
    byRow,
    getWinningColumnTokens() {
      return byColumn().reduce(
        createWinningConsecutiveTokensReducer(
          ({ currentToken, lastToken }) => currentToken[1] === lastToken[1] + 1,
        ),
        [],
      );
    },
    getWinningRowTokens() {
      return byRow().reduce(
        createWinningConsecutiveTokensReducer(
          ({ currentToken, lastToken }) => currentToken[0] === lastToken[0] + 1,
        ),
        [],
      );
    },
  };
}

export function gridDiagonals(grid, player) {
  /**
   * Creates a function which accepts an `x` and `y` value for the origin, and
   * returns a list of occupied cell diagonal coordinates for the given player.
   * @param {Function} iterateX returns the next `x` value for each iteration.
   */
  const createDiagonalListFrom = (iterateX) => {
    return (x, y) => {
      const coords = [];

      do {
        const tokenPlayer = grid[x][y];
        if (player === tokenPlayer) {
          coords.push([x, y]);
        }
        x = iterateX(x);
        y++;
      } while (-1 < x && x < NUM_COLS && y < NUM_ROWS);

      return coords;
    };
  };
  const northEastFrom = createDiagonalListFrom((x) => x + 1);
  const northWestFrom = createDiagonalListFrom((x) => x - 1);

  /**
   * Generate an array of occupied cell lists, going up and to the right.
   *
   * Note: the significance of `3` below is to skip generating lists of diagonals
   * which aren't capable of being long enough to yield a winning diagonal
   * based on the location of the starting point.
   * Since a diagonal is always x +/- 1, y + 1, a diagonal starting on a row within
   * the top 3 would not be possible to be longer than 3, unless it were to
   * start farther down, in which case it would be part of a different diagonal.
   *
   * IMPORTANT: the range end is not inclusive!
   *
   * @return {Array[]}
   */
  const northEast = () => [
    // Starting on the left-most column from the top, descending to a y of 1.
    ...range(MAX_ROW_INDEX - 3, 0).map((y) => northEastFrom(0, y)),
    // Add the corner separately since it intersects with both axis.
    northEastFrom(0, 0),
    // Generate diagonals along the bottom where 0 < x < (MAX_COL_INDEX - 3)
    ...range(MAX_COL_INDEX - 3, 0).map((x) => northEastFrom(x, 0)),
  ];
  /**
   * Generate an array of occupied cell lists, going up and to the left.
   *
   * @return {Array[]}
   */
  const northWest = () => [
    // Starting on the right-most column, descending to a y of 1.
    ...range(MAX_ROW_INDEX - 3, 0).map((y) => northWestFrom(MAX_COL_INDEX, y)),
    // Add the corner separately since it intersects with both axis.
    northWestFrom(MAX_COL_INDEX, 0),
    // Generate diagonals along the bottom where 3 < x < MAX_COL_INDEX
    ...range(3, MAX_COL_INDEX).map((x) => northWestFrom(x, 0)),
  ];

  const getWinningNorthEastDiagonal = () =>
    northEast().reduce(
      createWinningConsecutiveTokensReducer(
        ({ currentToken, lastToken }) =>
          currentToken[0] === lastToken[0] + 1 &&
          currentToken[1] === lastToken[1] + 1,
      ),
      [],
    );

  const getWinningNorthWestDiagonal = () =>
    northWest().reduce(
      createWinningConsecutiveTokensReducer(
        ({ currentToken, lastToken }) =>
          currentToken[0] === lastToken[0] - 1 &&
          currentToken[1] === lastToken[1] + 1,
      ),
      [],
    );

  return {
    northEast,
    northWest,
    getWinningNorthEastDiagonal,
    getWinningNorthWestDiagonal,
    // It's possible (although very unlikely) that two diagonals could have 4 tokens simultaneously
    // E.g. the top of a "pyramid"
    winningDiagonals: () => [
      ...getWinningNorthEastDiagonal(),
      ...getWinningNorthWestDiagonal(),
    ],
  };
}
