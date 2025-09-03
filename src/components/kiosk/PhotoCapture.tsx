import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCcw, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { motion } from 'framer-motion';

interface PhotoCaptureProps {
  onPhotoCapture: (photo: string) => void;
  onSkip?: () => void;
}

export function PhotoCapture({ onPhotoCapture, onSkip }: PhotoCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const capture = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
      setIsLoading(false);
    }, 300);
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const confirm = () => {
    if (capturedImage) {
      onPhotoCapture(capturedImage);
    }
  };

  const videoConstraints = {
    width: 480,
    height: 360,
    facingMode: "user"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Visitor Photo</h2>
            <p className="text-lg text-gray-600">
              {capturedImage ? 'Is this photo acceptable?' : 'Please position yourself in the camera frame'}
            </p>
          </div>

          <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-8">
            {capturedImage ? (
              <div className="relative">
                <img src={capturedImage} alt="Captured" className="w-full h-auto" />
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <div className="bg-green-500 text-white p-3 rounded-full">
                    <Check className="w-8 h-8" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 border-4 border-dashed border-blue-300 m-4 rounded-xl pointer-events-none" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {capturedImage ? (
              <>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={retake}
                  className="flex items-center space-x-2 min-w-[160px]"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Retake Photo</span>
                </Button>
                <Button
                  variant="success"
                  size="lg"
                  onClick={confirm}
                  className="flex items-center space-x-2 min-w-[160px]"
                >
                  <Check className="w-5 h-5" />
                  <span>Use This Photo</span>
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="xl"
                onClick={capture}
                disabled={isLoading}
                className="flex items-center space-x-3 min-w-[200px]"
              >
                <Camera className="w-6 h-6" />
                <span>{isLoading ? 'Capturing...' : 'Take Photo'}</span>
              </Button>
            )}
          </div>

          {onSkip && (
            <div className="text-center mt-6">
              <button
                onClick={onSkip}
                className="text-gray-500 hover:text-gray-700 text-lg underline"
              >
                Skip photo (continue without photo)
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}