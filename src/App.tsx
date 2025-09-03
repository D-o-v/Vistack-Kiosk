import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBar } from './components/kiosk/StatusBar';
import { CheckInOptions } from './components/kiosk/CheckInOptions';
import { NewVisitorForm } from './components/kiosk/NewVisitorForm';
import { ReturningVisitorForm } from './components/kiosk/ReturningVisitorForm';
import { QRScanner } from './components/kiosk/QRScanner';
import { PhotoCapture } from './components/kiosk/PhotoCapture';
import { CheckInConfirmation } from './components/kiosk/CheckInConfirmation';
import { EmergencyContacts } from './components/kiosk/EmergencyContacts';
import { AppointmentForm } from './components/kiosk/AppointmentForm';
import { EmployeeForm } from './components/kiosk/EmployeeForm';
import { generateBadgeNumber } from './lib/utils';
import { Visitor } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

type KioskStep = 
  | 'home'
  | 'new-visitor-form' 
  | 'new-visitor-photo'
  | 'returning-visitor'
  | 'invited-guest'
  | 'appointment'
  | 'employee'
  | 'check-out'
  | 'confirmation'
  | 'emergency';

function KioskApp() {
  const [currentStep, setCurrentStep] = useState<KioskStep>('home');
  const [visitorData, setVisitorData] = useState<Partial<Visitor>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionSelect = (option: string) => {
    switch (option) {
      case 'new-visitor':
        setCurrentStep('new-visitor-form');
        break;
      case 'returning-visitor':
        setCurrentStep('returning-visitor');
        break;
      case 'invited-guest':
        setCurrentStep('invited-guest');
        break;
      case 'appointment':
        setCurrentStep('appointment');
        break;
      case 'employee':
        setCurrentStep('employee');
        break;
      case 'check-out':
        setCurrentStep('check-out');
        break;
      case 'emergency':
        setCurrentStep('emergency');
        break;
      default:
        setCurrentStep('home');
    }
  };

  const handleNewVisitorSubmit = async (data: any) => {
    setIsLoading(true);
    setVisitorData(prev => ({ ...prev, ...data }));
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('new-visitor-photo');
    }, 1000);
  };

  const handlePhotoCapture = (photo: string) => {
    setVisitorData(prev => ({ ...prev, photo }));
    completeCheckIn();
  };

  const handleReturningVisitorSubmit = (visitorId: string) => {
    setIsLoading(true);
    
    // Simulate API call for returning visitor
    setTimeout(() => {
      setVisitorData({
        id: visitorId,
        name: 'John Smith',
        email: 'john.smith@company.com',
        company: 'Tech Corp',
        purpose: 'business',
        hostName: 'Sarah Johnson',
        badgeNumber: generateBadgeNumber(),
        checkInTime: new Date(),
        status: 'checked-in'
      } as Visitor);
      setIsLoading(false);
      completeCheckIn();
    }, 1500);
  };

  const handleInvitedGuestScan = (code: string) => {
    setIsLoading(true);
    
    // Simulate invitation validation
    setTimeout(() => {
      setVisitorData({
        name: 'Jane Doe',
        email: 'jane.doe@email.com',
        company: 'Partner Corp',
        purpose: 'business',
        hostName: 'Mike Chen',
        hostDepartment: 'Product',
        invitationCode: code,
        badgeNumber: generateBadgeNumber(),
        checkInTime: new Date(),
        status: 'checked-in'
      } as Visitor);
      setIsLoading(false);
      completeCheckIn();
    }, 2000);
  };

  const handleAppointmentSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate appointment check-in
    setTimeout(() => {
      setVisitorData({
        name: data.visitorName,
        email: data.visitorEmail,
        phone: data.visitorPhone,
        purpose: 'appointment',
        hostName: 'Dr. Sarah Johnson',
        appointmentCode: data.appointmentCode,
        badgeNumber: generateBadgeNumber(),
        checkInTime: new Date(),
        status: 'checked-in'
      } as Visitor);
      setIsLoading(false);
      completeCheckIn();
    }, 1500);
  };

  const handleEmployeeCheckIn = (data: any) => {
    setIsLoading(true);
    
    // Simulate employee check-in
    setTimeout(() => {
      setVisitorData({
        name: data.employeeName,
        email: data.employeeEmail,
        purpose: 'employee',
        hostName: 'Self',
        employeeId: data.employeeId,
        badgeNumber: generateBadgeNumber(),
        checkInTime: new Date(),
        status: 'checked-in'
      } as Visitor);
      setIsLoading(false);
      completeCheckIn();
    }, 1000);
  };
  const completeCheckIn = () => {
    setCurrentStep('confirmation');
  };

  const handleComplete = () => {
    setCurrentStep('home');
    setVisitorData({});
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'new-visitor-form':
      case 'returning-visitor':
      case 'invited-guest':
      case 'appointment':
      case 'employee':
      case 'check-out':
      case 'emergency':
        setCurrentStep('home');
        break;
      case 'new-visitor-photo':
        setCurrentStep('new-visitor-form');
        break;
      default:
        setCurrentStep('home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <StatusBar />
      
      <main className="pt-4 pb-8 px-4 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="w-full max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 'home' && (
                <CheckInOptions onOptionSelect={handleOptionSelect} />
              )}
              
              {currentStep === 'new-visitor-form' && (
                <NewVisitorForm
                  onSubmit={handleNewVisitorSubmit}
                  onBack={handleBack}
                  isLoading={isLoading}
                />
              )}
              
              {currentStep === 'new-visitor-photo' && (
                <PhotoCapture
                  onPhotoCapture={handlePhotoCapture}
                  onSkip={() => completeCheckIn()}
                />
              )}
              
              {currentStep === 'returning-visitor' && (
                <ReturningVisitorForm
                  onSubmit={handleReturningVisitorSubmit}
                  onBack={handleBack}
                  isLoading={isLoading}
                />
              )}
              
              {currentStep === 'invited-guest' && (
                <QRScanner
                  onScanSuccess={handleInvitedGuestScan}
                  onBack={handleBack}
                  title="Scan Invitation Code"
                  description="Scan your QR code or enter the invitation code manually"
                />
              )}
              
              {currentStep === 'appointment' && (
                <AppointmentForm
                  onSubmit={handleAppointmentSubmit}
                  onBack={handleBack}
                  isLoading={isLoading}
                />
              )}
              
              {currentStep === 'employee' && (
                <EmployeeForm
                  onSubmit={handleEmployeeCheckIn}
                  onBack={handleBack}
                  isLoading={isLoading}
                />
              )}
              
              {currentStep === 'confirmation' && (
                <CheckInConfirmation
                  visitorData={visitorData as Visitor}
                  onComplete={handleComplete}
                />
              )}
              
              {currentStep === 'emergency' && (
                <EmergencyContacts onBack={handleBack} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <KioskApp />
      </Router>
    </QueryClientProvider>
  );
}

export default App;