import { createRegistry } from '@wordpress/data';
import store from './store';

export const registry = createRegistry();

registry.registerStore('core/game', store);

window.select = {
  ...registry.select('core/game'),
};
window.dispatch = {
  ...registry.dispatch('core/game'),
};
