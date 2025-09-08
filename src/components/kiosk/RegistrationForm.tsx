import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, User, Building, Phone, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface RegistrationData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  purpose: string;
  hostName?: string;
}

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => void;
  onBack: () => void;
  isLoading?: boolean;
  initialEmail?: string;
  initialName?: string;
}

export function RegistrationForm({ 
  onSubmit, 
  onBack, 
  isLoading = false, 
  initialEmail = '', 
  initialName = '' 
}: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    name: initialName,
    email: initialEmail,
    phone: '',
    company: '',
    purpose: '',
    hostName: ''
  });
  const [errors, setErrors] = useState<Partial<RegistrationData>>({});

  const purposeOptions = [
    { value: 'business', label: 'Business Meeting' },
    { value: 'interview', label: 'Job Interview' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'contractor', label: 'Contractor/Service' },
    { value: 'personal', label: 'Personal Visit' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Please select a purpose for your visit';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white text-center">
          <CardTitle className="text-xl sm:text-2xl flex items-center justify-center space-x-2 sm:space-x-3">
            <UserPlus className="w-6 h-6 sm:w-8 sm:h-8" />
            <span>New Visitor Registration</span>
          </CardTitle>
          <p className="text-green-100 text-sm sm:text-base mt-2">
            Fill in your details below
          </p>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-5">
            {/* Required Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Full Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  error={errors.name}
                  disabled={isLoading}
                  className="text-sm sm:text-base py-2 sm:py-3"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  error={errors.email}
                  disabled={isLoading}
                  className="text-sm sm:text-base py-2 sm:py-3"
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  error={errors.phone}
                  disabled={isLoading}
                  className="text-sm sm:text-base py-2 sm:py-3"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Company/Organization
                </label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Enter your company name"
                  disabled={isLoading}
                  className="text-sm sm:text-base py-2 sm:py-3"
                />
              </div>
            </div>

            {/* Purpose and Host */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Purpose of Visit *
                </label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) => handleInputChange('purpose', value)}
                  placeholder="Select purpose of visit"
                  options={purposeOptions}
                  error={errors.purpose}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Person to Meet
                </label>
                <Input
                  value={formData.hostName}
                  onChange={(e) => handleInputChange('hostName', e.target.value)}
                  placeholder="Enter host name (optional)"
                  disabled={isLoading}
                  className="text-sm sm:text-base py-2 sm:py-3"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-blue-800 text-xs sm:text-sm">
                  <p className="font-medium mb-1">Registration Info</p>
                  <p>
                    You'll receive an access code for future visits. Information is securely stored.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
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
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white flex items-center justify-center space-x-2 flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
                ) : (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span>{isLoading ? 'Registering...' : 'Complete Registration'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}