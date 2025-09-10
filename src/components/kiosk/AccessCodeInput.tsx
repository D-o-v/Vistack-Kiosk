import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeySquare, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AccessCodeInputProps {
  onSubmit: (code: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
}

export function AccessCodeInput({ onSubmit, onBack, isLoading = false, error: externalError = '' }: AccessCodeInputProps) {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  
  const displayError = externalError || error;

  const handleSubmit = () => {
    if (!accessCode.trim()) {
      setError('Please enter your access code');
      return;
    }

    if (accessCode.length < 4) {
      setError('Access code must be at least 4 characters');
      return;
    }

    setError('');
    onSubmit(accessCode.toUpperCase());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center">
          <CardTitle className="text-xl sm:text-2xl flex items-center justify-center space-x-2 sm:space-x-3">
            <KeySquare className="w-6 h-6 sm:w-8 sm:h-8" />
            <span>Enter Access Code</span>
          </CardTitle>
          <p className="text-blue-100 text-sm sm:text-base mt-2">
            Enter your code to check in
          </p>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Input
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter your access code"
                className="text-center text-lg sm:text-xl font-mono tracking-wider py-3 sm:py-4"
                error={displayError}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{displayError}</p>
              </motion.div>
            )}

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
                onClick={handleSubmit}
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center space-x-2 flex-1"
                disabled={isLoading || !accessCode.trim()}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
                ) : (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span>{isLoading ? 'Verifying...' : 'Check In'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}