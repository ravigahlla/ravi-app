import { useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { createApiClient } from '../services/createApiClient';

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();
  
  const api = useMemo(() => {
    return createApiClient(() => getAccessTokenSilently());
  }, [getAccessTokenSilently]);
  
  return api;
} 