import { createRegistry } from '@wordpress/data';
import { createGrid } from '../utils/grid';
import store from './';

describe('store', () => {
  let registry;
  let select;
  let dispatch;

  beforeEach(() => {
    registry = createRegistry();
    registry.registerStore('core/game', store);
    ({ select, dispatch } = registry);
  });

  describe('selectors', () => {
    describe('getPlayerTokenCoords', () => {
      let getPlayerTokenCoords;
      beforeEach(() => ({ getPlayerTokenCoords } = select('core/game')));

      it('returns an empty array when the player has played no tokens', () => {
        expect(getPlayerTokenCoords()).toEqual([]);
      });

      it('returns an array of x,y coordinates for the tokens the current player has played', () => {
        const grid = createGrid();
        grid[3][0] = 1;
        grid[3][1] = 2;
        dispatch('core/game').receiveGrid(grid);

        expect(getPlayerTokenCoords()).toEqual([[3, 0]]);
      });
    });
  });
});
