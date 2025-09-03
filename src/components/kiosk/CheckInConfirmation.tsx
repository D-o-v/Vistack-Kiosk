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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="bg-white/20 rounded-full p-6">
              <Check className="w-20 h-20" />
            </div>
          </motion.div>
          <CardTitle className="text-5xl text-center font-bold">
            {visitorData.employeeId ? 'Welcome Back!' : 'Welcome to Vistacks!'}
          </CardTitle>
          <p className="text-2xl text-center text-green-100 mt-4">
            Your check-in is complete
          </p>
        </CardHeader>
        <CardContent className="p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Visit Details</h3>
              <div className="space-y-6">
                {visitDetails.map((detail, index) => (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center space-x-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl"
                  >
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <detail.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-gray-600">{detail.label}</p>
                      <p className="text-xl font-bold text-gray-900">{detail.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              {visitorData.photo && (
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Visitor Photo</h3>
                  <div className="relative">
                    <img
                      src={visitorData.photo}
                      alt="Visitor"
                      className="w-64 h-48 object-cover rounded-2xl border-4 border-gray-200 mx-auto shadow-lg"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-full">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <Button
                  variant="primary"
                  size="xl"
                  onClick={handlePrintBadge}
                  className="w-full flex items-center justify-center space-x-4"
                >
                  <Printer className="w-7 h-7" />
                  <span className="text-xl">Print Visitor Badge</span>
                </Button>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
                  <h4 className="font-bold text-blue-800 mb-4 text-lg text-center">Important Instructions</h4>
                  <ul className="text-base text-blue-700 space-y-2 text-left">
                    <li>• Please wear your visitor badge at all times</li>
                    <li>• {visitorData.employeeId ? 'Welcome back to the office' : 'Your host has been notified of your arrival'}</li>
                    <li>• Check out before leaving the building</li>
                    <li>• For emergencies, call security at (555) 911-HELP</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-8">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="bg-gray-300 p-2 rounded-xl">
                  <Clock className="w-7 h-7 text-gray-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  Returning to main screen in {countdown} seconds
                </span>
              </div>
              <Button
                variant="secondary"
                size="xl"
                onClick={onComplete}
                className="flex items-center justify-center space-x-3"
              >
                <span>Continue to Main Screen</span>
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}