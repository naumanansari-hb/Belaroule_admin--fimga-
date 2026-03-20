import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { FormLabel, FormInput } from '../hb/common/Form';
import { PrimaryButton, SecondaryButton } from '../hb/listing';

interface ResetPasswordProps {
  onBackToLogin: () => void;
  resetToken?: string; // In real app, this would come from URL params
}

export default function ResetPassword({ onBackToLogin, resetToken = 'valid-token' }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

  // Password validation rules
  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle form validation
  const validateForm = (): boolean => {
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword) {
      newErrors.newPassword = 'Required fields are missing.';
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = 'Password does not meet security requirements.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Required fields are missing.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password reset
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock token validation
      if (resetToken === 'expired-token') {
        toast.error('Reset link has expired.');
      } else if (resetToken === 'invalid-token') {
        toast.error('Invalid reset token.');
      } else {
        setResetSuccess(true);
        toast.success('Password reset successfully!');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          onBackToLogin();
        }, 2000);
      }
    } catch (error) {
      toast.error('Unable to process request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string): { label: string; color: string; width: string } => {
    if (!password) return { label: '', color: '', width: '0%' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'bg-error-500', width: '33%' };
    if (strength <= 3) return { label: 'Medium', color: 'bg-warning-500', width: '66%' };
    return { label: 'Strong', color: 'bg-success-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 dark:bg-primary-500 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {resetSuccess ? 'Your password has been reset' : 'Create a new password for your account'}
          </p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-8">
          {!resetSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <FormLabel htmlFor="newPassword" required>
                  New Password
                </FormLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                  </div>
                  <FormInput
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({ ...errors, newPassword: undefined });
                    }}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5 text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        Password Strength:
                      </span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.label === 'Strong' ? 'text-success-600 dark:text-success-400' :
                        passwordStrength.label === 'Medium' ? 'text-warning-600 dark:text-warning-400' :
                        'text-error-600 dark:text-error-400'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                  </div>
                )}

                {errors.newPassword && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.newPassword}
                  </p>
                )}

                {/* Password Requirements */}
                <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                  <p className="font-medium">Password must contain:</p>
                  <ul className="list-disc list-inside space-y-0.5 pl-2">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character (@$!%*?&)</li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <FormLabel htmlFor="confirmPassword" required>
                  Confirm New Password
                </FormLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                  </div>
                  <FormInput
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <PrimaryButton
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
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
                  <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                  Password Reset Successfully
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                  Redirecting to login page...
                </p>
              </div>

              {/* Back to Login */}
              <SecondaryButton
                type="button"
                onClick={onBackToLogin}
                className="w-full gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go to Login
              </SecondaryButton>
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
