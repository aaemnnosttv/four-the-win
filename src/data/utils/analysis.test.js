import { gridDiagonals } from './analysis';

// Standard grid is 7x6 cells

describe('gridDiagonals', () => {
  describe('northEast', () => {
    it('includes the diagonal starting on x:0, y:2', () => {
      const grid = [
        [2, 2, 1],
        [2, 2, 2, 1],
        [2, 2, 2, 2, 1],
        [2, 2, 2, 2, 2, 1],
        [],
        [],
        [],
      ];
      expect(gridDiagonals(grid, 1).northEast()).toEqual(
        expect.arrayContaining([
          [
            [0, 2],
            [1, 3],
            [2, 4],
            [3, 5],
          ],
        ]),
      );
    });

    it('includes the diagonal starting on x:0, y:1', () => {
      const grid = [
        [2, 1],
        [2, 1, 1],
        [2, 1, 1, 1],
        [1, 2, 1, 1, 1],
        [],
        [],
        [],
      ];
      expect(gridDiagonals(grid, 1).northEast()).toEqual(
        expect.arrayContaining([
          [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
          ],
        ]),
      );
    });

    it('includes the diagonal starting on x:0, y:0', () => {
      const grid = [[1], [2, 1], [2, 2, 1], [2, 2, 2, 1], [], [], []];

      expect(gridDiagonals(grid, 1).northEast()).toEqual(
        expect.arrayContaining([
          [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
          ],
        ]),
      );
    });

    it('includes the diagonal starting on x:3, y:0', () => {
      const grid = [[], [], [], [1], [2, 1], [2, 2, 1], [2, 2, 2, 1]];

      expect(gridDiagonals(grid, 1).northEast()).toEqual(
        expect.arrayContaining([
          [
            [3, 0],
            [4, 1],
            [5, 2],
            [6, 3],
          ],
        ]),
      );
    });
  });

  describe('northWest', () => {
    it('includes the diagonal starting on x:6, y:2', () => {
      const grid = [
        [],
        [],
        [],
        [2, 2, 2, 2, 2, 1],
        [2, 2, 2, 2, 1],
        [2, 2, 2, 1],
        [2, 2, 1],
      ];

      expect(gridDiagonals(grid, 1).northWest()).toEqual(
        expect.arrayContaining([
          [
            [6, 2],
            [5, 3],
            [4, 4],
            [3, 5],
          ],
        ]),
      );
    });

    it('includes the diagonal starting on x:6, y:1', () => {
      const grid = [
        [],
        [],
        [],
        [2, 2, 2, 2, 1],
        [2, 2, 2, 1],
        [2, 2, 1],
        [2, 1],
      ];

      expect(gridDiagonals(grid, 1).northWest()).toEqual(
        expect.arrayContaining([
          [
            [6, 1],
            [5, 2],
            [4, 3],
            [3, 4],
          ],
        ]),
      );
    });

    it('includes the diagonal starting on x:6, y:0', () => {
      const grid = [[], [], [], [2, 2, 2, 1], [2, 2, 1], [2, 1], [1]];

      expect(gridDiagonals(grid, 1).northWest()).toEqual(
        expect.arrayContaining([
          [
            [6, 0],
            [5, 1],
            [4, 2],
            [3, 3],
          ],
        ]),
      );
    });

    it('includes the diagonal starting on x:3, y:0', () => {
      const grid = [[2, 2, 2, 1], [2, 2, 1], [2, 1], [1], [], [], []];

      expect(gridDiagonals(grid, 1).northWest()).toEqual(
        expect.arrayContaining([
          [
            [3, 0],
            [2, 1],
            [1, 2],
            [0, 3],
          ],
        ]),
      );
    });
  });
});
