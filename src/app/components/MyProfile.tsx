import { useState } from 'react';
import { User, Mail, Phone, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormInput } from './hb/common/Form';

export default function MyProfile() {
  const [fullName, setFullName] = useState('John Doe');
  const [email] = useState('admin@example.com'); // Read-only
  const [mobileNumber, setMobileNumber] = useState('+1 234 567 8900');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; mobileNumber?: string }>({});

  // Original values for cancel functionality
  const [originalValues] = useState({
    fullName: 'John Doe',
    mobileNumber: '+1 234 567 8900',
    profilePicture: null,
  });

  // Validate mobile number
  const validateMobileNumber = (mobile: string): boolean => {
    if (!mobile) return true; // Optional field
    // Simple validation for international format
    const mobileRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ''));
  };

  // Handle form validation
  const validateForm = (): boolean => {
    const newErrors: { fullName?: string; mobileNumber?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (mobileNumber && !validateMobileNumber(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid mobile number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file.');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB.');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFullName(originalValues.fullName);
    setMobileNumber(originalValues.mobileNumber);
    setProfilePicture(originalValues.profilePicture);
    setErrors({});
    toast.info('Changes cancelled');
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-4xl mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="My Profile"
          breadcrumbs={[
            { label: 'Account', href: '#' },
            { label: 'My Profile', current: true },
          ]}
        />

        {/* PROFILE CONTENT */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-neutral-50 dark:bg-neutral-900 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Profile Information
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Update your personal information and profile picture
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Profile Picture */}
            <div>
              <FormLabel>Profile Picture</FormLabel>
              <div className="flex items-center gap-6 mt-2">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  {profilePicture && (
                    <button
                      type="button"
                      onClick={() => setProfilePicture(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-error-600 dark:bg-error-500 text-white rounded-full flex items-center justify-center hover:bg-error-700 dark:hover:bg-error-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Upload Button */}
                <div>
                  <label htmlFor="profilePicture" className="cursor-pointer">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </div>
                  </label>
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    JPG, PNG or GIF (max. 2MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <FormLabel htmlFor="fullName" required>
                Full Name
              </FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                </div>
                <FormInput
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrors({ ...errors, fullName: undefined });
                  }}
                  placeholder="Enter your full name"
                  className="pl-10"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <FormLabel htmlFor="email">
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
                  disabled
                  className="pl-10 bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Email address cannot be changed
              </p>
            </div>

            {/* Mobile Number */}
            <div>
              <FormLabel htmlFor="mobileNumber">
                Mobile Number
              </FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                </div>
                <FormInput
                  id="mobileNumber"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    setErrors({ ...errors, mobileNumber: undefined });
                  }}
                  placeholder="Enter your mobile number"
                  className="pl-10"
                />
              </div>
              {errors.mobileNumber && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.mobileNumber}
                </p>
              )}
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Optional field
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-neutral-50 dark:bg-neutral-900 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
            <SecondaryButton
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
