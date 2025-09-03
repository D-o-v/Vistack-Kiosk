import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, KeySquare, AlertCircle, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface QRScannerProps {
  onScanSuccess: (code: string) => void;
  onBack: () => void;
  title?: string;
  description?: string;
}

export function QRScanner({ 
  onScanSuccess, 
  onBack, 
  title = "Scan Invitation Code",
  description = "Scan your QR code or enter the invitation code manually"
}: QRScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      setError('Please enter an invitation code');
      return;
    }

    if (manualCode.length < 6) {
      setError('Invitation code must be at least 6 characters');
      return;
    }

    setError('');
    setScanResult(manualCode.toUpperCase());
    
    // Simulate validation delay
    setTimeout(() => {
      onScanSuccess(manualCode.toUpperCase());
    }, 1500);
  };

  const simulateQRScan = () => {
    setIsScanning(true);
    setError('');
    
    // Simulate QR code scanning
    setTimeout(() => {
      const mockCode = 'INV' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setScanResult(mockCode);
      setIsScanning(false);
      
      setTimeout(() => {
        onScanSuccess(mockCode);
      }, 1000);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-6"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardTitle className="text-4xl text-center flex items-center justify-center space-x-4">
            <QrCode className="w-10 h-10" />
            <span>{title}</span>
          </CardTitle>
          <p className="text-xl text-center text-purple-100 mt-3">
            {description}
          </p>
        </CardHeader>
        <CardContent className="p-10">
          {scanResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="bg-green-100 rounded-full p-6 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                <Check className="w-16 h-16 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Code Verified!</h3>
              <p className="text-xl text-gray-600 mb-6">Invitation code: <span className="font-mono font-bold">{scanResult}</span></p>
              <div className="animate-pulse text-blue-600 text-lg font-medium">
                Processing your invitation...
              </div>
            </motion.div>
          ) : (
            <div className="space-y-12">
              {/* QR Scanner Section */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Scan QR Code</h3>
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-10 mb-8">
                  <div className="w-80 h-80 mx-auto border-4 border-dashed border-purple-300 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {isScanning ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-2xl"
                      />
                    ) : (
                      <QrCode className="w-32 h-32 text-purple-400" />
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isScanning ? (
                        <div className="text-center">
                          <div className="animate-pulse text-purple-600">
                            <Camera className="w-12 h-12 mx-auto mb-3" />
                            <p className="text-lg font-bold">Scanning...</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-purple-600">
                          <QrCode className="w-20 h-20 mx-auto mb-3" />
                          <p className="text-lg font-bold">Position QR code here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="primary"
                  size="xl"
                  onClick={simulateQRScan}
                  disabled={isScanning}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white min-w-[240px]"
                >
                  <Camera className="w-6 h-6 mr-3" />
                  {isScanning ? 'Scanning...' : 'Start Camera Scan'}
                </Button>
              </div>

              {/* Manual Entry Section */}
              <div className="border-t border-gray-200 pt-12">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Or Enter Code Manually</h3>
                  <p className="text-lg text-gray-600">Type your invitation code if you can't scan the QR code</p>
                </div>
                
                <div className="max-w-lg mx-auto space-y-6">
                  <Input
                    value={manualCode}
                    onChange={(e) => {
                      setManualCode(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="Enter invitation code (e.g. INV123ABC)"
                    className="text-center text-xl font-mono"
                    error={error}
                  />
                  
                  <Button
                    variant="secondary"
                    size="xl"
                    onClick={handleManualSubmit}
                    className="w-full flex items-center justify-center space-x-3"
                  >
                    <KeySquare className="w-6 h-6" />
                    <span>Verify Code</span>
                  </Button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start space-x-4"
                >
                  <div className="bg-red-100 p-2 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-red-700">
                    <p className="font-bold text-lg">Invalid Code</p>
                    <p className="text-base">{error}</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          <div className="flex justify-center mt-12">
            <Button
              variant="secondary"
              size="xl"
              onClick={onBack}
              disabled={isScanning || !!scanResult}
            >
              Back to Options
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}