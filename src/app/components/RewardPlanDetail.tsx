import { useState } from 'react';
import { ArrowLeft, Gift } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import {
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
} from './hb/common/Form';
import { toast } from 'sonner';

interface RewardPlan {
  id: string;
  name: string;
  coinsCount: number;
  price: number;
  currency: string;
  displayOrder: number;
  description: string;
  status: 'active' | 'inactive';
  createdDate: string;
  lastModifiedDate: string;
  productIdentifier: string;
}

interface RewardPlanDetailProps {
  plan: RewardPlan;
  allPlans: RewardPlan[];
  isCreating: boolean;
  onBack: () => void;
  onSave: (plan: RewardPlan) => void;
}

export default function RewardPlanDetail({
  plan,
  allPlans,
  isCreating,
  onBack,
  onSave,
}: RewardPlanDetailProps) {
  const [formData, setFormData] = useState({
    name: plan.name || '',
    coinsCount: plan.coinsCount,
    price: plan.price,
    currency: plan.currency,
    displayOrder: plan.displayOrder,
    description: plan.description,
    status: plan.status,
    productIdentifier: plan.productIdentifier,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format date helper
  const formatDateTime = (dateString: string) => {
    if (dateString.includes(':')) {
      const [datePart, timePart] = dateString.split(' ');
      const date = new Date(datePart);
      const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return `${formattedDate} ${timePart}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Plan Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required.';
    }

    // Coins Count validation
    if (!formData.coinsCount || formData.coinsCount <= 0) {
      newErrors.coinsCount = formData.coinsCount === 0 || !formData.coinsCount 
        ? 'Coin count is required.' 
        : 'Coins count must be a positive number.';
    }

    // Price validation
    if (!formData.price || formData.price <= 0) {
      newErrors.price = formData.price === 0 || !formData.price
        ? 'Please enter a valid price.'
        : 'The price must be greater than zero.';
    }

    // Display Order validation
    if (!formData.displayOrder || formData.displayOrder <= 0) {
      newErrors.displayOrder = formData.displayOrder === 0 || !formData.displayOrder
        ? 'Display order is required.'
        : 'Display order must be a positive number.';
    }

    // Product Identifier validation
    if (!formData.productIdentifier.trim()) {
      newErrors.productIdentifier = 'Product identifier is required.';
    } else if (/\s/.test(formData.productIdentifier)) {
      newErrors.productIdentifier = 'Product identifier cannot contain spaces.';
    }

    // Check for duplicate plan (same coin count)
    const isDuplicate = allPlans.some(
      p => p.id !== plan.id && p.coinsCount === formData.coinsCount
    );
    if (isDuplicate) {
      newErrors.coinsCount = 'A reward plan with the same coin count already exists.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5); // HH:MM

    onSave({
      ...plan,
      name: formData.name,
      coinsCount: formData.coinsCount,
      price: formData.price,
      currency: formData.currency,
      displayOrder: formData.displayOrder,
      description: formData.description,
      status: formData.status,
      lastModifiedDate: `${dateStr} ${timeStr}`,
      productIdentifier: formData.productIdentifier,
    });
  };

  // Handle cancel
  const handleCancel = () => {
    onBack();
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reward Plans List
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {isCreating ? 'Add Reward Plan' : 'Edit Reward Plan'}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {isCreating
                  ? 'Create a new reward coin plan for in-app purchases.'
                  : 'Update reward plan details. Only active plans appear in the mobile application.'}
              </p>
            </div>
          </div>
        </div>

        {/* Reward Plan Detail Card */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          {/* Read-only Section (only show when editing) */}
          {!isCreating && (
            <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
                View Section (Read-only)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Plan ID
                  </label>
                  <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {plan.id}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Created Date
                  </label>
                  <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {formatDateTime(plan.createdDate)}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Last Modified Date
                  </label>
                  <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {formatDateTime(plan.lastModifiedDate)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Editable Section */}
          <div className="px-6 py-6">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
              {isCreating ? 'Reward Plan Details' : 'Editable Section'}
            </h2>
            <FormSection>
              <FormField>
                <FormLabel htmlFor="name" required>
                  Plan Name
                </FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter plan name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) {
                      setErrors({ ...errors, name: '' });
                    }
                  }}
                  className={errors.name ? 'border-error-500' : ''}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                    {errors.name}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Display name shown to users in the mobile app.
                </p>
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel htmlFor="coinsCount" required>
                    Coins Count
                  </FormLabel>
                  <FormInput
                    id="coinsCount"
                    type="number"
                    placeholder="Enter coins count"
                    value={formData.coinsCount || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setFormData({ ...formData, coinsCount: value });
                      if (errors.coinsCount) {
                        setErrors({ ...errors, coinsCount: '' });
                      }
                    }}
                    className={errors.coinsCount ? 'border-error-500' : ''}
                    min="1"
                  />
                  {errors.coinsCount && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {errors.coinsCount}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Positive integer. Must be unique.
                  </p>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="price" required>
                    Price
                  </FormLabel>
                  <FormInput
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    value={formData.price || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, price: value });
                      if (errors.price) {
                        setErrors({ ...errors, price: '' });
                      }
                    }}
                    className={errors.price ? 'border-error-500' : ''}
                    min="0.01"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {errors.price}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Must be greater than zero.
                  </p>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel htmlFor="currency">
                    Currency
                  </FormLabel>
                  <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-500 dark:text-neutral-400">
                    {formData.currency}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    System-defined currency code.
                  </p>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="displayOrder" required>
                    Display Order
                  </FormLabel>
                  <FormInput
                    id="displayOrder"
                    type="number"
                    placeholder="Enter display order"
                    value={formData.displayOrder || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setFormData({ ...formData, displayOrder: value });
                      if (errors.displayOrder) {
                        setErrors({ ...errors, displayOrder: '' });
                      }
                    }}
                    className={errors.displayOrder ? 'border-error-500' : ''}
                    min="1"
                  />
                  {errors.displayOrder && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {errors.displayOrder}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Controls order shown in mobile app.
                  </p>
                </FormField>
              </div>

              <FormField>
                <FormLabel htmlFor="description">
                  Description
                </FormLabel>
                <FormTextarea
                  id="description"
                  placeholder="Enter plan description (optional)"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                  }}
                  rows={3}
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Optional. Displayed to users in the mobile app.
                </p>
              </FormField>

              <FormField>
                <FormLabel htmlFor="status" required>
                  Status
                </FormLabel>
                <FormSelect
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FormSelect>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Only active plans are exposed to the mobile application.
                </p>
              </FormField>

              <FormField>
                <FormLabel htmlFor="productIdentifier" required>
                  Product Identifier
                </FormLabel>
                <FormInput
                  id="productIdentifier"
                  type="text"
                  placeholder="Enter product identifier"
                  value={formData.productIdentifier}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, ''); // Preventive: no spaces
                    setFormData({ ...formData, productIdentifier: value });
                    if (errors.productIdentifier) {
                      setErrors({ ...errors, productIdentifier: '' });
                    }
                  }}
                  maxLength={10}
                />
                {errors.productIdentifier && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                    {errors.productIdentifier}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Unique backend identifier (no spaces). Max 10 characters.
                </p>
              </FormField>
            </FormSection>
          </div>

          {/* Engagement Tier Bonus Breakdown Section */}
          <div className="px-6 py-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
              Engagement Tier Bonus Breakdown (Read-Only)
            </h2>
            
            <div className="mb-6 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <div className="w-4 h-4 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400">i</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-primary-800 dark:text-primary-200 leading-relaxed">
                    Bella Coins uses an engagement-based bonus model. When a user purchases a coin pack, they receive bonus coins on top of the base pack coins depending on their current 7-day engagement score. The bonus percentage per tier is configurable from <strong>App Configurations</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Tier Name</th>
                    <th className="px-4 py-2.5 font-medium">Score</th>
                    <th className="px-4 py-2.5 font-medium">Bonus %</th>
                    <th className="px-4 py-2.5 font-medium">Bonus Coins</th>
                    <th className="px-4 py-2.5 font-medium">Total Coins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {[
                    { tier: 'Tier 0', score: '0 – 20', bonus: 0 },
                    { tier: 'Tier 1', score: '21 – 40', bonus: 5 },
                    { tier: 'Tier 2', score: '41 – 70', bonus: 10 },
                    { tier: 'Tier 3', score: '71 – 85', bonus: 15 },
                    { tier: 'Tier 4', score: '86 – 100', bonus: 20 },
                  ].map((row) => {
                    const bonusCoins = Math.floor(formData.coinsCount * (row.bonus / 100));
                    const totalCoins = formData.coinsCount + bonusCoins;
                    return (
                      <tr key={row.tier} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="px-4 py-2.5 text-neutral-900 dark:text-white font-medium">{row.tier}</td>
                        <td className="px-4 py-2.5 text-neutral-600 dark:text-neutral-400">{row.score}</td>
                        <td className="px-4 py-2.5 text-success-600 dark:text-success-400 font-medium">{row.bonus}%</td>
                        <td className="px-4 py-2.5 text-neutral-900 dark:text-white">{bonusCoins}</td>
                        <td className="px-4 py-2.5 text-primary-600 dark:text-primary-400 font-bold">{totalCoins}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 italic">
              * Recalculates automatically based on Coins Count. Bonus coins are rounded down.
            </p>
          </div>

          {/* Actions Footer */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-end gap-3">
            <SecondaryButton
              onClick={handleCancel}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={handleSave}
              size="sm"
            >
              {isCreating ? 'Create' : 'Save'}
            </PrimaryButton>
          </div>
        </div>

        {/* Business Rules Info */}
        <div className="mt-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Business Rules
          </h3>
          <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
            <li>• Only <strong>Active</strong> plans are exposed to the mobile application</li>
            <li>• Inactive plans are hidden from users but visible to admins</li>
            <li>• Display Order controls the order shown in the mobile app</li>
            <li>• Duplicate plans with the same coin count for the same platform are not allowed</li>
            <li>• Changes do not affect historical purchases</li>
            <li>• All fields are mandatory except Description</li>
          </ul>
        </div>
      </div>
    </div>
  );
}