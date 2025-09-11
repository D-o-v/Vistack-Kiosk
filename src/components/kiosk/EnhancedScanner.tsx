import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, Fingerprint, User, ArrowLeft, Check, AlertCircle, Scan } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { QRScanner } from '../scanner/QRScanner';
import { useAppDispatch } from '../../store/hooks';
import { qrCheckin } from '../../store/slices/checkinSlice';
import toast from 'react-hot-toast';

interface EnhancedScannerProps {
  onScanSuccess: (data: { type: 'qr' | 'face' | 'fingerprint'; value: string }) => void;
  onBack: () => void;
}

type ScanMode = 'qr' | 'face' | 'fingerprint';

export function EnhancedScanner({ onScanSuccess, onBack }: EnhancedScannerProps) {
  const dispatch = useAppDispatch();
  const [scanMode, setScanMode] = useState<ScanMode>('qr');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const processingRef = useRef(false);

  const handleQRScanResult = async (accessCode: string) => {
    // Prevent multiple simultaneous calls using ref
    if (processingRef.current) {
      console.log('QR processing already in progress, ignoring duplicate call');
      return;
    }
    
    processingRef.current = true;
    setShowQRScanner(false);
    setIsScanning(true);
    setScanResult(accessCode);
    setError('');
    
    try {
      const result = await dispatch(qrCheckin(accessCode));
      
      if (qrCheckin.fulfilled.match(result)) {
        toast.success('Check-in successful!');
        setTimeout(() => {
          onScanSuccess({ type: 'qr', value: accessCode });
          processingRef.current = false;
        }, 1500);
      } else {
        const errorMessage = result.payload as string;
        toast.error(errorMessage);
        setError(errorMessage);
        setIsScanning(false);
        setScanResult(null);
        processingRef.current = false;
      }
    } catch (error) {
      const errorMessage = 'Check-in failed';
      toast.error(errorMessage);
      setError(errorMessage);
      setIsScanning(false);
      setScanResult(null);
      processingRef.current = false;
    }
  };

  const startScan = (mode: ScanMode) => {
    setScanMode(mode);
    setError('');
    setScanResult(null);
    setIsScanning(false);

    if (mode === 'qr') {
      setShowQRScanner(true);
    } else {
      setIsScanning(true);
      // Simulate other scanning methods
      setTimeout(() => {
        let mockResult = '';
        
        switch (mode) {
          case 'face':
            mockResult = 'FACE_' + Math.random().toString(36).substring(2, 8).toUpperCase();
            break;
          case 'fingerprint':
            mockResult = 'FP_' + Math.random().toString(36).substring(2, 8).toUpperCase();
            break;
        }

        setScanResult(mockResult);
        setIsScanning(false);
        
        setTimeout(() => {
          onScanSuccess({ type: mode, value: mockResult });
        }, 1500);
      }, 3000);
    }
  };

  const stopScan = () => {
    setIsScanning(false);
    setScanResult(null);
    setShowQRScanner(false);
    setError('');
    processingRef.current = false;
  };

  const getScanModeConfig = (mode: ScanMode) => {
    switch (mode) {
      case 'qr':
        return {
          title: 'QR Code Scanner',
          description: 'Scan your access QR code',
          icon: QrCode,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600'
        };
      case 'face':
        return {
          title: 'Face Recognition',
          description: 'Look directly at the camera',
          icon: User,
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600'
        };
      case 'fingerprint':
        return {
          title: 'Fingerprint Scanner',
          description: 'Place finger on the scanner',
          icon: Fingerprint,
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600'
        };
    }
  };

  const currentConfig = getScanModeConfig(scanMode);

  return (
    <div className="min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <Card className="overflow-hidden">
          <CardHeader className={`bg-gradient-to-r ${currentConfig.color} text-white text-center`}>
            <CardTitle className="text-xl sm:text-2xl flex items-center justify-center space-x-2 sm:space-x-3">
              <Scan className="w-6 h-6 sm:w-8 sm:h-8" />
              <span>Multi-Scanner</span>
            </CardTitle>
            <p className="text-white/90 text-sm sm:text-base mt-2">
              Choose scanning method
            </p>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            {scanResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 sm:py-12"
              >
                <div className="bg-green-100 rounded-full p-4 sm:p-6 w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <Check className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Scan Successful!</h3>
                <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                  {scanMode.toUpperCase()} ID: <span className="font-mono font-bold">{scanResult}</span>
                </p>
                <div className="animate-pulse text-blue-600 text-sm sm:text-base font-medium">
                  Processing your scan...
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {!isScanning && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {(['qr', 'face', 'fingerprint'] as ScanMode[]).map((mode) => {
                      const config = getScanModeConfig(mode);
                      return (
                        <motion.div
                          key={mode}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-200 ${
                              scanMode === mode ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                            }`}
                            onClick={() => setScanMode(mode)}
                          >
                            <CardContent className="p-3 sm:p-4 text-center">
                              <div className={`${config.bgColor} rounded-full p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center`}>
                                <config.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${config.textColor}`} />
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{config.title}</h4>
                              <p className="text-xs sm:text-sm text-gray-600">{config.description}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                <div className="text-center">
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center relative overflow-hidden">
                      {isScanning ? (
                        <>
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                            <currentConfig.icon className="w-32 h-32 text-purple-400" />
                          </div>
                          
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className={`absolute inset-0 border-4 ${currentConfig.textColor.replace('text-', 'border-')} border-t-transparent rounded-2xl`}
                          />
                          
                          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                            Scanning {currentConfig.title.toLowerCase()}...
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-gray-500">
                          <currentConfig.icon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4" />
                          <p className="text-sm sm:text-base font-medium">{currentConfig.description}</p>
                          <p className="text-xs sm:text-sm mt-1 sm:mt-2">Click "Start Scan" to begin</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    {!isScanning ? (
                      <Button
                        onClick={() => startScan(scanMode)}
                        className={`bg-gradient-to-r ${currentConfig.color} text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base`}
                        size="lg"
                      >
                        <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Start {currentConfig.title}
                      </Button>
                    ) : (
                      <Button
                        onClick={stopScan}
                        variant="secondary"
                        size="lg"
                        className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
                      >
                        Stop Scanning
                      </Button>
                    )}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-red-700 font-medium">Scan Failed</p>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            <div className="flex justify-center mt-4 sm:mt-6">
              <Button
                onClick={onBack}
                variant="secondary"
                size="lg"
                className="flex items-center space-x-2"
                disabled={isScanning || !!scanResult}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Back to Home</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <QRScanner
        isActive={showQRScanner}
        onScan={handleQRScanResult}
        onClose={() => {
          setShowQRScanner(false);
          setScanResult(null);
          setIsScanning(false);
          setError('');
          processingRef.current = false;
        }}
      />
    </div>
  );
}