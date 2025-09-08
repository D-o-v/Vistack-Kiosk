import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowLeft, Search, AlertCircle } from 'lucide-react';

interface EmailNameInputProps {
  onSubmit: (emailOrPhone: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function EmailNameInput({ onSubmit, onBack, isLoading = false }: EmailNameInputProps) {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');

  const isEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  };

  const isPhone = (str: string) => {
    return /^[\+]?[\d\s\-\(\)]{10,}$/.test(str.replace(/\s/g, ''));
  };

  const handleSubmit = () => {
    if (!input.trim()) {
      setError('Please enter your email or phone number');
      return;
    }

    if (inputType === 'email' && !isEmail(input)) {
      setError('Please enter a valid email address');
      return;
    }

    if (inputType === 'phone' && !isPhone(input)) {
      setError('Please enter a valid phone number');
      return;
    }

    setError('');
    onSubmit(input.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setError('');
    
    // Auto-detect if it's an email or phone
    if (value.includes('@')) {
      setInputType('email');
    } else if (/[\d\+\-\(\)\s]/.test(value)) {
      setInputType('phone');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-5">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {inputType === 'email' ? (
                <Mail className="w-6 h-6" />
              ) : (
                <Phone className="w-6 h-6" />
              )}
              <h1 className="text-xl font-bold">Enter Your Details</h1>
            </div>
            <p className="text-blue-100 text-sm">Enter email or phone number to continue</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-5">
              <div>
                <input
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email or phone number"
                  className="w-full px-4 py-4 text-center text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={isLoading}
                  autoFocus
                />
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                

              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> Returning visitors will see their profile. New visitors will register.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onBack}
                  disabled={isLoading}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>{isLoading ? 'Searching...' : 'Continue'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}