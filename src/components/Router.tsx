import React from 'react';
import { LoginPage } from './auth/LoginPage';
import { ResetPasswordPage } from './auth/ResetPasswordPage';

interface RouterProps {
  children: React.ReactNode;
}

export function Router({ children }: RouterProps) {
  const currentPath = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  
  // Handle reset password route
  if (currentPath === '/reset-password' || currentPath.includes('reset-password')) {
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    
    if (token && email) {
      return (
        <ResetPasswordPage 
          token={token} 
          email={decodeURIComponent(email)} 
          onSuccess={() => {
            // Redirect to home page after successful reset
            window.location.href = '/';
          }} 
        />
      );
    } else {
      // Invalid reset password link, redirect to login
      window.location.href = '/';
      return null;
    }
  }
  
  // Default to main app
  return <>{children}</>;
}