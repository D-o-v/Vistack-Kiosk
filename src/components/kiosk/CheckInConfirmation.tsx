import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, User, Building, Phone, Mail, Copy, Printer, ArrowRight, UserCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatTime, generateBadgeNumber } from '../../lib/utils';

interface CheckInConfirmationProps {
  visitorData: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    purpose: string;
    hostName: string;
    hostDepartment?: string;
    photo?: string;
  };
  onComplete: () => void;
  onPrintBadge?: () => void;
}

export function CheckInConfirmation({ visitorData, onComplete, onPrintBadge }: CheckInConfirmationProps) {
  const [countdown, setCountdown] = useState(15);
  const [badgeNumber] = useState(() => generateBadgeNumber());
  const checkInTime = new Date();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handlePrintBadge = () => {
    if (onPrintBadge) {
      onPrintBadge();
    }
    // Simulate badge printing
    alert('Badge printing initiated. Please wait for your visitor badge.');
  };

  const visitDetails = [
    { icon: User, label: 'Visitor', value: visitorData.name },
    { icon: Building, label: 'Host', value: visitorData.hostName === 'Self' ? 'Employee Check-in' : `${visitorData.hostName}${visitorData.hostDepartment ? ` - ${visitorData.hostDepartment}` : ''}` },
    { icon: Clock, label: 'Check-in Time', value: formatTime(checkInTime) },
    { icon: Copy, label: 'Badge Number', value: badgeNumber },
    ...(visitorData.employeeId ? [{ icon: UserCheck, label: 'Employee ID', value: visitorData.employeeId }] : [])
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <Card className="overflow-hidden shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-white/20 rounded-full p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center"
            >
              <Check className="w-8 h-8" />
            </motion.div>
            <CardTitle className="text-xl sm:text-2xl font-bold mb-1">
              Welcome to Vistacks!
            </CardTitle>
            <p className="text-sm text-green-100">
              Your check-in is complete
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 text-center mb-4">Visit Details</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <span className="text-sm font-medium text-gray-600">Visitor</span>
                  <span className="text-base font-bold text-gray-900">{visitorData.name || 'Name not detected'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <span className="text-sm font-medium text-gray-600">Host</span>
                  <span className="text-base font-bold text-gray-900">{visitorData.hostName || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <span className="text-sm font-medium text-gray-600">Check-in Time</span>
                  <span className="text-base font-bold text-gray-900">{formatTime(checkInTime)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">Badge Number</span>
                  <span className="text-base font-bold text-green-600">{badgeNumber}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handlePrintBadge}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center space-x-2 py-3"
              >
                <Printer className="w-5 h-5" />
                <span>Print Visitor Badge</span>
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm text-blue-800 font-medium mb-2">Please wear your badge at all times</p>
                  <p className="text-xs text-blue-600">Your host has been notified • Check out before leaving</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-3">Returning to main screen in {countdown}s</p>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onComplete}
                  className="flex items-center justify-center space-x-2 mx-auto"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}