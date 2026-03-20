import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormInput } from './hb/common/Form';

interface ChangePasswordProps {
  onPasswordChanged?: () => void; // Callback for logout after password change
}

export default function ChangePassword({ onPasswordChanged }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Password validation rules
  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle form validation
  const validateForm = (): boolean => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required.';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = 'Password does not meet security requirements.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password change
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation - check if current password is correct
      if (currentPassword !== 'admin123') {
        toast.error('Current password is incorrect.');
        setIsLoading(false);
        return;
      }

      toast.success('Password updated successfully!');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Show logout message and redirect
      setTimeout(() => {
        toast.info('Please log in again with your new password');
        onPasswordChanged?.();
      }, 1500);
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    toast.info('Changes cancelled');
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
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-2xl mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Change Password"
          breadcrumbs={[
            { label: 'Account', href: '#' },
            { label: 'Change Password', current: true },
          ]}
        />

        {/* CHANGE PASSWORD FORM */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-neutral-50 dark:bg-neutral-900 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Update Your Password
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              After changing your password, you will be logged out and need to sign in again
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Current Password */}
            <div>
              <FormLabel htmlFor="currentPassword" required>
                Current Password
              </FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                </div>
                <FormInput
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setErrors({ ...errors, currentPassword: undefined });
                  }}
                  placeholder="Enter current password"
                  className="pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5 text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-200 dark:border-neutral-800" />

            {/* New Password */}
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

            {/* Confirm New Password */}
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

            {/* Security Notice */}
            <div className="bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
              <p className="text-sm text-warning-800 dark:text-warning-200">
                <strong>Important:</strong> After successfully changing your password, you will be automatically logged out 
                and redirected to the login page. Please use your new password to sign in again.
              </p>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="bg-neutral-50 dark:bg-neutral-900 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
            <SecondaryButton
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </PrimaryButton>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
          <p className="text-sm text-primary-800 dark:text-primary-200">
            <strong>Demo:</strong> Current password is <code className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900 rounded">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
