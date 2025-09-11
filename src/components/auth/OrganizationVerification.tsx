import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building, AlertCircle, Loader } from 'lucide-react';
import { authAPI } from '../../api/endpoints';

interface OrganizationVerificationProps {
  code: string;
  onVerified: (organization: any) => void;
  onError: (error: string) => void;
}

export function OrganizationVerification({ code, onVerified, onError }: OrganizationVerificationProps) {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);

  useEffect(() => {
    verifyOrganization();
  }, [code]);

  const verifyOrganization = async () => {
    try {
      setLoading(true);
      const response = await authAPI.verifyOrganization(code);
      const orgData = response.data.data || response.data;
      setOrganization(orgData);
      onVerified(orgData);
    } catch (error: any) {
      console.error('Organization verification failed:', error);
      onError('Organization not found or invalid code');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verifying Organization</h1>
          <p className="text-white/70 text-sm mb-6">Please wait while we verify your organization...</p>
          <div className="flex items-center justify-center space-x-2 text-blue-400">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Verifying code: {code}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}

export function OrganizationNotFound({ code, onRetry }: { code: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center max-w-md"
      >
        <div className="w-16 h-16 bg-red-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Organization Not Found</h1>
        <p className="text-white/70 text-sm mb-4">
          The organization code "{code}" is not valid or has expired.
        </p>
        <p className="text-white/60 text-xs mb-6">
          Please check your URL or contact your administrator for a valid organization code.
        </p>
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}