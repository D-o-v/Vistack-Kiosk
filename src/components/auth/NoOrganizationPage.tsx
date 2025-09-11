import React from 'react';
import { motion } from 'framer-motion';
import { Building, AlertTriangle, ExternalLink } from 'lucide-react';

export function NoOrganizationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center max-w-md"
      >
        <div className="w-16 h-16 bg-orange-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-orange-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Access Required</h1>
        
        <p className="text-white/70 text-sm mb-4">
          This kiosk requires an organization access code to continue.
        </p>
        
        <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
          <h3 className="text-white font-medium mb-2 flex items-center">
            <Building className="w-4 h-4 mr-2" />
            How to Access
          </h3>
          <ul className="text-white/60 text-xs space-y-1">
            <li>• Contact your organization administrator</li>
            <li>• Request a valid kiosk access link</li>
            <li>• Use the provided URL with organization code</li>
          </ul>
        </div>
        
        <div className="text-white/50 text-xs">
          <p className="mb-2">Expected URL format:</p>
          <code className="bg-white/10 px-2 py-1 rounded text-blue-300">
            ?code=YOUR_ORG_CODE
          </code>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs flex items-center justify-center">
            <ExternalLink className="w-3 h-3 mr-1" />
            Powered by Vistacks
          </p>
        </div>
      </motion.div>
    </div>
  );
}