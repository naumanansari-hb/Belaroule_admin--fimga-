import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { FormLabel, FormInput } from '../hb/common/Form';
import { PrimaryButton, SecondaryButton } from '../hb/listing';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void;
}

export default function Login({ onLogin, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form validation
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Required fields are missing.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Required fields are missing.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      // Mock validation - in real app this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock different scenarios for demo
      if (email === 'inactive@example.com') {
        toast.error('Your account is inactive.');
      } else if (email === 'locked@example.com') {
        toast.error('Your account is locked. Please reset your password.');
      } else if (email === 'admin@example.com' && password === 'admin123') {
        toast.success('Login successful!');
        onLogin(email, password);
      } else {
        toast.error('Invalid email or password.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 dark:bg-primary-500 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            BellaRoules Admin
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Sign in to access your admin panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <FormLabel htmlFor="email" required>
                Email Address
              </FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                </div>
                <FormInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="Enter your email"
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <FormLabel htmlFor="password" required>
                Password
              </FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                </div>
                <FormInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <PrimaryButton
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </PrimaryButton>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mb-2">
              Demo Credentials
            </p>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
              <p><strong>Email:</strong> admin@example.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            © 2024 BellaRoules. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
