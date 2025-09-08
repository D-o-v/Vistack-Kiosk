# Vistack-Kiosk

## Enhanced Visitor Management Kiosk

A modern, responsive visitor check-in kiosk application with advanced scanning capabilities and clean user interface.

### ✨ Features

#### 🎯 Two-Card Check-in System
- **Check-in with Access Code**: For returning visitors with existing access codes
- **Check-in without Access Code**: For new visitors or those without codes

#### 🔍 Multi-Modal Scanner
- **QR Code Scanning**: Quick check-in with QR codes
- **Face Recognition**: Biometric authentication (simulated)
- **Fingerprint Scanner**: Touch-based authentication (simulated)

#### 👤 Smart User Flow
- **Returning Visitors**: Automatic profile display with access code generation
- **New Visitors**: Streamlined registration process
- **Profile Management**: Clean profile display with QR code generation

#### 📱 Responsive Design
- **Mobile Optimized**: Touch-friendly interface for tablets and phones
- **Desktop Ready**: Large screen kiosk support
- **Cross-Platform**: Works on all modern devices

#### 🎨 Modern UI/UX
- **Clean Design**: Minimalist, professional interface
- **Smooth Animations**: Framer Motion powered transitions
- **Accessibility**: WCAG compliant design patterns
- **Touch Optimized**: Large buttons and touch targets

### 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Webcam** - Camera integration
- **QR Code Libraries** - QR generation and scanning
- **Vite** - Fast build tool

### 📋 User Journey

1. **Welcome Screen**: Choose check-in method
2. **Access Code Path**: Enter existing code → Profile display → Check-in
3. **No Code Path**: Enter email/name → Profile found OR Registration → Check-in
4. **Scanner Path**: Choose scan type → Scan → Check-in
5. **Confirmation**: Display check-in success with details

### 🔧 Configuration

The application supports various configuration options:

- **Scanner Types**: Enable/disable different scanning methods
- **Registration Fields**: Customize required visitor information
- **Branding**: Update colors, logos, and messaging
- **Backend Integration**: Connect to your visitor management API

### 🎯 Use Cases

- **Corporate Offices**: Employee and visitor check-in
- **Healthcare Facilities**: Patient and visitor registration
- **Educational Institutions**: Student and visitor management
- **Event Venues**: Attendee check-in and registration
- **Government Buildings**: Secure visitor processing

### 🔒 Security Features

- **Data Validation**: Input sanitization and validation
- **Secure Storage**: Encrypted visitor data handling
- **Access Control**: Role-based permissions
- **Audit Trail**: Complete check-in/out logging

### 📱 Mobile Support

- **iOS Safari**: Full compatibility
- **Android Chrome**: Optimized performance
- **Tablet Modes**: Landscape and portrait support
- **PWA Ready**: Progressive Web App capabilities
