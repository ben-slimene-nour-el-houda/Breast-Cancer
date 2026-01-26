import React, { useState } from 'react';
import { Activity, ChevronLeft, Mail, Lock } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const [step, setStep] = useState<'email' | 'code' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('code');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('reset');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Login
        </button>

        <div className="flex items-center gap-2 mb-8 justify-center">
          <Activity className="w-8 h-8 text-[#9333EA]" />
          <span className="text-xl font-bold text-gray-900">Tawhida</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {step === 'email' && (
            <>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mail className="w-6 h-6 text-[#9333EA]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Forgot Password?</h2>
              <p className="text-gray-600 mb-6 text-center">
                Enter your email address and we'll send you a verification code
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" className="w-full">
                  Send Verification Code
                </Button>
              </form>
            </>
          )}

          {step === 'code' && (
            <>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mail className="w-6 h-6 text-[#9333EA]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verify Your Email</h2>
              <p className="text-gray-600 mb-6 text-center">
                We sent a 6-digit code to {email}
              </p>
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <Input
                  label="Verification Code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <Button type="submit" variant="primary" className="w-full">
                  Verify Code
                </Button>
                <button
                  type="button"
                  className="w-full text-sm text-[#9333EA] hover:text-[#7C3AED]"
                >
                  Resend Code
                </button>
              </form>
            </>
          )}

          {step === 'reset' && (
            <>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Lock className="w-6 h-6 text-[#9333EA]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Reset Password</h2>
              <p className="text-gray-600 mb-6 text-center">
                Enter your new password
              </p>
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" className="w-full">
                  Reset Password
                </Button>
              </form>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Password Reset!</h2>
              <p className="text-gray-600 mb-6 text-center">
                Your password has been successfully reset
              </p>
              <Button onClick={onBack} variant="primary" className="w-full">
                Back to Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
