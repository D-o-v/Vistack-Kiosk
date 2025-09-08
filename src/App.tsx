import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBar } from './components/kiosk/StatusBar';
import { EnhancedKioskHome } from './components/kiosk/EnhancedKioskHome';
import { AccessCodeInput } from './components/kiosk/AccessCodeInput';
import { EmailNameInput } from './components/kiosk/EmailNameInput';
import { ProfileDisplay } from './components/kiosk/ProfileDisplay';
import { RegistrationForm } from './components/kiosk/RegistrationForm';
import { EnhancedScanner } from './components/kiosk/EnhancedScanner';
import { CheckInConfirmation } from './components/kiosk/CheckInConfirmation';
import { CheckoutForm } from './components/kiosk/CheckoutForm';
import { CheckoutConfirmation } from './components/kiosk/CheckoutConfirmation';
import { EmergencyContacts } from './components/kiosk/EmergencyContacts';
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
  | 'access-code'
  | 'email-name-input'
  | 'profile-display'
  | 'registration'
  | 'scanner'
  | 'checkout'
  | 'checkout-confirmation'
  | 'confirmation'
  | 'emergency';

function KioskApp() {
  const [currentStep, setCurrentStep] = useState<KioskStep>('home');
  const [visitorData, setVisitorData] = useState<Partial<Visitor>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionSelect = (option: string) => {
    switch (option) {
      case 'access-code':
        setCurrentStep('access-code');
        break;
      case 'no-access-code':
        setCurrentStep('email-name-input');
        break;
      case 'scanner':
        setCurrentStep('scanner');
        break;
      case 'checkout':
        setCurrentStep('checkout');
        break;
      case 'emergency':
        setCurrentStep('emergency');
        break;
      default:
        setCurrentStep('home');
    }
  };

  const handleAccessCodeSubmit = (code: string) => {
    setIsLoading(true);
    
    // Simulate access code validation
    setTimeout(() => {
      setVisitorData({
        id: 'visitor_' + code,
        name: 'John Smith',
        email: 'john.smith@company.com',
        company: 'Tech Corp',
        guestType: 'business',
        purpose: 'Business Meeting',
        hostName: 'Sarah Johnson',
        badgeNumber: code,
        checkInTime: new Date(),
        status: 'checked-in',
        visitCount: 3
      } as Visitor);
      setIsLoading(false);
      completeCheckIn();
    }, 1500);
  };

  const handleEmailNameSubmit = (emailOrName: string) => {
    setIsLoading(true);
    
    // Simulate user lookup
    setTimeout(() => {
      const isEmail = emailOrName.includes('@');
      const isExistingUser = Math.random() > 0.5; // 50% chance of existing user
      const nameDetected = Math.random() > 0.3; // 70% chance name is detected properly
      
      if (isExistingUser) {
        // Returning visitor
        setVisitorData({
          id: 'visitor_' + Math.random().toString(36).substring(7),
          name: nameDetected ? (isEmail ? 'Jane Doe' : emailOrName) : '',
          email: isEmail ? emailOrName : 'jane.doe@email.com',
          company: 'Tech Solutions Inc',
          guestType: 'business',
          purpose: 'Business Meeting',
          hostName: 'Mike Johnson',
          badgeNumber: generateBadgeNumber(),
          visitCount: 2
        });
        setIsLoading(false);
        setCurrentStep('profile-display');
      } else {
        // New visitor - go to registration
        setVisitorData({
          name: nameDetected ? (isEmail ? '' : emailOrName) : '',
          email: isEmail ? emailOrName : '',
        });
        setIsLoading(false);
        setCurrentStep('registration');
      }
    }, 2000);
  };

  const handleProfileCheckIn = () => {
    setIsLoading(true);
    
    // Update visitor data with check-in info
    setVisitorData(prev => ({
      ...prev,
      checkInTime: new Date(),
      status: 'checked-in'
    }));
    
    setTimeout(() => {
      setIsLoading(false);
      completeCheckIn();
    }, 1000);
  };

  const handleRegistrationSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      const nameDetected = Math.random() > 0.2; // 80% chance name is detected in registration
      setVisitorData({
        id: 'visitor_' + Math.random().toString(36).substring(7),
        ...data,
        name: nameDetected ? data.name : '',
        guestType: data.purpose,
        badgeNumber: generateBadgeNumber(),
        checkInTime: new Date(),
        status: 'checked-in',
        visitCount: 1
      } as Visitor);
      setIsLoading(false);
      completeCheckIn();
    }, 2000);
  };

  const handleScanSuccess = (scanData: { type: 'qr' | 'face' | 'fingerprint'; value: string }) => {
    setIsLoading(true);
    
    // Simulate scan processing
    setTimeout(() => {
      const nameDetected = scanData.type === 'face' ? Math.random() > 0.4 : Math.random() > 0.1; // Face scan has lower detection rate
      setVisitorData({
        id: 'visitor_' + scanData.value,
        name: nameDetected ? 'Alex Johnson' : '',
        email: 'alex.johnson@company.com',
        company: 'Innovation Labs',
        guestType: 'business',
        purpose: 'Business Meeting',
        hostName: 'Sarah Wilson',
        badgeNumber: generateBadgeNumber(),
        checkInTime: new Date(),
        status: 'checked-in',
        visitCount: 1
      } as Visitor);
      setIsLoading(false);
      completeCheckIn();
    }, 1500);
  };

  const handleCheckoutSubmit = (identifier: string) => {
    setIsLoading(true);
    
    // Simulate checkout lookup
    setTimeout(() => {
      setVisitorData({
        id: 'visitor_checkout',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        company: 'Tech Solutions',
        guestType: 'business',
        purpose: 'Business Meeting',
        hostName: 'John Smith',
        badgeNumber: 'VIS001',
        checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        checkOutTime: new Date(),
        status: 'checked-out',
        visitCount: 1
      } as Visitor);
      setIsLoading(false);
      setCurrentStep('checkout-confirmation');
    }, 1500);
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
      case 'access-code':
      case 'email-name-input':
      case 'scanner':
      case 'emergency':
        setCurrentStep('home');
        break;
      case 'profile-display':
        setCurrentStep('email-name-input');
        break;
      case 'registration':
        setCurrentStep('email-name-input');
        break;
      case 'checkout':
        setCurrentStep('home');
        break;
      case 'checkout-confirmation':
        setCurrentStep('home');
        break;
      default:
        setCurrentStep('home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <StatusBar />
      
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
              {currentStep === 'home' && (
                <EnhancedKioskHome onOptionSelect={handleOptionSelect} />
              )}
              
              {currentStep === 'access-code' && (
                <AccessCodeInput
                  onSubmit={handleAccessCodeSubmit}
                  onBack={handleBack}
                  isLoading={isLoading}
                />
              )}
              
              {currentStep === 'email-name-input' && (
                <EmailNameInput
                  onSubmit={handleEmailNameSubmit}
                  onBack={handleBack}
                  isLoading={isLoading}
                />
              )}
              
              {currentStep === 'profile-display' && visitorData && (
                <ProfileDisplay
                  visitor={visitorData as Visitor}
                  onCheckIn={handleProfileCheckIn}
                  onBack={handleBack}
                  isLoading={isLoading}
                />
              )}
              
              {currentStep === 'registration' && (
                <RegistrationForm
                  onSubmit={handleRegistrationSubmit}
                  onBack={handleBack}
                  isLoading={isLoading}
                  initialEmail={visitorData.email || ''}
                  initialName={visitorData.name || ''}
                />
              )}
              
              {currentStep === 'scanner' && (
                <EnhancedScanner
                  onScanSuccess={handleScanSuccess}
                  onBack={handleBack}
                />
              )}
              
              {currentStep === 'checkout' && (
                <CheckoutForm
                  onSubmit={handleCheckoutSubmit}
                  onBack={handleBack}
                  isLoading={isLoading}
                />
              )}
              
              {currentStep === 'checkout-confirmation' && visitorData && (
                <CheckoutConfirmation
                  visitorData={visitorData as Visitor}
                  onComplete={handleComplete}
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