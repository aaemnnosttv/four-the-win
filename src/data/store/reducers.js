export const selectedColumn = (state, action) => {
  switch (action.type) {
    case 'SELECT_COLUMN': {
      return action.column;
    }
    default:
      return state;
  }
};

export const locked = (state, action) => {
  switch (action.type) {
    case 'LOCK': {
      return true;
    }
    case 'UNLOCK': {
      return false;
    }
    default:
      return state;
  }
};

export const currentPlayer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_PLAYER': {
      return action.num;
    }
    case 'GAME_OVER':
      return action.winner;
    default:
      return state;
  }
};

export const grid = (state, action) => {
  switch (action.type) {
    case 'MOVE': {
      const { column, player } = action;
      const newState = [...state];
      newState[column] = state[column].concat(player);

      return newState;
    }
    case 'RECEIVE_GRID':
      return action.grid;
    default:
      return state;
  }
};

export const game = (state, action) => {
  switch (action.type) {
    case 'GAME_OVER': {
      return {
        complete: true,
        winner: action.winner,
        tokens:
          action.tokens?.reduce((acc, [x, y]) => {
            return { ...acc, [`${x}:${y}`]: true };
          }, {}) || null,
      };
    }
    default:
      return state;
  }
};
