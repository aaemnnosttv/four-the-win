import { NUM_ROWS } from '../constants';

export function hasAvailableColumns(state) {
  return state.grid.some(
    (yArr, column) => isColumnFull(state, column) === false,
  );
}

export function getCurrentPlayer(state) {
  return state.currentPlayer;
}

export function getGrid(state) {
  return state.grid;
}

export function getCell(state, x, y) {
  return state.grid[x][y] || 0;
}

export function getSelectedColumn(state) {
  return state.selectedColumn;
}

export function getColumnTokenCount(state, column) {
  return state.grid[column].length;
}

export function getPlayerTokenCoords(state, player = state.currentPlayer) {
  const { grid } = state;

  return [...grid.entries()].flatMap(([x, yArr]) => {
    return [...yArr.entries()]
      .filter(([, p]) => player === p)
      .map(([y]) => [x, y]);
  });
}

export function isColumnFull(state, column) {
  // Returns true if the y array has values for each row.
  return state.grid[column].length >= NUM_ROWS;
}

export function isWinningCell(state, x, y) {
  return isGameOver(state) && !!state.game.tokens?.[`${x}:${y}`];
}

export function isGameOver(state) {
  return !!state.game.complete;
}

export function getWinner(state) {
  return state.game.winner;
}

export function isLocked(state) {
  return state.locked;
}
