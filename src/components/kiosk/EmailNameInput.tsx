import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface EmailNameInputProps {
  onSubmit: (emailOrName: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function EmailNameInput({ onSubmit, onBack, isLoading = false }: EmailNameInputProps) {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'email' | 'name'>('email');
  const [error, setError] = useState('');

  const isEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  };

  const handleSubmit = () => {
    if (!input.trim()) {
      setError('Please enter your email or name');
      return;
    }

    if (inputType === 'email' && !isEmail(input)) {
      setError('Please enter a valid email address');
      return;
    }

    if (inputType === 'name' && input.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    setError('');
    onSubmit(input.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setError('');
    
    // Auto-detect if it's an email or name
    if (value.includes('@')) {
      setInputType('email');
    } else if (value.trim().length > 0) {
      setInputType('name');
    }
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
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
          <CardTitle className="text-xl sm:text-2xl flex items-center justify-center space-x-2 sm:space-x-3">
            {inputType === 'email' ? (
              <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
            ) : (
              <User className="w-6 h-6 sm:w-8 sm:h-8" />
            )}
            <span>Enter Your Details</span>
          </CardTitle>
          <p className="text-green-100 text-sm sm:text-base mt-2">
            Enter email or name to continue
          </p>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Input
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email or full name"
                className="text-center text-lg sm:text-xl py-3 sm:py-4"
                error={error}
                disabled={isLoading}
                autoFocus
              />
              
              {input && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-center"
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    {inputType === 'email' ? (
                      <>
                        <Mail className="w-4 h-4 mr-1" />
                        Email detected
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 mr-1" />
                        Name detected
                      </>
                    )}
                  </span>
                </motion.div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <p className="text-blue-800 text-xs sm:text-sm">
                <strong>Note:</strong> Returning visitors will see their profile. New visitors will register.
              </p>
            </div>

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
                className="bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center space-x-2 flex-1"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
                ) : (
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span>{isLoading ? 'Searching...' : 'Continue'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}