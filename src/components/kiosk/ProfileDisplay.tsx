import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Building, Clock, CheckCircle, ArrowLeft, QrCode } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Visitor } from '../../types';
import QRCode from 'react-qr-code';

interface ProfileDisplayProps {
  visitor: Visitor;
  onCheckIn: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function ProfileDisplay({ visitor, onCheckIn, onBack, isLoading = false }: ProfileDisplayProps) {
  const [showQR, setShowQR] = useState(false);

  const qrData = JSON.stringify({
    id: visitor.id,
    name: visitor.name,
    email: visitor.email,
    checkInTime: new Date().toISOString(),
    badgeNumber: visitor.badgeNumber
  });

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
          <CardTitle className="text-xl sm:text-2xl flex items-center justify-center space-x-2 sm:space-x-3">
            <User className="w-6 h-6 sm:w-8 sm:h-8" />
            <span>Welcome Back!</span>
          </CardTitle>
          <p className="text-blue-100 text-sm sm:text-base mt-2">
            Confirm your check-in below
          </p>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Profile Information */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                  {visitor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                
                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{visitor.name}</h3>
                  
                  <div className="space-y-1 sm:space-y-2">
                    {visitor.email && (
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 text-sm">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{visitor.email}</span>
                      </div>
                    )}
                    
                    {visitor.company && (
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 text-sm">
                        <Building className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{visitor.company}</span>
                      </div>
                    )}
                    
                    {visitor.visitCount && (
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 text-sm">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Visit #{visitor.visitCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Access Code Display */}
            {visitor.badgeNumber && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-5 text-center">
                <h4 className="text-base sm:text-lg font-semibold text-green-800 mb-2 sm:mb-3">Your Access Code</h4>
                <div className="text-xl sm:text-2xl font-mono font-bold text-green-700 bg-white rounded-lg py-2 sm:py-3 px-4 sm:px-6 inline-block">
                  {visitor.badgeNumber}
                </div>
                <p className="text-green-600 text-xs sm:text-sm mt-2">
                  Save this code for future visits
                </p>
              </div>
            )}

            {/* QR Code Section */}
            <div className="text-center">
              <Button
                onClick={() => setShowQR(!showQR)}
                variant="secondary"
                size="sm"
                className="mb-3 sm:mb-4"
              >
                <QrCode className="w-4 h-4 mr-2" />
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </Button>
              
              {showQR && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-200 inline-block"
                >
                  <QRCode
                    value={qrData}
                    size={150}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                    Scan with your phone
                  </p>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={onBack}
                variant="secondary"
                size="lg"
                className="flex items-center justify-center space-x-2 flex-1"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Back</span>
              </Button>
              
              <Button
                onClick={onCheckIn}
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center space-x-2 flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
                ) : (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span>{isLoading ? 'Checking In...' : 'Confirm Check-In'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}