import { useState, useEffect } from 'react';
import { NetworkStatus } from '../types';

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    lastCheck: new Date()
  });

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus({
        isOnline: true,
        lastCheck: new Date()
      });
    };

    const handleOffline = () => {
      setNetworkStatus({
        isOnline: false,
        lastCheck: new Date()
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connectivity every 30 seconds using navigator.onLine
    const interval = setInterval(() => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine,
        lastCheck: new Date()
      }));
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return networkStatus;
}