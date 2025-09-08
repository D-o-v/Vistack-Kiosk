import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, User, Building, Home } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Visitor } from '../../types';

interface CheckoutConfirmationProps {
  visitorData: Visitor;
  onComplete: () => void;
}

export function CheckoutConfirmation({ visitorData, onComplete }: CheckoutConfirmationProps) {
  const checkInTime = visitorData.checkInTime ? new Date(visitorData.checkInTime) : new Date();
  const checkOutTime = new Date();
  const duration = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60)); // minutes

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
    <div className="min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="bg-white/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <CardTitle className="text-2xl sm:text-3xl mb-2">
            Checkout Complete!
          </CardTitle>
          <p className="text-green-100 text-sm sm:text-base">
            Thank you for your visit. Have a great day!
          </p>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8">
          <div className="space-y-6">
            {/* Visitor Info */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                  {visitorData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{visitorData.name}</h3>
                  {visitorData.company && (
                    <p className="text-sm sm:text-base text-gray-600 flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {visitorData.company}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Visit Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-blue-600 font-medium">Check-in Time</p>
                <p className="text-sm sm:text-base font-bold text-blue-800">
                  {formatTime(checkInTime)}
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-green-600 font-medium">Check-out Time</p>
                <p className="text-sm sm:text-base font-bold text-green-800">
                  {formatTime(checkOutTime)}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <User className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-purple-600 font-medium">Visit Duration</p>
              <p className="text-lg sm:text-xl font-bold text-purple-800">
                {formatDuration(duration)}
              </p>
            </div>

            {/* Badge Return Reminder */}
            {visitorData.badgeNumber && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-orange-800">
                    <p className="font-medium text-sm sm:text-base mb-1">Badge Return</p>
                    <p className="text-xs sm:text-sm">
                      Please return visitor badge #{visitorData.badgeNumber} to the reception desk.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4">
              <Button
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 sm:py-4 text-base sm:text-lg"
                size="lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Return to Home
              </Button>
            </div>
          </div>
        </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}