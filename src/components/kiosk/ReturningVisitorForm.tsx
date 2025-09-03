import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Clock, Building, RotateCcw, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { formatTime, formatDate } from '../../lib/utils';
import { Visitor } from '../../types';

interface ReturningVisitorFormProps {
  onSubmit: (visitorId: string, updates?: Partial<Visitor>) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function ReturningVisitorForm({ onSubmit, onBack, isLoading }: ReturningVisitorFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Visitor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  // Mock visitor data - in real app, this would come from API
  const mockVisitors: Visitor[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '(555) 123-4567',
      company: 'Tech Corp',
      guestType: 'business',
      purpose: 'Business meeting with sales team',
      hostName: 'Sarah Johnson',
      hostDepartment: 'Sales',
      checkInTime: new Date('2024-01-15T09:30:00'),
      checkOutTime: new Date('2024-01-15T11:30:00'),
      badgeNumber: 'VST001234',
      status: 'checked-out',
      visitCount: 5
    },
    {
      id: '2',
      name: 'Mary Davis',
      email: 'mary.davis@email.com',
      phone: '(555) 987-6543',
      company: 'Design Studio',
      guestType: 'business',
      purpose: 'Product presentation',
      hostName: 'Mike Chen',
      hostDepartment: 'Product',
      checkInTime: new Date('2024-01-10T14:00:00'),
      checkOutTime: new Date('2024-01-10T16:30:00'),
      badgeNumber: 'VST001189',
      status: 'checked-out',
      visitCount: 3
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      const results = mockVisitors.filter(visitor =>
        visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visitor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visitor.phone?.includes(searchQuery) ||
        visitor.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const handleSelectVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
  };

  const handleConfirmCheckIn = () => {
    if (selectedVisitor) {
      onSubmit(selectedVisitor.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-6"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardTitle className="text-4xl text-center flex items-center justify-center space-x-4">
            <RotateCcw className="w-10 h-10" />
            <span>Welcome Back!</span>
          </CardTitle>
          <p className="text-xl text-center text-green-100 mt-3">
            Search for your previous visit to check in quickly
          </p>
        </CardHeader>
        <CardContent className="p-10">
          {!selectedVisitor ? (
            <div className="space-y-10">
              {/* Search Section */}
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Find Your Previous Visit
                </h3>
                <div className="flex space-x-4">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter your name, email, or phone number"
                    className="flex-1 text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="flex items-center space-x-2 min-w-[140px] h-12"
                  >
                    <Search className="w-5 h-5" />
                    <span>{isSearching ? 'Searching...' : 'Search'}</span>
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-gray-900 text-center">
                    Found {searchResults.length} previous visit{searchResults.length !== 1 ? 's' : ''}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((visitor, index) => (
                      <motion.div
                        key={visitor.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="cursor-pointer"
                        onClick={() => handleSelectVisitor(visitor)}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="bg-green-100 p-3 rounded-xl">
                                <User className="w-6 h-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {visitor.name}
                                </h4>
                                <div className="text-sm text-gray-600 space-y-1 mt-2">
                                  {visitor.company && (
                                    <p className="flex items-center space-x-2">
                                      <Building className="w-4 h-4" />
                                      <span>{visitor.company}</span>
                                    </p>
                                  )}
                                  <p className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Last visit: {formatDate(visitor.checkInTime)}</span>
                                  </p>
                                  <p className="font-medium text-green-600">
                                    {visitor.visitCount} previous visits
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Button variant="success" size="sm">
                                  Select
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* No Results */}
              {searchResults.length === 0 && searchQuery && !isSearching && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Previous Visits Found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any previous visits matching "{searchQuery}"
                  </p>
                  <Button
                    variant="primary"
                    onClick={onBack}
                    className="flex items-center space-x-2"
                  >
                    <User className="w-5 h-5" />
                    <span>Register as New Visitor</span>
                  </Button>
                </motion.div>
              )}
            </div>
          ) : (
            /* Visitor Confirmation */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
                <Check className="w-12 h-12 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome back, {selectedVisitor.name}!
              </h3>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h4 className="font-semibold text-gray-900 mb-4">Previous Visit Details:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Company:</strong> {selectedVisitor.company || 'Not specified'}</p>
                  <p><strong>Last Host:</strong> {selectedVisitor.hostName}</p>
                  <p><strong>Last Visit:</strong> {formatDate(selectedVisitor.checkInTime)} at {formatTime(selectedVisitor.checkInTime)}</p>
                  <p><strong>Total Visits:</strong> {selectedVisitor.visitCount}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  Are you here for a similar visit? We'll use your previous information to speed up check-in.
                </p>
                
                <div className="flex space-x-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setSelectedVisitor(null)}
                    className="flex-1"
                  >
                    Different Person
                  </Button>
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleConfirmCheckIn}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>{isLoading ? 'Checking In...' : 'Quick Check-In'}</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-center mt-8">
            <Button
              variant="secondary"
              size="lg"
              onClick={onBack}
            >
              Back to Options
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}