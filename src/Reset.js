import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelect } from '@wordpress/data';

export default function Reset() {
  const currentPlayer = useSelect((select) =>
    select('core/game').getCurrentPlayer(),
  );
  const isGameOver = useSelect((select) => select('core/game').isGameOver());
  const { reset } = useDispatch('core/game');

  const [armed, setArmed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [confirmTimeout, setConfirmTimeout] = useState();

  useEffect(() => {
    setArmed(false);
    setDisabled(false);
  }, [currentPlayer]);

  const handleClick = () => {
    if (armed || isGameOver) {
      reset();
      setArmed(false);
    } else {
      setDisabled(true);
      setArmed(true);
      clearTimeout(confirmTimeout);
      setConfirmTimeout(setTimeout(() => setDisabled(false), 3000));
    }
  };

  return (
    <button
      type="button"
      className={classnames('uppercase tracking-widest px-4 py-1 rounded', {
        'text-gray-200 bg-gray-600': !disabled,
        'bg-opacity-50': disabled,
        'bg-red-500': armed,
      })}
      onClick={handleClick}
      disabled={disabled && !isGameOver}
    >
      {armed ? 'Are you sure?' : 'Reset'}
    </button>
  );
}
