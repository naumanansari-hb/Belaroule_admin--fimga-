import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onForgotPassword: () => void;
}

export default function Login({ onLogin, onForgotPassword }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check for missing fields
    if (!formData.email && !formData.password) {
      newErrors.general = 'Required fields are missing.';
      setErrors(newErrors);
      return false;
    }

    if (!formData.email) {
      newErrors.email = 'Email address is required.';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await onLogin(formData.email, formData.password);
      // Success handling is done in AuthContext (toast + redirect)
    } catch (error: any) {
      // Display error message from auth service
      setErrors({ general: error.message || 'An error occurred during login.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 dark:bg-primary-500 mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            Admin Panel Login
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error Message */}
            {errors.general && (
              <div className="flex items-start gap-2 p-3 bg-error-100 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error-600 dark:text-error-400">
                  {errors.general}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Email Address <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  id="email"
                  type="text"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: '', general: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-950 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? 'border-error-300 dark:border-error-700 focus:ring-error-500/20 focus:border-error-500'
                      : 'border-neutral-300 dark:border-neutral-700 focus:ring-primary-500/20 focus:border-primary-500'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-error-600 dark:text-error-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Password <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: '', general: '' });
                  }}
                  className={`w-full pl-10 pr-12 py-2.5 bg-white dark:bg-neutral-950 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.password
                      ? 'border-error-300 dark:border-error-700 focus:ring-error-500/20 focus:border-error-500'
                      : 'border-neutral-300 dark:border-neutral-700 focus:ring-primary-500/20 focus:border-primary-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-error-600 dark:text-error-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 dark:bg-primary-500 dark:hover:bg-primary-600 dark:disabled:bg-primary-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-6">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            For security reasons, your session will expire after 30 minutes of inactivity.
          </p>
        </div>

        {/* Test Credentials (Development Only) */}
        <div className="mt-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              Test Credentials (Development)
            </p>
            <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
              Demo
            </span>
          </div>
          
          <div className="space-y-3">
            {/* Super Admin */}
            <div className="p-3 bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-success-700 dark:text-success-300">
                  ✓ Super Admin (Full Access)
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium">Email:</span> admin@example.com
                </p>
                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium">Password:</span> Admin@123
                </p>
              </div>
            </div>

            {/* Sub Admin */}
            <div className="p-3 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded">
              <p className="font-medium text-neutral-900 dark:text-white text-sm mb-1">
                Sub Admin Account
              </p>
              <div className="space-y-0.5 text-xs">
                <p className="text-neutral-600 dark:text-neutral-400">
                  <span className="font-medium">Email:</span> subadmin@example.com
                </p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  <span className="font-medium">Password:</span> SubAdmin@123
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  Limited permissions (Sub Admin role)
                </p>
              </div>
            </div>

            {/* Error Test Accounts */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Test Error Scenarios:
              </p>
              <div className="space-y-2">
                <div className="p-2.5 bg-error-100 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded">
                  <p className="text-xs font-medium text-error-900 dark:text-error-100 mb-1">
                    Inactive Account Error:
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    inactive@example.com / Inactive@123
                  </p>
                </div>
                <div className="p-2.5 bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded">
                  <p className="text-xs font-medium text-warning-900 dark:text-warning-100 mb-1">
                    Locked Account Error:
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    locked@example.com / Locked@123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}