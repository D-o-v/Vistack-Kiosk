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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-8"
    >
      <Card>
        <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardTitle className="text-4xl text-center flex items-center justify-center space-x-3">
            <AlertTriangle className="w-10 h-10" />
            <span>Emergency Contacts</span>
          </CardTitle>
          <p className="text-xl text-center text-red-100 mt-2">
            Select the appropriate contact for immediate assistance
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {emergencyContacts.map((contact, index) => {
              const Icon = getContactIcon(contact.type);
              const colorClass = getContactColor(contact.type);
              
              return (
                <motion.div
                  key={contact.type}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer h-full" onClick={() => handleCall(contact)}>
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${colorClass} text-white mb-4`}>
                        <Icon className="w-12 h-12" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {contact.label}
                      </h3>
                      <p className="text-3xl font-bold text-gray-900 mb-3">
                        {contact.number}
                      </p>
                      <p className="text-sm text-gray-600 mb-6">
                        {contact.description}
                      </p>
                      <Button
                        className={`w-full bg-gradient-to-r ${colorClass} text-white hover:shadow-lg`}
                        size="lg"
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Call Now
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
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h4 className="text-lg font-semibold text-yellow-800">Important Notice</h4>
              </div>
              <p className="text-yellow-700">
                For life-threatening emergencies, always call 911 first. 
                Building security and reception are for non-emergency assistance only.
              </p>
            </div>
            
            <Button
              variant="secondary"
              size="xl"
              onClick={onBack}
              className="flex items-center space-x-3"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Back to Main Screen</span>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}