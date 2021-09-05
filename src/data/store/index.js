import { combineReducers } from '@wordpress/data';

import * as actions from './actions';
import * as controls from './controls';
import * as selectors from './selectors';
import * as reducers from './reducers';
import { createGrid } from '../utils/grid';

const createInitialState = () => ({
  grid: createGrid(),
  currentPlayer: 1,
  selectedColumn: 3,
  locked: false,
  game: {
    winner: null,
    complete: false,
    tokens: null,
  },
});

const combinedReducer = combineReducers(reducers);
const reducer = (state, action) => {
  if (action.type === 'RESET') {
    return createInitialState();
  }

  return combinedReducer(state, action);
};

export default {
  initialState: createInitialState(),
  actions,
  controls,
  reducer,
  selectors,
};
