import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CreditCard, Search, Check, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const appointmentSchema = z.object({
  appointmentCode: z.string().min(6, 'Appointment code must be at least 6 characters'),
  visitorName: z.string().min(2, 'Name is required'),
  visitorEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  visitorPhone: z.string().optional()
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function AppointmentForm({ onSubmit, onBack, isLoading }: AppointmentFormProps) {
  const [foundAppointment, setFoundAppointment] = useState<any>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema)
  });

  const appointmentCode = watch('appointmentCode');

  const handleAppointmentLookup = () => {
    if (!appointmentCode || appointmentCode.length < 6) return;

    setIsLookingUp(true);
    
    // Simulate appointment lookup
    setTimeout(() => {
      const mockAppointment = {
        appointmentCode: appointmentCode.toUpperCase(),
        hostName: 'Dr. Sarah Johnson',
        appointmentType: 'Consultation',
        date: new Date(),
        time: '2:30 PM',
        duration: 60,
        price: 150,
        isPaid: true,
        visitorInfo: {
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '(555) 123-4567'
        }
      };

      setFoundAppointment(mockAppointment);
      setValue('visitorName', mockAppointment.visitorInfo.name);
      setValue('visitorEmail', mockAppointment.visitorInfo.email);
      setValue('visitorPhone', mockAppointment.visitorInfo.phone);
      setIsLookingUp(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-6"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardTitle className="text-4xl text-center flex items-center justify-center space-x-4">
            <Calendar className="w-10 h-10" />
            <span>Appointment Check-In</span>
          </CardTitle>
          <p className="text-xl text-center text-indigo-100 mt-3">
            Enter your appointment code to check in
          </p>
        </CardHeader>
        <CardContent className="p-10">
          <div className="space-y-10">
            {/* Appointment Code Lookup */}
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Find Your Appointment
              </h3>
              <div className="flex space-x-4 mb-8">
                <Input
                  {...register('appointmentCode')}
                  label="Appointment Code"
                  placeholder="Enter code (e.g., APT123ABC)"
                  className="flex-1 font-mono text-center text-xl"
                  error={errors.appointmentCode?.message}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setValue('appointmentCode', value);
                  }}
                />
                <div className="flex items-end">
                  <Button
                    variant="primary"
                    onClick={handleAppointmentLookup}
                    disabled={isLookingUp || !appointmentCode || appointmentCode.length < 6}
                    className="flex items-center space-x-2 min-w-[140px] h-12"
                  >
                    <Search className="w-5 h-5" />
                    <span>{isLookingUp ? 'Looking up...' : 'Find'}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            {foundAppointment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-8"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-green-100 rounded-full p-3">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-indigo-900 mb-6 text-center">
                  Appointment Found!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-3 rounded-xl">
                        <User className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Host</p>
                        <p className="text-xl font-bold text-gray-900">{foundAppointment.hostName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-3 rounded-xl">
                        <Calendar className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Date & Time</p>
                        <p className="text-xl font-bold text-gray-900">
                          Today at {foundAppointment.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-3 rounded-xl">
                        <Clock className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Duration</p>
                        <p className="text-xl font-bold text-gray-900">{foundAppointment.duration} minutes</p>
                      </div>
                    </div>
                    {foundAppointment.price && (
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 p-3 rounded-xl">
                          <CreditCard className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Fee</p>
                          <p className="text-xl font-bold text-gray-900">
                            ${foundAppointment.price}
                            <span className={`ml-3 text-sm px-3 py-1 rounded-full ${foundAppointment.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {foundAppointment.isPaid ? 'Paid' : 'Payment Required'}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Visitor Information Form */}
            {foundAppointment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                      Confirm Your Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        {...register('visitorName')}
                        label="Full Name"
                        placeholder="Enter your full name"
                        error={errors.visitorName?.message}
                        className="text-lg"
                      />
                      <Input
                        {...register('visitorEmail')}
                        type="email"
                        label="Email Address"
                        placeholder="your.email@company.com"
                        error={errors.visitorEmail?.message}
                        className="text-lg"
                      />
                      <Input
                        {...register('visitorPhone')}
                        type="tel"
                        label="Phone Number"
                        placeholder="(555) 123-4567"
                        className="text-lg"
                      />
                    </div>
                  </div>

                  {/* Payment Section */}
                  {foundAppointment.price && !foundAppointment.isPaid && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8">
                      <div className="flex items-center justify-center space-x-4 mb-6">
                        <div className="bg-yellow-100 p-3 rounded-xl">
                          <CreditCard className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h4 className="text-2xl font-bold text-yellow-800">Payment Required</h4>
                      </div>
                      <p className="text-yellow-700 mb-6 text-center text-lg">
                        This appointment requires payment of ${foundAppointment.price} before check-in can be completed.
                      </p>
                      <Button
                        type="button"
                        variant="warning"
                        size="xl"
                        className="w-full max-w-md mx-auto block"
                      >
                        Pay ${foundAppointment.price} Now
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-6 pt-6 max-w-2xl mx-auto">
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
                      disabled={isLoading || (foundAppointment.price && !foundAppointment.isPaid)}
                      className="flex-1"
                    >
                      {isLoading ? 'Processing...' : 'Check In'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* No appointment found */}
            {appointmentCode && appointmentCode.length >= 6 && !foundAppointment && !isLookingUp && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
              >
                <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-3">Appointment Not Found</h3>
                <p className="text-red-700 mb-6">
                  No appointment found with code "{appointmentCode}". Please check your code and try again.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setValue('appointmentCode', '');
                    setFoundAppointment(null);
                  }}
                >
                  Try Different Code
                </Button>
              </motion.div>
            )}

            {!foundAppointment && (
              <div className="text-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onBack}
                >
                  Back to Options
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}