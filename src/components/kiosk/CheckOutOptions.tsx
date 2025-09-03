import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Search, QrCode, Camera, CreditCard, UserCheck, Smartphone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CheckOutOptionsProps {
  onCheckOut: (method: string, data?: any) => void;
  onBack: () => void;
}

export function CheckOutOptions({ onCheckOut, onBack }: CheckOutOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const checkOutMethods = [
    {
      id: 'visitor-lookup',
      title: 'Visitor Lookup',
      description: 'Search by name, email, or phone',
      icon: Search,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'qr-scan',
      title: 'Scan Badge',
      description: 'Scan your visitor badge QR code',
      icon: QrCode,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'face-scan',
      title: 'Face Scan',
      description: 'Quick checkout with facial recognition',
      icon: Camera,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      id: 'appointment',
      title: 'Appointment',
      description: 'Check out from scheduled appointment',
      icon: UserCheck,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      id: 'employee-id',
      title: 'Employee ID',
      description: 'Staff checkout with employee ID',
      icon: CreditCard,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700'
    },
    {
      id: 'mobile-app',
      title: 'Mobile App',
      description: 'Checkout via mobile application',
      icon: Smartphone,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    
    if (methodId === 'visitor-lookup') {
      // Show search interface
      return;
    }
    
    onCheckOut(methodId);
  };

  const handleVisitorSearch = () => {
    if (!searchQuery.trim()) return;
    onCheckOut('visitor-lookup', { searchQuery });
  };

  if (selectedMethod === 'visitor-lookup') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-3xl mx-auto px-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center flex items-center justify-center space-x-3">
              <Search className="w-8 h-8 text-blue-600" />
              <span>Find Your Visit</span>
            </CardTitle>
            <p className="text-center text-lg text-gray-600 mt-2">
              Enter your name, email, or phone number to check out
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex space-x-4">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your name, email, or phone"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleVisitorSearch()}
                />
                <Button
                  variant="primary"
                  onClick={handleVisitorSearch}
                  disabled={!searchQuery.trim()}
                  className="flex items-center space-x-2 min-w-[120px]"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </Button>
              </div>
              
              <div className="text-center">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedMethod(null)}
                >
                  Back to Checkout Options
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-8"
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Check Out</h1>
        <p className="text-xl text-gray-600">How would you like to check out today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {checkOutMethods.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="cursor-pointer h-full" onClick={() => handleMethodSelect(method.id)}>
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex p-4 rounded-2xl ${method.bgColor} mb-4`}>
                  <method.icon className={`w-10 h-10 ${method.textColor}`} />
                </div>
                <CardTitle className={`text-2xl mb-2 ${method.textColor}`}>
                  {method.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">{method.description}</p>
                <Button
                  className={`w-full bg-gradient-to-r ${method.color} text-white hover:shadow-lg`}
                  size="lg"
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="secondary"
          size="lg"
          onClick={onBack}
        >
          Back to Main Menu
        </Button>
      </div>
    </motion.div>
  );
}