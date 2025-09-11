import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { store } from './store';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { guestCheckin, accessCodeCheckin, lookupVisitor, checkout } from './store/slices/checkinSlice';
import { LoginPage } from './components/auth/LoginPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { OrganizationVerification, OrganizationNotFound } from './components/auth/OrganizationVerification';
import { NoOrganizationPage } from './components/auth/NoOrganizationPage';
import { Router } from './components/Router';
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
import { getOrganizationCodeFromUrl, getOrganizationCodeFromPath } from './lib/urlUtils';
import { getCurrentTerminalId } from './lib/terminalUtils';
import { Visitor } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
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
  const dispatch = useAppDispatch();
  const { isAuthenticated, terminal_id } = useAppSelector((state) => state.auth);
  const { loading: checkinLoading } = useAppSelector((state) => state.checkin);
  
  const [currentStep, setCurrentStep] = useState<KioskStep>('home');
  const [visitorData, setVisitorData] = useState<Partial<Visitor>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(!isAuthenticated);
  const [accessCodeError, setAccessCodeError] = useState('');
  const [organization, setOrganization] = useState<any>(null);
  const [organizationError, setOrganizationError] = useState<string | null>(null);
  const [verifyingOrganization, setVerifyingOrganization] = useState(true);
  
  // Get organization code from URL
  const orgCode = getOrganizationCodeFromUrl() || getOrganizationCodeFromPath();
  
  useEffect(() => {
    if (orgCode && !organization) {
      // Organization code found in URL, verify it
      setVerifyingOrganization(true);
    } else if (!orgCode) {
      // No organization code, skip verification
      setVerifyingOrganization(false);
    }
  }, [orgCode, organization]);
  
  const handleOrganizationVerified = (orgData: any) => {
    setOrganization(orgData);
    setOrganizationError(null);
    setVerifyingOrganization(false);
  };
  
  const handleOrganizationError = (error: string) => {
    setOrganizationError(error);
    setVerifyingOrganization(false);
  };
  
  const handleRetryOrganization = () => {
    setOrganizationError(null);
    setVerifyingOrganization(true);
  };
  
  // Check for reset password parameters in URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentPath = window.location.pathname;
  const resetToken = urlParams.get('token');
  const resetEmail = urlParams.get('email');
  const isResetMode = urlParams.get('reset') === 'true';
  const isResetPassword = (resetToken && resetEmail && isResetMode) || currentPath.includes('/reset-password');

  // Show no organization page if no code provided
  if (!orgCode) {
    return <NoOrganizationPage />;
  }
  
  // Show organization verification if code exists and not verified
  if (orgCode && verifyingOrganization) {
    return (
      <OrganizationVerification
        code={orgCode}
        onVerified={handleOrganizationVerified}
        onError={handleOrganizationError}
      />
    );
  }
  
  // Show organization not found if verification failed
  if (orgCode && organizationError) {
    return (
      <OrganizationNotFound
        code={orgCode}
        onRetry={handleRetryOrganization}
      />
    );
  }
  
  if (isResetPassword) {
    return (
      <ResetPasswordPage 
        token={resetToken!} 
        email={resetEmail!} 
        onSuccess={() => {
          // Clear URL parameters and show login
          window.history.replaceState({}, document.title, window.location.pathname);
          toast.success('Password reset successful! Please login with your new password.');
          setShowLogin(true);
        }} 
      />
    );
  }

  if (showLogin) {
    return <LoginPage onLoginSuccess={() => setShowLogin(false)} organization={organization} />;
  }

  const handleOptionSelect = (option: string) => {
    switch (option) {
      case 'access-code':
        setAccessCodeError('');
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

  const handleAccessCodeSubmit = async (code: string) => {
    setIsLoading(true);
    
    try {
      const result = await dispatch(accessCodeCheckin({
        access_code: code,
        // checkin_method: 'access_code',
        checkin_method: 'qr',
        terminal_id: terminal_id || getCurrentTerminalId()
      }));
      
      if (accessCodeCheckin.fulfilled.match(result)) {
        const data = result.payload.data;
        toast.success(`Welcome back, ${data.first_name} ${data.last_name}!`);
        
        setVisitorData(data);
        
        setIsLoading(false);
        completeCheckIn();
      } else {
        setIsLoading(false);
        const errorMessage = (result.payload as any)?.message || 'Invalid access code';
        setAccessCodeError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = 'Failed to check in with access code';
      setAccessCodeError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEmailNameSubmit = async (emailOrPhone: string) => {
    setIsLoading(true);
    
    try {
      const result = await dispatch(lookupVisitor(emailOrPhone));
      
      if (lookupVisitor.fulfilled.match(result)) {
        const visitor = result.payload;
        if (visitor && visitor.id) {
          // Existing visitor found - prefill registration form
          toast.success(`Welcome back, ${visitor.first_name}!`);
          
          setVisitorData({
            name: `${visitor.first_name} ${visitor.last_name}`,
            email: visitor.email,
            phone: visitor.phone,
            company: visitor.company || '',
          });
          
          setIsLoading(false);
          setCurrentStep('registration');
        } else {
          // No visitor found, go to registration with email/phone prefilled
          const isEmail = emailOrPhone.includes('@');
          setVisitorData({
            name: '',
            email: isEmail ? emailOrPhone : '',
            phone: isEmail ? '' : emailOrPhone,
          });
          setIsLoading(false);
          setCurrentStep('registration');
        }
      } else {
        // API error or no results, go to registration
        const isEmail = emailOrPhone.includes('@');
        setVisitorData({
          name: '',
          email: isEmail ? emailOrPhone : '',
          phone: isEmail ? '' : emailOrPhone,
        });
        setIsLoading(false);
        setCurrentStep('registration');
      }
    } catch (error) {
      // Error occurred, go to registration
      const isEmail = emailOrPhone.includes('@');
      setVisitorData({
        name: '',
        email: isEmail ? emailOrPhone : '',
        phone: isEmail ? '' : emailOrPhone,
      });
      setIsLoading(false);
      setCurrentStep('registration');
      toast.error('Unable to lookup visitor, please register');
    }
  };

  const handleProfileCheckIn = () => {
    setIsLoading(true);
    
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

  const handleRegistrationSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      const result = await dispatch(guestCheckin({
        access_category: 2,
        checkin_method: 'manual',
        purpose: data.purpose,
        first_name: data.name.split(' ')[0] || data.name,
        last_name: data.name.split(' ').slice(1).join(' ') || '',
        email: data.email,
        phone: data.phone,
        host_id: terminal_id || getCurrentTerminalId(),
        image: data.image,
        document: data.document,
        signature: data.signature
      }));
      
      if (guestCheckin.fulfilled.match(result)) {
        const responseData = result.payload.data;
        const status = responseData?.status || 'pending';
        const message = status === 'pending' 
          ? `Registration submitted! Your visitor tag is ${responseData?.visitor_tag}. Please wait for approval.`
          : `Welcome, ${data.name}! Check-in successful.`;
        
        toast.success(message);
        
        setVisitorData(responseData);
        
        setIsLoading(false);
        completeCheckIn();
      } else {
        setIsLoading(false);
        toast.error((result.payload as any)?.message || 'Registration failed');
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to register visitor');
    }
  };

  const handleScanSuccess = (scanData: { type: 'qr' | 'face' | 'fingerprint'; value: string; checkinData?: any }) => {
    // For QR scans, use the real checkin data from API
    if (scanData.type === 'qr' && scanData.checkinData) {
      setVisitorData(scanData.checkinData.data || scanData.checkinData);
      completeCheckIn();
      return;
    }
    
    // Handle face/fingerprint scans with mock data
    setIsLoading(true);
    
    setTimeout(() => {
      const nameDetected = scanData.type === 'face' ? Math.random() > 0.4 : Math.random() > 0.1;
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

  const handleCheckoutSubmit = async (identifier: string) => {
    setIsLoading(true);
    
    try {
      const result = await dispatch(checkout({
        query: identifier,
        terminal_id: terminal_id || getCurrentTerminalId()
      }));
      
      if (checkout.fulfilled.match(result)) {
        const response = result.payload;
        const data = response.checkin;
        toast.success(response.message || `Checkout successful for ${data.first_name} ${data.last_name}!`);
        
        setVisitorData(data);
        
        setIsLoading(false);
        setCurrentStep('checkout-confirmation');
      } else {
        setIsLoading(false);
        toast.error((result.payload as any)?.message || 'Checkout failed');
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to checkout visitor');
    }
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
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <StatusBar />
      
      <main className="pt-16 sm:pt-20">
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
                error={accessCodeError}
              />
            )}
            
            {currentStep === 'email-name-input' && (
              <EmailNameInput
                onSubmit={handleEmailNameSubmit}
                onBack={handleBack}
                isLoading={isLoading}
              />
            )}
            
            {currentStep === 'profile-display' && (
              <ProfileDisplay
                visitor={visitorData as Visitor}
                onCheckIn={handleProfileCheckIn}
                onBack={handleBack}
                isLoading={isLoading}
              />
            )}
            
            {currentStep === 'registration' && (
              <RegistrationForm
                initialData={visitorData}
                onSubmit={handleRegistrationSubmit}
                onBack={handleBack}
                isLoading={checkinLoading}
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
            
            {currentStep === 'checkout-confirmation' && (
              <CheckoutConfirmation
                visitorData={visitorData as any}
                onComplete={handleComplete}
              />
            )}
            
            {currentStep === 'confirmation' && (
              <CheckInConfirmation
                checkinData={visitorData as any}
                onBack={handleComplete}
              />
            )}
            
            {currentStep === 'emergency' && (
              <EmergencyContacts onBack={handleBack} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <KioskApp />
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}