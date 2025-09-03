import React from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import { useDateTime } from '../../hooks/useDateTime';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { formatTime, formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';

export function StatusBar() {
  const dateTime = useDateTime();
  const networkStatus = useNetworkStatus();

  return (
    <div className="flex items-center justify-between w-full px-8 py-6 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="text-3xl font-bold text-gray-900">{formatTime(dateTime)}</div>
            <div className="text-base text-gray-600 font-medium">{formatDate(dateTime)}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <motion.div
          className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl"
          animate={{ opacity: networkStatus.isOnline ? 1 : 0.7 }}
        >
          {networkStatus.isOnline ? (
            <div className="bg-green-100 p-1 rounded-lg">
              <Wifi className="w-4 h-4 text-green-600" />
            </div>
          ) : (
            <div className="bg-red-100 p-1 rounded-lg">
              <WifiOff className="w-4 h-4 text-red-600" />
            </div>
          )}
          <span className={`text-base font-semibold ${networkStatus.isOnline ? 'text-green-600' : 'text-red-600'}`}>
            {networkStatus.isOnline ? 'Connected' : 'Offline'}
          </span>
          {networkStatus.latency && (
            <span className="text-xs text-gray-500">({networkStatus.latency}ms)</span>
          )}
        </motion.div>

        <div className="text-base text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-xl">
          Vistacks Kiosk v2.1
        </div>
      </div>
    </div>
  );
}