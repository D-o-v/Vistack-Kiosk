import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Car as IdCard, User, Mail, Building, Search, Check, AlertCircle, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const employeeSchema = z.object({
  employeeId: z.string().min(3, 'Employee ID must be at least 3 characters'),
  employeeName: z.string().min(2, 'Name is required'),
  employeeEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  department: z.string().optional()
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function EmployeeForm({ onSubmit, onBack, isLoading }: EmployeeFormProps) {
  const [foundEmployee, setFoundEmployee] = useState<any>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema)
  });

  const employeeId = watch('employeeId');

  const handleEmployeeLookup = () => {
    if (!employeeId || employeeId.length < 3) return;

    setIsLookingUp(true);
    
    // Simulate employee lookup
    setTimeout(() => {
      const mockEmployee = {
        employeeId: employeeId.toUpperCase(),
        name: 'Sarah Johnson',
        email: 'sarah.johnson@vistacks.com',
        department: 'Engineering',
        position: 'Senior Software Engineer',
        accessLevel: 'Standard',
        isActive: true
      };

      setFoundEmployee(mockEmployee);
      setValue('employeeName', mockEmployee.name);
      setValue('employeeEmail', mockEmployee.email);
      setValue('department', mockEmployee.department);
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
        <CardHeader className="bg-gradient-to-r from-slate-500 to-slate-600 text-white">
          <CardTitle className="text-4xl text-center flex items-center justify-center space-x-4">
            <IdCard className="w-10 h-10" />
            <span>Employee Check-In</span>
          </CardTitle>
          <p className="text-xl text-center text-slate-100 mt-3">
            Enter your employee ID to check in
          </p>
        </CardHeader>
        <CardContent className="p-10">
          <div className="space-y-10">
            {/* Employee ID Lookup */}
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Employee Verification
              </h3>
              <div className="flex space-x-4 mb-8">
                <Input
                  {...register('employeeId')}
                  label="Employee ID"
                  placeholder="Enter your employee ID (e.g., EMP001)"
                  className="flex-1 font-mono text-center text-xl"
                  error={errors.employeeId?.message}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setValue('employeeId', value);
                  }}
                />
                <div className="flex items-end">
                  <Button
                    variant="primary"
                    onClick={handleEmployeeLookup}
                    disabled={isLookingUp || !employeeId || employeeId.length < 3}
                    className="flex items-center space-x-2 min-w-[140px] h-12"
                  >
                    <Search className="w-5 h-5" />
                    <span>{isLookingUp ? 'Verifying...' : 'Verify'}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Employee Details */}
            {foundEmployee && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-2xl p-8"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-green-100 rounded-full p-3">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                  Employee Verified!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <User className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Name</p>
                        <p className="text-xl font-bold text-gray-900">{foundEmployee.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <Building className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Department</p>
                        <p className="text-xl font-bold text-gray-900">{foundEmployee.department}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <Mail className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="text-lg font-semibold text-gray-900">{foundEmployee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <Shield className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Access Level</p>
                        <p className="text-xl font-bold text-gray-900">{foundEmployee.accessLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Employee Information Form */}
            {foundEmployee && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                      Confirm Check-In Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        {...register('employeeName')}
                        label="Full Name"
                        placeholder="Enter your full name"
                        error={errors.employeeName?.message}
                        className="text-lg"
                        readOnly
                      />
                      <Input
                        {...register('employeeEmail')}
                        type="email"
                        label="Email Address"
                        placeholder="your.email@company.com"
                        error={errors.employeeEmail?.message}
                        className="text-lg"
                        readOnly
                      />
                      <Input
                        {...register('department')}
                        label="Department"
                        placeholder="Your department"
                        className="text-lg"
                        readOnly
                      />
                    </div>
                  </div>

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
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600"
                    >
                      {isLoading ? 'Processing...' : 'Check In'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* No employee found */}
            {employeeId && employeeId.length >= 3 && !foundEmployee && !isLookingUp && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
              >
                <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-3">Employee Not Found</h3>
                <p className="text-red-700 mb-6">
                  No employee found with ID "{employeeId}". Please check your ID and try again.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setValue('employeeId', '');
                    setFoundEmployee(null);
                  }}
                >
                  Try Different ID
                </Button>
              </motion.div>
            )}

            {!foundEmployee && (
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