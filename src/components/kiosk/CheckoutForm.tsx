import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, ArrowLeft, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CheckoutFormProps {
  onSubmit: (identifier: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function CheckoutForm({ onSubmit, onBack, isLoading = false }: CheckoutFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!identifier.trim()) {
      setError('Please enter your access code, email, or name');
      return;
    }

    if (identifier.trim().length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }

    setError('');
    onSubmit(identifier.trim());
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
        className="w-full max-w-2xl"
      >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-center">
          <CardTitle className="text-2xl sm:text-3xl flex items-center justify-center space-x-3">
            <LogOut className="w-6 h-6 sm:w-8 sm:h-8" />
            <span>Check Out</span>
          </CardTitle>
          <p className="text-orange-100 text-sm sm:text-lg mt-2">
            Enter your details to complete checkout
          </p>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Code, Email, or Name
              </label>
              <Input
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter access code, email, or name"
                className="text-center text-lg sm:text-xl py-3 sm:py-4"
                error={error}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-orange-800 text-sm">
                  <p className="font-medium mb-1">Checkout Information</p>
                  <p>
                    We'll find your check-in record and complete your checkout process. 
                    Make sure to return any visitor badges or access cards.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onBack}
                variant="secondary"
                size="lg"
                className="flex items-center justify-center space-x-2 flex-1"
                disabled={isLoading}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Button>
              
              <Button
                onClick={handleSubmit}
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white flex items-center justify-center space-x-2 flex-1"
                disabled={isLoading || !identifier.trim()}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>{isLoading ? 'Processing...' : 'Find & Check Out'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}