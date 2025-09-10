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
  if (!checkinData) {
    return <div>Loading...</div>;
  }
  
  const checkInTime = new Date(checkinData.checkin_time);
  const visitorName = `${checkinData.first_name} ${checkinData.last_name}`;
  const hostName = `${checkinData.host?.first_name || ''} ${checkinData.host?.last_name || ''}`.trim();

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
            <div className="space-y-4">
              {/* Personal Information */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Personal Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">First Name</span>
                    <span className="text-sm font-bold text-blue-900">{checkinData.first_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Last Name</span>
                    <span className="text-sm font-bold text-blue-900">{checkinData.last_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Email</span>
                    <span className="text-sm text-blue-900">{checkinData.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Phone</span>
                    <span className="text-sm text-blue-900">{checkinData.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Company</span>
                    <span className="text-sm font-bold text-blue-900">{checkinData.visitor?.company || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Visitor Type</span>
                    <span className="text-sm text-blue-900">{checkinData.visitor?.visitor_type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Address</span>
                    <span className="text-sm text-blue-900">{checkinData.visitor?.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Visit Information */}
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Visit Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Purpose</span>
                    <span className="text-sm font-bold text-green-900">{checkinData.purpose}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Check-in Method</span>
                    <span className="text-sm text-green-900 capitalize">{checkinData.checkin_method}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Check-in Time</span>
                    <span className="text-sm font-bold text-green-900">{formatTime(checkInTime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Visitor Tag</span>
                    <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">{checkinData.visitor_tag}</span>
                  </div>
                  {checkinData.person_type && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Person Type</span>
                      <span className="text-sm text-green-900 capitalize">{checkinData.person_type}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Host Information */}
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="text-sm font-bold text-purple-800 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Host Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">Host Name</span>
                    <span className="text-sm font-bold text-purple-900">{hostName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">Host Email</span>
                    <span className="text-sm text-purple-900">{checkinData.host?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* System Information */}
              {/* <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  System Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Created</span>
                    <span className="text-sm text-gray-900">{formatTime(new Date(checkinData.created_at))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Last Updated</span>
                    <span className="text-sm text-gray-900">{formatTime(new Date(checkinData.updated_at))}</span>
                  </div>
                  {checkinData.checkout_time && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Checkout Time</span>
                      <span className="text-sm font-bold text-gray-900">{formatTime(new Date(checkinData.checkout_time))}</span>
                    </div>
                  )}
                  {checkinData.approved_by && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Approved By</span>
                      <span className="text-sm text-gray-900">{checkinData.approved_by}</span>
                    </div>
                  )}
                </div>
              </div> */}
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
                    <p className="text-xs text-yellow-600 mt-1">Host: {hostName} ({checkinData.host?.email || 'N/A'})</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-blue-800 font-medium mb-2">Please wear your badge at all times</p>
                    <p className="text-xs text-blue-600">Your host has been notified • Check out before leaving</p>
                    <p className="text-xs text-blue-600 mt-1">Host: {hostName} ({checkinData.host?.email || 'N/A'})</p>
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