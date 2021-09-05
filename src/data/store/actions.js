import { controls } from '@wordpress/data';
import { withTokens, gridDiagonals } from '../utils/analysis';
import { nextColumnIndex, prevColumnIndex } from '../utils/grid';

const { select } = controls;

export function* makeMove() {
  const isLocked = yield select('core/game', 'isLocked');

  if (isLocked) {
    return;
  }

  const column = yield select('core/game', 'getSelectedColumn');
  let isColumnFull = yield select('core/game', 'isColumnFull', column);

  if (isColumnFull) {
    return;
  }

  yield { type: 'LOCK' };

  const currentPlayer = yield select('core/game', 'getCurrentPlayer');

  yield {
    type: 'MOVE',
    column,
    // `player` is necessary in the action because the `grid` reducer won't have access to `currentPlayer`
    player: currentPlayer,
  };

  yield checkFTW();

  if (yield select('core/game', 'isGameOver')) {
    return;
  }

  // The game continues...
  isColumnFull = yield select('core/game', 'isColumnFull', column);

  if (isColumnFull) {
    yield selectNextPlayableColumn();
  }

  const nextPlayer = currentPlayer === 1 ? 2 : 1;

  yield { type: 'SCHEDULE_UNLOCK', nextPlayer };
}

export function* checkFTW() {
  // Only the current player can win.
  const playerTokens = yield select('core/game', 'getPlayerTokenCoords');
  // A win isn't possible if they haven't played at least 4 tokens yet.
  if (playerTokens.length < 4) {
    return;
  }
  const tokens = withTokens(playerTokens);
  // Check consecutive tokens in same column (same x)
  const winningColumnTokens = tokens.getWinningColumnTokens();
  // Check consecutive tokens in same row (same y)
  const winningRowTokens = tokens.getWinningRowTokens();

  const grid = yield select('core/game', 'getGrid');
  // Build all diagonals (east/west)
  const currentPlayer = yield select('core/game', 'getCurrentPlayer');
  const diagonals = gridDiagonals(grid, currentPlayer);
  const winningDiagonals = diagonals.winningDiagonals();
  const winningTokens = [
    ...winningColumnTokens,
    ...winningRowTokens,
    ...winningDiagonals,
  ];

  if (winningTokens.length) {
    return yield endGame({ winner: currentPlayer, tokens: winningTokens });
  }

  const hasAvailableColumns = yield select('core/game', 'hasAvailableColumns');

  if (!hasAvailableColumns) {
    yield endGame();
  }
}

export const endGame = ({ winner = null, tokens = null } = {}) => {
  return { type: 'GAME_OVER', winner, tokens };
};

export const setCurrentPlayer = (num) => {
  return {
    type: 'SET_CURRENT_PLAYER',
    num,
  };
};

export const selectColumn = (column) => {
  return {
    type: 'SELECT_COLUMN',
    column,
  };
};

function createSelectPlayableColumnAction(relativeColumnIndexFunc) {
  return function* selectPlayableColumn() {
    const selectedColumn = yield select('core/game', 'getSelectedColumn');
    let column = selectedColumn;
    let isColumnFull;
    do {
      column = relativeColumnIndexFunc(column);
      isColumnFull = yield select('core/game', 'isColumnFull', column);
    } while (isColumnFull && column !== selectedColumn);

    // If the selected column is the only one left, there's nothing to do.
    if (!isColumnFull && column === selectedColumn) {
      return;
    }
    // At this point if `isColumnFull` is true, then all columns are full so we unselect it.
    // Otherwise, we select the column.
    yield selectColumn(isColumnFull ? null : column);
  };
}

export const receiveGrid = (grid) => ({
  type: 'RECEIVE_GRID',
  grid,
});

export const reset = () => {
  return { type: 'RESET' };
};

export const selectNextPlayableColumn = createSelectPlayableColumnAction(
  nextColumnIndex,
);
export const selectPrevPlayableColumn = createSelectPlayableColumnAction(
  prevColumnIndex,
);

export const unlock = () => ({ type: 'UNLOCK' });
