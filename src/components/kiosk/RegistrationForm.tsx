import  { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft, CheckCircle, AlertCircle, Camera, Upload, FileText, Edit3 } from 'lucide-react';
import { compressImage, formatFileSize } from '../../lib/imageUtils';
interface RegistrationData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  purpose: string;
  hostName?: string;
  image?: File;
  document?: File;
  signature?: File;
}

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => void;
  onBack: () => void;
  isLoading?: boolean;
  initialData?: Partial<RegistrationData>;
}

export function RegistrationForm({ 
  onSubmit, 
  onBack, 
  isLoading = false, 
  initialData = {} 
}: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    purpose: initialData.purpose || '',
    hostName: initialData.hostName || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCompressing, setIsCompressing] = useState(false);
  const [previews, setPreviews] = useState<{
    image?: string;
    document?: string;
    signature?: string;
  }>({});
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const purposeOptions = [
    { value: 'Meeting', label: 'Business Meeting' },
    { value: 'Interview', label: 'Job Interview' },
    { value: 'Delivery', label: 'Delivery' },
    { value: 'Service', label: 'Contractor/Service' },
    { value: 'Personal', label: 'Personal Visit' },
    { value: 'Other', label: 'Other' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Please select a purpose for your visit';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = async (field: 'image' | 'document' | 'signature', file: File) => {
    // Clear any existing errors for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    
    // Check file size (2MB limit)
    const maxSize = 2048 * 1024; // 2MB in bytes
    
    if (file.size > maxSize) {
      if (field === 'image' || field === 'signature') {
        // Compress images
        setIsCompressing(true);
        try {
          const compressedFile = await compressImage(file, 2048);
          setFormData(prev => ({ ...prev, [field]: compressedFile }));
          
          // Create preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviews(prev => ({ ...prev, [field]: e.target?.result as string }));
          };
          reader.readAsDataURL(compressedFile);
        } catch (error) {
          setErrors(prev => ({ ...prev, [field]: 'Failed to compress image. Please try a smaller file.' }));
        } finally {
          setIsCompressing(false);
        }
      } else {
        // For documents, show error
        setErrors(prev => ({ 
          ...prev, 
          [field]: `File size (${formatFileSize(file.size)}) exceeds 2MB limit. Please choose a smaller file.` 
        }));
        return;
      }
    } else {
      // File is within size limit
      setFormData(prev => ({ ...prev, [field]: file }));
      
      // Create preview
      if (field === 'image' || field === 'signature') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => ({ ...prev, [field]: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => ({ ...prev, [field]: file.name }));
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <UserPlus className="w-5 h-5" />
              <h1 className="text-lg font-bold">New Visitor Registration</h1>
            </div>
            <p className="text-blue-100 text-xs">Fill in your details below</p>
          </div>
          
          <div className="p-3 sm:p-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    disabled={isLoading}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Company/Organization</label>
                  <input
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Enter your company name"
                    disabled={isLoading}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Purpose of Visit *</label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select purpose of visit</option>
                    {purposeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Person to Meet</label>
                  <input
                    value={formData.hostName}
                    onChange={(e) => handleInputChange('hostName', e.target.value)}
                    placeholder="Enter host name (optional)"
                    disabled={isLoading}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-gray-700 mb-2">Additional Information (Optional)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-blue-400 transition-colors">
                    {previews.image ? (
                      <div>
                        <img src={previews.image} alt="Preview" className="w-8 h-8 mx-auto rounded-full object-cover mb-1" />
                        <button
                          onClick={() => imageInputRef.current?.click()}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Change Photo
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                        <button
                          onClick={() => imageInputRef.current?.click()}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Take Photo
                        </button>
                      </div>
                    )}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('image', file);
                      }}
                    />
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-blue-400 transition-colors">
                    {previews.document ? (
                      <div>
                        <FileText className="w-5 h-5 mx-auto text-green-500 mb-1" />
                        <p className="text-xs text-gray-600 truncate mb-1">{previews.document}</p>
                        <button
                          onClick={() => documentInputRef.current?.click()}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Change ID
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                        <button
                          onClick={() => documentInputRef.current?.click()}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Upload ID
                        </button>
                      </div>
                    )}
                    <input
                      ref={documentInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('document', file);
                      }}
                    />
                    {errors.document && <p className="text-red-500 text-xs mt-1">{errors.document}</p>}
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-blue-400 transition-colors">
                    {previews.signature ? (
                      <div>
                        <img src={previews.signature} alt="Signature" className="w-8 h-4 mx-auto object-contain mb-1" />
                        <button
                          onClick={() => signatureInputRef.current?.click()}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Change Signature
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Edit3 className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                        <button
                          onClick={() => signatureInputRef.current?.click()}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Add Signature
                        </button>
                      </div>
                    )}
                    <input
                      ref={signatureInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('signature', file);
                      }}
                    />
                    {errors.signature && <p className="text-red-500 text-xs mt-1">{errors.signature}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-blue-800 text-xs">
                    <p className="font-medium mb-1">Registration Info</p>
                    <p>You'll receive an access code for future visits. Information is securely stored.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onBack}
                  disabled={isLoading}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center justify-center space-x-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span className="text-sm">Back</span>
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || isCompressing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-1"
                >
                  {(isLoading || isCompressing) ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                  ) : (
                    <CheckCircle className="w-3 h-3" />
                  )}
                  <span className="text-sm">
                    {isCompressing ? 'Compressing...' : isLoading ? 'Registering...' : 'Complete Registration'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        </motion.div>
        <div className="h-32"></div>
      </div>
    </div>
  );
}