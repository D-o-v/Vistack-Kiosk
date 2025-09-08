import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Printer, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatTime, generateBadgeNumber } from '../../lib/utils';

interface CheckInConfirmationProps {
  visitorData: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    purpose: string;
    hostName: string;
    hostDepartment?: string;
    photo?: string;
    visitor_tag?: string;
    status?: string;
    checkin_method?: string;
    created_at?: string;
    image_url?: string;
    document_url?: string;
    signature_url?: string;
  };
  onComplete: () => void;
  onPrintBadge?: () => void;
}

export function CheckInConfirmation({ visitorData, onComplete, onPrintBadge }: CheckInConfirmationProps) {
  const [countdown, setCountdown] = useState(15);
  const badgeNumber = visitorData.visitor_tag || generateBadgeNumber();
  const checkInTime = visitorData.created_at ? new Date(visitorData.created_at) : new Date();
  const status = visitorData.status || 'pending';

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
    alert('Badge printing initiated. Please wait for your visitor badge.');
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-white/20 rounded-full p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center"
            >
              <Check className="w-8 h-8" />
            </motion.div>
            <h1 className="text-xl font-bold mb-1">Welcome to Vistacks!</h1>
            <p className="text-sm text-green-100">Your check-in is complete</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Status Badge */}
            <div className="text-center">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                status === 'approved' ? 'bg-green-100 text-green-800' :
                status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {status === 'pending' ? 'Pending Approval' : 
                 status === 'approved' ? 'Approved' : 
                 status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 text-center">Registration Complete</h3>
            
            {/* Visitor Photo */}
            {visitorData.image_url && (
              <div className="text-center">
                <img 
                  src={visitorData.image_url} 
                  alt="Visitor Photo" 
                  className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-green-200"
                />
              </div>
            )}
            
            {/* Visitor Details */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Visitor ID</span>
                <span className="text-base font-bold text-gray-900">#{visitorData.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Visitor</span>
                <span className="text-base font-bold text-gray-900">{visitorData.name}</span>
              </div>
              {visitorData.email && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Email</span>
                  <span className="text-base text-gray-900">{visitorData.email}</span>
                </div>
              )}
              {visitorData.phone && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Phone</span>
                  <span className="text-base text-gray-900">{visitorData.phone}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Purpose</span>
                <span className="text-base font-bold text-gray-900">{visitorData.purpose}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Check-in Method</span>
                <span className="text-base text-gray-900">{visitorData.checkin_method || 'Manual'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Registration Time</span>
                <span className="text-base font-bold text-gray-900">{formatTime(checkInTime)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-600">Visitor Tag</span>
                <span className="text-base font-bold text-green-600">{badgeNumber}</span>
              </div>
            </div>

            {/* Document Links */}
            {(visitorData.document_url || visitorData.signature_url) && (
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Uploaded Documents</h4>
                <div className="space-y-1">
                  {visitorData.document_url && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">ID Document</span>
                      <a href={visitorData.document_url} target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-blue-800 hover:underline">View</a>
                    </div>
                  )}
                  {visitorData.signature_url && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">Signature</span>
                      <a href={visitorData.signature_url} target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-blue-800 hover:underline">View</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Print Badge Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handlePrintBadge}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center space-x-2 py-3"
            >
              <Printer className="w-5 h-5" />
              <span>Print Visitor Badge</span>
            </Button>

            {/* Status Message */}
            <div className={`border rounded-lg p-4 ${
              status === 'pending' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="text-center">
                {status === 'pending' ? (
                  <>
                    <p className="text-sm text-yellow-800 font-medium mb-2">Registration Submitted Successfully!</p>
                    <p className="text-xs text-yellow-600">Please wait for approval • Your visitor tag is {badgeNumber}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-blue-800 font-medium mb-2">Please wear your badge at all times</p>
                    <p className="text-xs text-blue-600">Your host has been notified • Check out before leaving</p>
                  </>
                )}
              </div>
            </div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
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
          </div>
        </div>
      </motion.div>
    </div>
  );
}