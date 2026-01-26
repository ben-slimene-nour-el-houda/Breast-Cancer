import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/input';
import { useAuth } from '@/app/context/AuthContext';

interface LoginScreenProps {
  onForgotPassword: () => void;
  onRegister: () => void;
}

export function LoginScreen({ onForgotPassword, onRegister }: LoginScreenProps) {
  const { login } = useAuth();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, role);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#9333EA] to-[#EC4899] p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-10 h-10" />
            <span className="text-2xl font-bold">Tawhida</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Supporting Your Health Journey</h1>
          <p className="text-lg text-purple-100">
            Helping you understand your breast health with care and clarity
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">✓</div>
            <div>
              <h3 className="font-semibold">Complete Health Picture</h3>
              <p className="text-purple-100 text-sm">Looking at your health from multiple angles for the best guidance</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">✓</div>
            <div>
              <h3 className="font-semibold">Expert Medical Team</h3>
              <p className="text-purple-100 text-sm">Experienced doctors reviewing every result with you in mind</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">✓</div>
            <div>
              <h3 className="font-semibold">Your Privacy Matters</h3>
              <p className="text-purple-100 text-sm">Your information is safe and protected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Activity className="w-8 h-8 text-[#9333EA]" />
            <span className="text-xl font-bold text-gray-900">BreastCare AI</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-8">Sign in to access your account</p>

          {/* Role Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                role === 'patient'
                  ? 'bg-white text-[#9333EA] shadow-sm font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login as Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                role === 'doctor'
                  ? 'bg-white text-[#2563EB] shadow-sm font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login as Doctor
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-[#9333EA] hover:text-[#7C3AED] font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant={role === 'doctor' ? 'blue' : 'primary'}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onRegister}
              className="text-[#9333EA] hover:text-[#7C3AED] font-medium"
            >
              Register here
            </button>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              This platform is for medical professionals and authorized patients only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}