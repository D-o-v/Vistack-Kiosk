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

    // Check connectivity every 30 seconds
    const interval = setInterval(async () => {
      try {
        const start = Date.now();
        await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        const latency = Date.now() - start;
        
        setNetworkStatus(prev => ({
          ...prev,
          isOnline: true,
          lastCheck: new Date(),
          latency
        }));
      } catch {
        setNetworkStatus(prev => ({
          ...prev,
          isOnline: false,
          lastCheck: new Date()
        }));
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return networkStatus;
}