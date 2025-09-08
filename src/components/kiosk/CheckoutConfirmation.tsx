import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, User, Building, Home } from 'lucide-react';
import { Visitor } from '../../types';

interface CheckoutConfirmationProps {
  visitorData: Visitor;
  onComplete: () => void;
}

export function CheckoutConfirmation({ visitorData, onComplete }: CheckoutConfirmationProps) {
  const checkInTime = visitorData.checkInTime ? new Date(visitorData.checkInTime) : new Date();
  const checkOutTime = new Date();
  const duration = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60));

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-4">
            <div className="bg-white/20 rounded-full p-2 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold mb-1">Checkout Complete!</h1>
            <p className="text-green-100 text-sm">Thank you for your visit. Have a great day!</p>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {/* Visitor Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {visitorData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{visitorData.name}</h3>
                    {visitorData.company && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <Building className="w-3 h-3 mr-1" />
                        {visitorData.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Visit Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-blue-600 font-medium">Check-in Time</p>
                  <p className="text-sm font-bold text-blue-800">{formatTime(checkInTime)}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-green-600 font-medium">Check-out Time</p>
                  <p className="text-sm font-bold text-green-800">{formatTime(checkOutTime)}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <User className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-purple-600 font-medium">Visit Duration</p>
                <p className="text-base font-bold text-purple-800">{formatDuration(duration)}</p>
              </div>

              {/* Badge Return Reminder */}
              {visitorData.badgeNumber && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <div className="bg-orange-100 p-1 rounded">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="text-orange-800">
                      <p className="font-medium text-sm mb-1">Badge Return</p>
                      <p className="text-xs">Please return visitor badge #{visitorData.badgeNumber} to the reception desk.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}