import { store } from '../store';

export function getCurrentTerminalId(): number {
  const state = store.getState();
  const terminalId = state.auth.terminal_id || parseInt(localStorage.getItem('terminal_id') || '0');
  if (!terminalId) {
    throw new Error('No terminal ID found. Please login again.');
  }
  return terminalId;
}