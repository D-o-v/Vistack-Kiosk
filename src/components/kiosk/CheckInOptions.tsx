import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, RotateCcw, QrCode, AlertTriangle, Calendar, UserCheck, Car as IdCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface CheckInOptionsProps {
  onOptionSelect: (option: string) => void;
}

export function CheckInOptions({ onOptionSelect }: CheckInOptionsProps) {
  const options = [
    {
      id: 'new-visitor',
      title: 'New Visitor',
      description: 'First time visiting? Register here',
      icon: UserPlus,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'returning-visitor',
      title: 'Returning Visitor',
      description: 'Quick check-in for previous visitors',
      icon: RotateCcw,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      id: 'invited-guest',
      title: 'Invited Guest',
      description: 'Check-in with invitation code or QR',
      icon: QrCode,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'appointment',
      title: 'Appointment',
      description: 'Check-in for scheduled appointments',
      icon: Calendar,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      id: 'employee',
      title: 'Employee',
      description: 'Staff check-in with employee ID',
      icon: IdCard,
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-700'
    },
    {
      id: 'check-out',
      title: 'Check Out',
      description: 'End your visit and check out',
      icon: UserCheck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Welcome to Vistacks
        </h1>
        <p className="text-2xl text-gray-600 font-medium">Please select how you'd like to check in today</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="cursor-pointer h-full group hover:scale-105 transition-all duration-300" onClick={() => onOptionSelect(option.id)}>
              <CardHeader className="text-center pb-6">
                <div className={`inline-flex p-6 rounded-3xl ${option.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className={`w-12 h-12 ${option.textColor}`} />
                </div>
                <CardTitle className={`text-2xl mb-3 ${option.textColor} font-bold`}>
                  {option.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">{option.description}</p>
                <Button
                  className={`w-full bg-gradient-to-r ${option.color} text-white hover:shadow-xl group-hover:scale-105 transition-all duration-300`}
                  size="xl"
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex justify-center"
      >
        <Button
          variant="danger"
          size="xl" 
          className="flex items-center space-x-4 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-12 py-6"
          onClick={() => onOptionSelect('emergency')}
        >
          <AlertTriangle className="w-10 h-10" />
          <span className="text-2xl font-bold">Emergency Contact</span>
        </Button>
      </motion.div>
    </div>
  );
}