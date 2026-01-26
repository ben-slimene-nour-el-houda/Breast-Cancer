import React, { useState } from 'react';
import { Activity, ChevronLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input, Checkbox } from '@/app/components/ui/input';
import { useAuth } from '@/app/context/AuthContext';

interface RegisterScreenProps {
  onBack: () => void;
}

export function RegisterScreen({ onBack }: RegisterScreenProps) {
  const { register } = useAuth();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    medicalId: '',
    licenseNumber: '',
    specialization: '',
    hospital: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      register(formData, role);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="w-full max-w-2xl mx-auto p-8">
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

        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Account</h2>
        <p className="text-gray-600 mb-8 text-center">Join our AI-powered pathology platform</p>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-[#9333EA] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className="text-sm font-medium">Account Info</span>
          </div>
          <div className="w-16 h-1 bg-gray-200">
            <div className={`h-full bg-[#9333EA] transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-[#9333EA] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className="text-sm font-medium">
              {role === 'patient' ? 'Medical Info' : 'Professional Info'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Role Selection */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setRole('patient');
                setStep(1);
              }}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                role === 'patient'
                  ? 'bg-white text-[#9333EA] shadow-sm font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Patient Registration
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('doctor');
                setStep(1);
              }}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                role === 'doctor'
                  ? 'bg-white text-[#2563EB] shadow-sm font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Doctor Registration
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                />
              </>
            ) : (
              <>
                {role === 'patient' ? (
                  <>
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleChange('dob', e.target.value)}
                      required
                    />
                    <Input
                      label="Medical ID (Optional)"
                      type="text"
                      placeholder="MRN-2024-001"
                      value={formData.medicalId}
                      onChange={(e) => handleChange('medicalId', e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Medical License Number"
                      type="text"
                      placeholder="MD-2024-789"
                      value={formData.licenseNumber}
                      onChange={(e) => handleChange('licenseNumber', e.target.value)}
                      required
                    />
                    <Input
                      label="Specialization"
                      type="text"
                      placeholder="Oncology"
                      value={formData.specialization}
                      onChange={(e) => handleChange('specialization', e.target.value)}
                      required
                    />
                    <Input
                      label="Hospital/Institution"
                      type="text"
                      placeholder="General Hospital"
                      value={formData.hospital}
                      onChange={(e) => handleChange('hospital', e.target.value)}
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required
                    />
                  </>
                )}
                <div className="pt-4">
                  <Checkbox
                    label="I agree to the Terms of Service and Privacy Policy"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                </div>
              </>
            )}

            <div className="flex gap-4 pt-4">
              {step === 2 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              <Button
                type="submit"
                variant={role === 'doctor' ? 'blue' : 'primary'}
                className="flex-1"
                disabled={step === 2 && !agreedToTerms}
              >
                {step === 1 ? 'Next' : 'Create Account'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
