import { subscribeAuthState } from '@/domains/auth/services/authService';
import { useEffect, useState } from 'react';

export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAuthState((currentUser) => {
      setUser(currentUser);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading: !initialized };
};
