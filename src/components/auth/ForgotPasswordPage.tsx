import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { forgotPassword, clearError } from '../../store/slices/authSlice';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const result = await dispatch(forgotPassword(email));
      if (forgotPassword.fulfilled.match(result)) {
        setIsSubmitted(true);
        toast.success('Password reset email sent!');
      } else {
        toast.error(result.payload as string || 'Failed to send reset email');
      }
    } catch (error) {
      toast.error('Failed to send reset email');
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (error) dispatch(clearError());
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="text-center p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-white mb-2">Email Sent!</h1>
              <p className="text-white/70 text-sm mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your email and follow the instructions to reset your password.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="text-center pt-4 pb-3 px-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="absolute top-6 left-6 p-2 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg"
            >
              <Mail className="w-6 h-6 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-bold text-white mb-1"
            >
              Forgot Password?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/70 text-sm"
            >
              Enter your email address and we'll send you a link to reset your password.
            </motion.p>
          </div>

          {/* Form */}
          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter your email address"
                  disabled={loading}
                  required
                />
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-2 text-red-200 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </div>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <p className="text-white/50 text-xs">
                Remember your password?{' '}
                <button
                  onClick={onBack}
                  className="text-orange-400 hover:text-orange-300 underline transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}