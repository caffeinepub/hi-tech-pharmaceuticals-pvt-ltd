import { useCallback, useState } from 'react';
import { useInternetIdentity } from './useInternetIdentity';

export function useAuthGate() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const [intendedAction, setIntendedAction] = useState<(() => void) | null>(null);

  const isAuthenticated = !!identity;

  const requireCustomerAuth = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action();
      } else {
        setIntendedAction(() => action);
        login();
      }
    },
    [isAuthenticated, login]
  );

  // Execute intended action after successful login
  if (loginStatus === 'success' && intendedAction && isAuthenticated) {
    const action = intendedAction;
    setIntendedAction(null);
    action();
  }

  return {
    isAuthenticated,
    requireCustomerAuth,
    loginStatus,
  };
}
