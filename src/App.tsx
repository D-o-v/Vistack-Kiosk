import { useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { store } from './store';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { guestCheckin, accessCodeCheckin, lookupVisitor } from './store/slices/checkinSlice';
import { LoginPage } from './components/auth/LoginPage';
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
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { loading: checkinLoading } = useAppSelector((state) => state.checkin);
  
  const [currentStep, setCurrentStep] = useState<KioskStep>('home');
  const [visitorData, setVisitorData] = useState<Partial<Visitor>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(!isAuthenticated);

  if (showLogin) {
    return <LoginPage onLoginSuccess={() => setShowLogin(false)} />;
  }

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

  const handleAccessCodeSubmit = async (code: string) => {
    setIsLoading(true);
    
    try {
      const result = await dispatch(accessCodeCheckin({
        access_code: code,
        checkin_method: 'qr'
      }));
      
      if (accessCodeCheckin.fulfilled.match(result)) {
        const data = result.payload.data;
        toast.success(`Welcome back, ${data.first_name} ${data.last_name}!`);
        
        setVisitorData({
          id: data.id.toString(),
          name: `${data.first_name} ${data.last_name}`,
          email: data.email || 'N/A',
          company: data.organization_id ? `Org ${data.organization_id}` : 'N/A',
          guestType: data.person_type,
          purpose: data.purpose || 'Access Code Check-in',
          hostName: 'System',
          badgeNumber: data.visitor_tag || code,
          checkInTime: new Date(data.checkin_time),
          status: data.status,
          visitCount: 1
        } as Visitor);
        
        setIsLoading(false);
        completeCheckIn();
      } else {
        setIsLoading(false);
        toast.error((result.payload as any)?.message || 'Invalid access code');
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to check in with access code');
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
        host_id: 2,
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
        
        setVisitorData({
          id: responseData?.id?.toString() || 'visitor_' + Math.random().toString(36).substring(7),
          name: `${responseData?.first_name} ${responseData?.last_name}`,
          email: data.email,
          phone: data.phone,
          company: data.company || 'N/A',
          guestType: responseData?.person_type || 'guest',
          purpose: responseData?.purpose || data.purpose,
          hostName: data.hostName || 'System',
          badgeNumber: responseData?.visitor_tag || generateBadgeNumber(),
          checkInTime: responseData?.checkin_time ? new Date(responseData.checkin_time) : new Date(),
          status: status,
          visitCount: 1,
          visitor_tag: responseData?.visitor_tag,
          checkin_method: responseData?.checkin_method,
          created_at: responseData?.created_at,
          image_url: responseData?.image_url,
          document_url: responseData?.document_url,
          signature_url: responseData?.signature_url
        } as Visitor);
        
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

  const handleScanSuccess = (scanData: { type: 'qr' | 'face' | 'fingerprint'; value: string }) => {
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

  const handleCheckoutSubmit = () => {
    setIsLoading(true);
    
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
        checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
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
      
      <main className="pt-16 sm:pt-20 pb-4 sm:pb-6">
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
                visitorData={visitorData as Visitor}
                onComplete={handleComplete}
              />
            )}
            
            {currentStep === 'confirmation' && (
              <CheckInConfirmation
                visitorData={{
                  name: visitorData.name || '',
                  email: visitorData.email,
                  phone: visitorData.phone,
                  company: visitorData.company,
                  purpose: visitorData.purpose || 'Visit',
                  hostName: visitorData.hostName || 'System',
                  hostDepartment: visitorData.hostDepartment,
                  photo: visitorData.photo
                }}
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

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <KioskApp />
      </QueryClientProvider>
    </Provider>
  );
}