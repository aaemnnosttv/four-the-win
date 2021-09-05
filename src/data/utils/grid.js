import { MAX_COL_INDEX, NUM_COLS } from '../constants';

// https://youtu.be/Zu2QIT84D94
export function createGrid() {
  return Array.from({ length: NUM_COLS }).map(() => []);
}

export const nextColumnIndex = (current) =>
  current === MAX_COL_INDEX ? 0 : current + 1;

export const prevColumnIndex = (current) =>
  current === 0 ? MAX_COL_INDEX : current - 1;
