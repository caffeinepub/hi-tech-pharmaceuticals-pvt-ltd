const ADMIN_SESSION_KEY = 'admin_session_ui_state';

interface AdminSessionUIState {
  timestamp: number;
}

export function setAdminSessionUIState(): void {
  const state: AdminSessionUIState = {
    timestamp: Date.now(),
  };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(state));
}

export function getAdminSessionUIState(): AdminSessionUIState | null {
  try {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AdminSessionUIState;
  } catch {
    return null;
  }
}

export function clearAdminSessionUIState(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
