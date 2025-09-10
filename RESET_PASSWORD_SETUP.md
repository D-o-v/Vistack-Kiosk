# Reset Password Setup Guide

## Issue Description
The reset password emails are currently generating invalid URLs like:
```
http:///reset-password?token=...&email=...
```

Instead of the correct format:
```
http://checkin.vistacks.com/reset-password.html?token=...&email=...
```

## Frontend Solution (Completed)

### 1. Enhanced Login Screen
- ✅ Added "Forgot Password?" link
- ✅ Added password visibility toggle
- ✅ Improved UI/UX with better animations and styling

### 2. Forgot Password Page
- ✅ Clean, modern design matching login page
- ✅ Email validation and submission
- ✅ Success confirmation with email display
- ✅ Error handling and user feedback

### 3. Reset Password Page
- ✅ Password strength indicator
- ✅ Password confirmation matching
- ✅ Secure password input with visibility toggle
- ✅ Success confirmation and auto-redirect

### 4. Routing System
- ✅ URL parameter handling for reset tokens
- ✅ Standalone reset-password.html for email links
- ✅ Proper redirect flow from email to main app
- ✅ Test page for debugging reset flow

## Backend Configuration Required

### 1. Email Template Configuration
The backend needs to be configured to generate proper reset password URLs. Update the email template or configuration to use:

```
http://checkin.vistacks.com/reset-password.html?token={RESET_TOKEN}&email={USER_EMAIL}
```

### 2. Environment Variables
Ensure the backend has the correct base URL configured:

```env
APP_URL=http://checkin.vistacks.com
FRONTEND_URL=http://checkin.vistacks.com
RESET_PASSWORD_URL=http://checkin.vistacks.com/reset-password.html
```

### 3. Laravel Configuration (if using Laravel)
In `config/app.php`:
```php
'url' => env('APP_URL', 'http://checkin.vistacks.com'),
```

In the password reset notification:
```php
// In your ResetPassword notification class
public function toMail($notifiable)
{
    $resetUrl = config('app.url') . '/reset-password.html?' . http_build_query([
        'token' => $this->token,
        'email' => $notifiable->getEmailForPasswordReset(),
    ]);

    return (new MailMessage)
        ->subject('Reset Password Notification')
        ->line('You are receiving this email because we received a password reset request for your account.')
        ->action('Reset Password', $resetUrl)
        ->line('If you did not request a password reset, no further action is required.');
}
```

## Testing the Flow

### 1. Local Testing
Visit: `http://localhost:5173/test-reset.html`

This page provides test links to verify the reset password flow works correctly.

### 2. Production Testing
1. Deploy the frontend with the new reset-password.html file
2. Configure backend to generate correct URLs
3. Test forgot password flow end-to-end
4. Verify email links work correctly

## File Structure
```
public/
├── reset-password.html     # Standalone page for email links
├── test-reset.html        # Test page for debugging
└── index.html            # Main app entry point

src/
├── components/
│   ├── auth/
│   │   ├── LoginPage.tsx          # Enhanced login with forgot password
│   │   ├── ForgotPasswordPage.tsx # Forgot password form
│   │   ├── ResetPasswordPage.tsx  # Reset password form
│   │   └── index.ts              # Auth components exports
│   └── Router.tsx               # Simple routing for reset password
└── App.tsx                     # Main app with reset password handling
```

## API Endpoints Used
- `POST /api/auth/forgot-password` - Send reset email
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/login` - Login after password reset

## Security Features
- ✅ Token validation
- ✅ Email verification
- ✅ Password strength requirements
- ✅ Secure password input handling
- ✅ Proper error messages without exposing sensitive info
- ✅ Auto-redirect after successful reset

## Next Steps
1. **Backend Team**: Update email configuration to generate correct URLs
2. **Testing**: Test the complete flow once backend is updated
3. **Deployment**: Deploy both frontend and backend changes together
4. **Monitoring**: Monitor reset password success rates and user feedback