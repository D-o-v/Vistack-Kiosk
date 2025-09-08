export interface Visitor {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  guestType?: 'business' | 'interview' | 'delivery' | 'contractor' | 'personal' | 'other';
  purpose?: string;
  hostName?: string;
  hostDepartment?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  photo?: string;
  badgeNumber?: string;
  status?: 'checked-in' | 'checked-out' | 'expired' | 'pending' | 'approved';
  emergencyContact?: string;
  notes?: string;
  visitCount?: number;
  employeeId?: string;
  invitationCode?: string;
  appointmentCode?: string;
  visitor_tag?: string;
  checkin_method?: string;
  created_at?: string;
  image_url?: string;
  document_url?: string;
  signature_url?: string;
}

export interface Appointment {
  id: string;
  appointmentCode: string;
  hostName: string;
  appointmentType: string;
  duration: number;
  date: Date;
  time: string;
  visitorInfo: VisitorInfo;
  price?: number;
  isPaid: boolean;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
}

export interface VisitorInfo {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
}

export interface CheckInSession {
  id: string;
  visitorId: string;
  method: 'new-visitor' | 'returning-visitor' | 'invited-guest' | 'appointment' | 'face-scan' | 'employee';
  location: string;
  deviceId: string;
  badgeIssued: boolean;
  hostNotified: boolean;
}

export interface EmergencyContact {
  type: 'emergency' | 'security' | 'reception';
  number: string;
  label: string;
  description: string;
}

export interface NetworkStatus {
  isOnline: boolean;
  lastCheck: Date;
  latency?: number;
}