import { store } from '../store';

export function getCurrentTerminalId(): number {
  const state = store.getState();
  return state.auth.terminal_id || parseInt(localStorage.getItem('terminal_id') || '2');
}