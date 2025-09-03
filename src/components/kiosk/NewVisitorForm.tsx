import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, FileText, Users, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const visitorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  company: z.string().optional(),
  purpose: z.enum(['business', 'interview', 'delivery', 'contractor', 'personal', 'other']),
  hostName: z.string().min(2, 'Host name is required'),
  hostDepartment: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional()
});

type VisitorFormData = z.infer<typeof visitorSchema>;

interface NewVisitorFormProps {
  onSubmit: (data: VisitorFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function NewVisitorForm({ onSubmit, onBack, isLoading }: NewVisitorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<VisitorFormData>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      purpose: 'business'
    }
  });

  const purposeOptions = [
    { value: 'business', label: 'Business Meeting' },
    { value: 'interview', label: 'Job Interview' },
    { value: 'delivery', label: 'Delivery/Pickup' },
    { value: 'contractor', label: 'Contractor Work' },
    { value: 'personal', label: 'Personal Visit' },
    { value: 'other', label: 'Other' }
  ];

  const hostSuggestions = [
    'John Smith - HR Department',
    'Sarah Johnson - Engineering',
    'Mike Davis - Sales',
    'Lisa Chen - Marketing',
    'David Brown - Operations'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-6"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle className="text-4xl text-center flex items-center justify-center space-x-4">
            <User className="w-10 h-10" />
            <span>New Visitor Registration</span>
          </CardTitle>
          <p className="text-xl text-center text-blue-100 mt-3">
            Please fill in your information to complete check-in
          </p>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Input
                  {...register('name')}
                  label="Full Name *"
                  placeholder="Enter your full name"
                  error={errors.name?.message}
                  className="text-lg"
                />
              </div>
              <div>
                <Input
                  {...register('email')}
                  type="email"
                  label="Email Address"
                  placeholder="your.email@company.com"
                  error={errors.email?.message}
                  className="text-lg"
                />
              </div>
              <div>
                <Input
                  {...register('phone')}
                  type="tel"
                  label="Phone Number"
                  placeholder="(555) 123-4567"
                  error={errors.phone?.message}
                  className="text-lg"
                />
              </div>
              <div>
                <Input
                  {...register('company')}
                  label="Company"
                  placeholder="Your company name"
                  className="text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Select
                  {...register('purpose')}
                  label="Purpose of Visit *"
                  options={purposeOptions}
                  error={errors.purpose?.message}
                />
              </div>
              <div>
                <Input
                  {...register('hostName')}
                  label="Host Name *"
                  placeholder="Person you're visiting"
                  error={errors.hostName?.message}
                  className="text-lg"
                />
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-600 mb-3">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-3">
                    {hostSuggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl transition-colors font-medium"
                        onClick={() => {
                          const form = document.querySelector('input[name="hostName"]') as HTMLInputElement;
                          if (form) form.value = suggestion;
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Input
                  {...register('hostDepartment')}
                  label="Host Department"
                  placeholder="e.g., Engineering, Sales"
                  className="text-lg"
                />
              </div>
              <div>
                <Input
                  {...register('emergencyContact')}
                  label="Emergency Contact"
                  placeholder="Emergency contact number"
                  className="text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-6 py-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                placeholder="Any special instructions or notes..."
              />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-blue-800">
                  <p className="font-bold mb-2 text-lg">Privacy Notice</p>
                  <p className="text-base leading-relaxed">Your information will be used solely for visitor management and security purposes. Photos and data will be automatically deleted after 90 days.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <Button
                type="button"
                variant="secondary"
                size="xl"
                onClick={onBack}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="xl"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Processing...' : 'Complete Check-In'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}