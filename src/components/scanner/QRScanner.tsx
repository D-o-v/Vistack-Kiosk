import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Zap, CheckCircle } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isActive: boolean;
}

export function QRScanner({ onScan, onClose, isActive }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const lastScanTime = useRef<number>(0);

  useEffect(() => {
    if (isActive && videoRef.current) {
      // Reset state when scanner becomes active
      setScannedCode(null);
      setError(null);
      setIsProcessing(false);
      startScanning();
    }
    return () => {
      stopScanning();
    };
  }, [isActive]);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      codeReader.current = new BrowserMultiFormatReader();
      
      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        throw new Error('No camera devices found');
      }

      const backCamera = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      ) || videoInputDevices[0];

      await codeReader.current.decodeFromVideoDevice(
        backCamera.deviceId,
        videoRef.current!,
        (result, error) => {
          if (result && !isProcessing && !scannedCode) {
            const now = Date.now();
            // Debounce: prevent scans within 2 seconds of each other
            if (now - lastScanTime.current < 2000) {
              return;
            }
            
            const code = result.getText();
            lastScanTime.current = now;
            setIsProcessing(true);
            setScannedCode(code);
            
            // Stop scanning immediately to prevent more reads
            if (codeReader.current) {
              codeReader.current.reset();
            }
            
            setTimeout(() => {
              onScan(code);
              stopScanning();
            }, 1000);
          }
          if (error && error.name !== 'NotFoundException') {
            console.error('QR Scanner error:', error);
          }
        }
      );
    } catch (err: any) {
      console.error('Failed to start camera:', err);
      setError(err.message || 'Failed to access camera');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current = null;
    }
    setIsScanning(false);
    setScannedCode(null);
    setError(null);
    setIsProcessing(false);
    lastScanTime.current = 0;
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Camera className="w-6 h-6" />
              <h2 className="text-lg font-bold">QR Code Scanner</h2>
            </div>
            <p className="text-blue-100 text-sm">
              {scannedCode ? 'Code detected!' : 'Position QR code within the frame'}
            </p>
          </div>

          <div className="relative aspect-square bg-gray-900">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                  
                  {isScanning && !scannedCode && (
                    <motion.div
                      animate={{ y: [0, 240, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                    />
                  )}
                </div>

                {scannedCode && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-green-500 rounded-full p-4">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="absolute top-4 left-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                scannedCode ? 'bg-green-500 text-white' :
                isScanning ? 'bg-blue-500 text-white' : 
                'bg-red-500 text-white'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  scannedCode ? 'bg-white' :
                  isScanning ? 'bg-white animate-pulse' : 
                  'bg-white'
                }`} />
                <span>
                  {scannedCode ? 'Scanned!' :
                   isScanning ? 'Scanning...' : 
                   'Camera Error'}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-t border-red-200">
              <p className="text-red-600 text-sm text-center">{error}</p>
              <button
                onClick={startScanning}
                className="mt-2 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!error && !scannedCode && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm">
                <Zap className="w-4 h-4" />
                <span>Hold steady and ensure good lighting</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}