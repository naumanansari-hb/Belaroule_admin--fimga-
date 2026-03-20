import { useState } from 'react';
import { ArrowLeft, Lock, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import { FormLabel, FormInput } from '../hb/common/Form';
import { PrimaryButton, SecondaryButton } from '../hb/listing';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form validation
  const validateForm = (): boolean => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = 'Required fields are missing.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password reset request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation - check if email exists
      if (email === 'notfound@example.com') {
        toast.error('Email does not exist.');
      } else {
        setEmailSent(true);
        toast.success('Password reset link sent to your email!');
      }
    } catch (error) {
      toast.error('Unable to process request. Please try again.');
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
            Forgot Password
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {emailSent
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-8">
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      setErrors({ email: undefined });
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

              {/* Submit Button */}
              <PrimaryButton
                type="submit"
                icon={Send}
                iconPosition="right"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </PrimaryButton>

              {/* Back to Login */}
              <SecondaryButton
                type="button"
                onClick={onBackToLogin}
                className="w-full gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </SecondaryButton>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-100 dark:bg-success-900 mb-4">
                  <Send className="w-8 h-8 text-success-600 dark:text-success-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                  Email Sent Successfully
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  We've sent a password reset link to:
                </p>
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {email}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                  Please check your inbox and follow the instructions to reset your password.
                  The link will expire in 24 hours.
                </p>
              </div>

              {/* Back to Login */}
              <SecondaryButton
                type="button"
                onClick={onBackToLogin}
                className="w-full gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </SecondaryButton>

              {/* Resend Link */}
              <button
                type="button"
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}
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