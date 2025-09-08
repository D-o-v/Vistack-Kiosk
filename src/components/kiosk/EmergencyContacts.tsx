import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, AlertTriangle, Users, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { EmergencyContact } from '../../types';

interface EmergencyContactsProps {
  onBack: () => void;
}

export function EmergencyContacts({ onBack }: EmergencyContactsProps) {
  const emergencyContacts: EmergencyContact[] = [
    {
      type: 'emergency',
      number: '911',
      label: 'Emergency Services',
      description: 'Life-threatening emergencies, fire, medical emergencies'
    },
    {
      type: 'security',
      number: '(555) 911-HELP',
      label: 'Building Security',
      description: 'Security concerns, suspicious activity, access issues'
    },
    {
      type: 'reception',
      number: '(555) 123-0001',
      label: 'Reception Desk',
      description: 'General assistance, visitor questions, host contact'
    }
  ];

  const handleCall = (contact: EmergencyContact) => {
    // In a real implementation, this would initiate a call through the kiosk system
    window.open(`tel:${contact.number}`, '_self');
  };

  const getContactIcon = (type: EmergencyContact['type']) => {
    switch (type) {
      case 'emergency':
        return AlertTriangle;
      case 'security':
        return Shield;
      case 'reception':
        return Users;
      default:
        return Phone;
    }
  };

  const getContactColor = (type: EmergencyContact['type']) => {
    switch (type) {
      case 'emergency':
        return 'from-red-500 to-red-600';
      case 'security':
        return 'from-orange-500 to-orange-600';
      case 'reception':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl"
      >
        <Card className="max-w-4xl">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-4">
            <CardTitle className="text-lg sm:text-xl flex items-center justify-center space-x-2">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Emergency Contacts</span>
            </CardTitle>
            <p className="text-xs sm:text-sm text-red-100 mt-1">
              Select the appropriate contact
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {emergencyContacts.map((contact, index) => {
                const Icon = getContactIcon(contact.type);
                const colorClass = getContactColor(contact.type);
                
                return (
                  <motion.div
                    key={contact.type}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCall(contact)}>
                      <CardContent className="p-3 text-center">
                        <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${colorClass} text-white mb-2`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">
                          {contact.label}
                        </h3>
                        <p className="text-base font-bold text-gray-900 mb-1">
                          {contact.number}
                        </p>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {contact.description}
                        </p>
                        <Button
                          className={`w-full bg-gradient-to-r ${colorClass} text-white text-xs py-2`}
                          size="sm"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-3"
            >
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-700">
                  <span className="font-medium">Important:</span> For life-threatening emergencies, always call 911 first.
                </p>
              </div>
              
              <Button
                variant="secondary"
                size="md"
                onClick={onBack}
                className="flex items-center space-x-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}