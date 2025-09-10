import React from 'react';
import { motion } from 'framer-motion';
import { Check, Printer, ArrowLeft, User, Mail, Phone, Building, Clock, Tag, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatTime } from '../../lib/utils';

interface CheckInConfirmationProps {
  checkinData: {
    id: number;
    organization_id: number;
    checkin_method: string;
    status: string;
    purpose: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    person_type: string | null;
    checkin_time: string;
    checkout_time: string | null;
    visitor_tag: string;
    visitor: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      company: string;
      visitor_type: string;
      address: string;
    };
    host: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
    approved_by: any;
    image_url: string | null;
    document_url: string | null;
    signature_url: string | null;
    created_at: string;
    updated_at: string;
  };
  onBack: () => void;
  onPrintBadge?: () => void;
}

export function CheckInConfirmation({ checkinData, onBack, onPrintBadge }: CheckInConfirmationProps) {
  const checkInTime = new Date(checkinData.checkin_time);
  const visitorName = `${checkinData.first_name} ${checkinData.last_name}`;
  const hostName = `${checkinData.host.first_name} ${checkinData.host.last_name}`;

  const handlePrintBadge = () => {
    if (onPrintBadge) {
      onPrintBadge();
    }
    alert('Badge printing initiated. Please wait for your visitor badge.');
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-white/20 rounded-full p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center"
            >
              <Check className="w-8 h-8" />
            </motion.div>
            <h1 className="text-xl font-bold mb-1">Welcome to Vistacks!</h1>
            <p className="text-sm text-green-100">Your check-in is complete</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Status Badge */}
            <div className="text-center">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                checkinData.status === 'approved' ? 'bg-green-100 text-green-800' :
                checkinData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {checkinData.status === 'pending' ? 'Pending Approval' : 
                 checkinData.status === 'approved' ? 'Approved' : 
                 checkinData.status.charAt(0).toUpperCase() + checkinData.status.slice(1)}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 text-center">Check-in Complete</h3>
            
            {/* Visitor Photo */}
            {checkinData.image_url && (
              <div className="text-center">
                <img 
                  src={checkinData.image_url} 
                  alt="Visitor Photo" 
                  className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-green-200"
                />
              </div>
            )}
            
            {/* Visitor Details */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Check-in ID</span>
                </div>
                <span className="text-base font-bold text-gray-900">#{checkinData.id}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Visitor</span>
                </div>
                <span className="text-base font-bold text-gray-900">{visitorName}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Email</span>
                </div>
                <span className="text-base text-gray-900">{checkinData.email}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Phone</span>
                </div>
                <span className="text-base text-gray-900">{checkinData.phone}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Company</span>
                </div>
                <span className="text-base text-gray-900">{checkinData.visitor.company}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Purpose</span>
                </div>
                <span className="text-base font-bold text-gray-900">{checkinData.purpose}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Host</span>
                </div>
                <span className="text-base font-bold text-gray-900">{hostName}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Check-in Time</span>
                </div>
                <span className="text-base font-bold text-gray-900">{formatTime(checkInTime)}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Visitor Tag</span>
                </div>
                <span className="text-base font-bold text-green-600">{checkinData.visitor_tag}</span>
              </div>
            </div>

            {/* Document Links */}
            {(checkinData.document_url || checkinData.signature_url) && (
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Uploaded Documents</h4>
                <div className="space-y-1">
                  {checkinData.document_url && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">ID Document</span>
                      <a href={checkinData.document_url} target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-blue-800 hover:underline">View</a>
                    </div>
                  )}
                  {checkinData.signature_url && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">Signature</span>
                      <a href={checkinData.signature_url} target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-blue-800 hover:underline">View</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Print Badge Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handlePrintBadge}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center space-x-2 py-3 mb-4"
            >
              <Printer className="w-5 h-5" />
              <span>Print Visitor Badge</span>
            </Button>

            {/* Status Message */}
            <div className={`border rounded-lg p-4 ${
              checkinData.status === 'pending' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="text-center">
                {checkinData.status === 'pending' ? (
                  <>
                    <p className="text-sm text-yellow-800 font-medium mb-2">Check-in Submitted Successfully!</p>
                    <p className="text-xs text-yellow-600">Please wait for approval • Your visitor tag is {checkinData.visitor_tag}</p>
                    <p className="text-xs text-yellow-600 mt-1">Host: {hostName} ({checkinData.host.email})</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-blue-800 font-medium mb-2">Please wear your badge at all times</p>
                    <p className="text-xs text-blue-600">Your host has been notified • Check out before leaving</p>
                    <p className="text-xs text-blue-600 mt-1">Host: {hostName} ({checkinData.host.email})</p>
                  </>
                )}
              </div>
            </div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <Button
                variant="secondary"
                size="lg"
                onClick={onBack}
                className="w-full flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}