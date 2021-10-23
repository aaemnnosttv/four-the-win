import React from 'react';
import range from 'lodash.range';

import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect } from '@wordpress/element';
import { LEFT, RIGHT } from '@wordpress/keycodes';

import Cell from './Cell';
import { NUM_COLS, NUM_ROWS } from './data/constants';
import Footer from './Footer';

const rows = range(NUM_ROWS).reverse();
const columns = range(NUM_COLS);

export default function Board() {
  const {
    makeMove,
    selectNextPlayableColumn,
    selectPrevPlayableColumn,
    selectColumn,
  } = useDispatch('core/game');
  const isGameOver = useSelect((select) => select('core/game').isGameOver());

  let keyHandler = useCallback(
    ({ keyCode }) => {
      // eslint-disable-next-line no-unused-expressions
      ({
        [LEFT]: selectPrevPlayableColumn,
        [RIGHT]: selectNextPlayableColumn,
      }[keyCode]?.());
    },
    [selectPrevPlayableColumn, selectNextPlayableColumn],
  );

  useEffect(() => {
    if (isGameOver) {
      selectColumn(null);
    }
  }, [isGameOver, selectColumn]);

  let submitHandler = (event) => {
    event.preventDefault();
    makeMove();
  };

  if (isGameOver) {
    keyHandler = undefined;
    submitHandler = undefined;
  }

  return (
    <form
      className="flex flex-col h-full"
      onSubmit={submitHandler}
      onKeyDown={keyHandler}
    >
      {/* Body */}
      <div className="flex-1">
        {/* Grid */}
        {/* Dynamic class: grid-cols-7 */}
        <div
          className={`bg-blue-400 grid grid-cols-${NUM_COLS} relative border-blue-500 border-l-8 border-r-8`}
        >
          {/* Lay out grid as a flat list of Cells as horizontal layers from top to bottom */}
          {rows.map((rdx) =>
            columns.map((cdx) => (
              <Cell column={cdx} row={rdx} key={`${cdx}:${rdx}`} />
            )),
          )}
          {isGameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-center bg-white bg-opacity-40 text-gray-500 text-opacity-90 tracking-widest">
              <div className="text-5xl mb-4">GAME OVER</div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <Footer />
      </div>
    </form>
  );
}
