import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeySquare, UserPlus, LogOut, Scan, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface EnhancedKioskHomeProps {
  onOptionSelect: (option: string) => void;
}

export function EnhancedKioskHome({ onOptionSelect }: EnhancedKioskHomeProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleCardSelect = (option: string) => {
    setSelectedOption(option);
    setTimeout(() => {
      onOptionSelect(option);
      setSelectedOption(null);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-3 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
          Welcome to Vistacks
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
          Choose your preferred option
        </p>
      </motion.div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-5xl mb-4 sm:mb-6">
        {/* Check-in with Access Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card 
            className={`cursor-pointer h-full transition-all duration-200 hover:shadow-lg ${
              selectedOption === 'access-code' ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
            onClick={() => handleCardSelect('access-code')}
          >
            <CardContent className="p-4 sm:p-5 text-center">
              <div className="bg-blue-100 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <KeySquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-blue-700 mb-2">
                Check-in with Access Code
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Quick check-in for returning visitors
              </p>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm py-2"
                size="sm"
              >
                Enter Code
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Check-in without Access Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card 
            className={`cursor-pointer h-full transition-all duration-200 hover:shadow-lg ${
              selectedOption === 'no-access-code' ? 'ring-2 ring-green-500 shadow-lg' : ''
            }`}
            onClick={() => handleCardSelect('no-access-code')}
          >
            <CardContent className="p-4 sm:p-5 text-center">
              <div className="bg-green-100 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-green-700 mb-2">
                New Visitor Check-in
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Register or find your profile
              </p>
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-sm py-2"
                size="sm"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Check-out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card 
            className={`cursor-pointer h-full transition-all duration-200 hover:shadow-lg ${
              selectedOption === 'checkout' ? 'ring-2 ring-orange-500 shadow-lg' : ''
            }`}
            onClick={() => handleCardSelect('checkout')}
          >
            <CardContent className="p-4 sm:p-5 text-center">
              <div className="bg-orange-100 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <LogOut className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-orange-700 mb-2">
                Check-out
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                End your visit and sign out
              </p>
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm py-2"
                size="sm"
              >
                Check Out
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Scanner Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Button
            onClick={() => handleCardSelect('scanner')}
            className={`bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg transition-all duration-200 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base ${
              selectedOption === 'scanner' ? 'scale-95' : 'hover:scale-105'
            }`}
          >
            <Scan className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="font-medium">Quick Scan</span>
          </Button>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Button
            variant="danger"
            className="flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            onClick={() => onOptionSelect('emergency')}
          >
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">Emergency</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}