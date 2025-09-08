import React from 'react';
import { Wifi, WifiOff, Clock, LogOut } from 'lucide-react';
import { useDateTime } from '../../hooks/useDateTime';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { formatTime, formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

export function StatusBar() {
  const dispatch = useAppDispatch();
  const dateTime = useDateTime();
  const networkStatus = useNetworkStatus();

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="text-lg sm:text-xl font-bold text-gray-900">{formatTime(dateTime)}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">{formatDate(dateTime)}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <motion.div
          className="flex items-center space-x-2 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg"
          animate={{ opacity: networkStatus.isOnline ? 1 : 0.7 }}
        >
          {networkStatus.isOnline ? (
            <div className="bg-green-100 p-1 rounded">
              <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            </div>
          ) : (
            <div className="bg-red-100 p-1 rounded">
              <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
            </div>
          )}
          <span className={`text-xs sm:text-sm font-medium ${networkStatus.isOnline ? 'text-green-600' : 'text-red-600'}`}>
            {networkStatus.isOnline ? 'Online' : 'Offline'}
          </span>
        </motion.div>

        <div className="hidden sm:block text-xs text-gray-600 font-medium bg-gray-50 px-3 py-2 rounded-lg">
          Vistacks v2.1
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
          <span className="hidden sm:inline text-xs text-red-600 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}