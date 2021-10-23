import React from 'react';
import classnames from 'classnames';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

export default function Cell({ column, row }) {
  const currentPlayer = useSelect((select) =>
    select('core/game').getCurrentPlayer(),
  );
  const player = useSelect((select) =>
    select('core/game').getCell(column, row),
  );
  const selectedColumn = useSelect((select) =>
    select('core/game').getSelectedColumn(),
  );
  const isLocked = useSelect((select) => select('core/game').isLocked());
  const columnTokenCount = useSelect((select) =>
    select('core/game').getColumnTokenCount(column),
  );
  const isColumnFull = useSelect((select) =>
    select('core/game').isColumnFull(column),
  );
  const isWinningCell = useSelect((select) =>
    select('core/game').isWinningCell(column, row),
  );
  const isGameOver = useSelect((select) => select('core/game').isGameOver());

  // Only the next empty row in the current column is "playable".
  const isPlayable =
    !isGameOver && selectedColumn === column && columnTokenCount === row;

  const elRef = useRef();

  const { selectColumn } = useDispatch('core/game');

  const onHover = () => {
    if (!isLocked && isPlayable) {
      elRef.current.focus();
    }
    if (selectedColumn !== column && !isColumnFull) {
      selectColumn(column);
    }
  };

  useEffect(() => {
    if (!isLocked && isPlayable) {
      elRef.current.focus();
    }
  }, [isLocked, isPlayable]);

  const El = isPlayable ? 'button' : 'div';

  return (
    <div
      className={classnames('relative', 'bg-opacity-40', 'pb-[100%]', {
        'bg-red-200': selectedColumn === column && currentPlayer === 1,
        'bg-yellow-200': selectedColumn === column && currentPlayer === 2,
      })}
      onMouseOver={isLocked ? undefined : onHover}
    >
      <div className="m-2 absolute inset-0">
        <El
          ref={elRef}
          className={classnames(
            'rounded-full',
            'text-opacity-70',
            'w-full',
            'h-full',
            'flex',
            'items-center',
            'justify-center',
            'font-mono',
            'text-gray-900',
            'select-none',
            'border-opacity-25',
            {
              'bg-white': !player,
              'border-4': !!player,
              'border-gray-800': !isWinningCell,
              'border-white': isWinningCell,
              'text-2xl': isWinningCell,
              'bg-red-400': player === 1,
              'bg-yellow-400': player === 2,
            },
          )}
        >
          {!isWinningCell && `${column},${row}`}
          {isWinningCell && '⭐'}
        </El>
      </div>
    </div>
  );
}
