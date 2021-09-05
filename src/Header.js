import React from 'react';
import classnames from 'classnames';
import { useSelect } from '@wordpress/data';

const Player = ({ color, num = 0, winner }) => (
  <div className={classnames('flex-1', 'p-2', `bg-${color}`)}>
    Player {num} {winner && '🏆'}
  </div>
);

export default function Header() {
  const currentPlayer = useSelect((select) =>
    select('core/game').getCurrentPlayer(),
  );
  const winner = useSelect((select) => select('core/game').getWinner());

  return (
    <div className="sticky top-0 z-10">
      <div className="flex">
        <Player
          num="1"
          color={currentPlayer === 1 ? 'red-400' : 'gray-200'}
          winner={winner === 1}
        />
        <Player
          num="2"
          color={currentPlayer === 2 ? 'yellow-400' : 'gray-200'}
          winner={winner === 2}
        />
      </div>
      <div className="bg-gradient-to-r from-yellow-300 to-red-500 h-1"></div>
    </div>
  );
}
