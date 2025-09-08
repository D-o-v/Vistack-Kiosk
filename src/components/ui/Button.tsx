import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 touch-manipulation';
    
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 border border-gray-300',
      success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl',
      warning: 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl'
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm min-h-[40px] sm:px-4 sm:min-h-[44px]',
      md: 'px-4 py-2 text-sm min-h-[44px] sm:px-6 sm:py-3 sm:text-base sm:min-h-[48px]',
      lg: 'px-5 py-3 text-base min-h-[48px] sm:px-8 sm:py-4 sm:text-lg sm:min-h-[52px]',
      xl: 'px-6 py-4 text-lg min-h-[52px] sm:px-12 sm:py-6 sm:text-xl sm:min-h-[60px]'
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };