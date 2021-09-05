import { createRegistryControl } from '@wordpress/data';
import { TURN_LOCK_MS } from '../constants';

export const SCHEDULE_UNLOCK = createRegistryControl(
  (registry) => async ({ nextPlayer }) => {
    await new Promise((resolve) => setTimeout(resolve, TURN_LOCK_MS));
    registry.dispatch('core/game').setCurrentPlayer(nextPlayer);
    registry.dispatch('core/game').unlock();
  },
);
