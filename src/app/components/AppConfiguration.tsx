import { useState } from 'react';
import { Settings, AlertCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import {
  FormModal,
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormFooter,
} from './hb/common/Form';
import { toast } from 'sonner';

export default function AppConfiguration() {
  const [savedData] = useState({
    ootdOption: 'limited' as 'limited' | 'unlimited',
    ootdLimit: '1',
    tryonOption: 'limited' as 'limited' | 'unlimited',
    tryonLimit: '1',
    targetWear: '2',
    activities: [
      { id: '1', activity: 'Login', weight: '5%', cap: '7' },
      { id: '2', activity: 'OOTD', weight: '10%', cap: '14' },
      { id: '3', activity: 'Try-On (HD + Downloads)', weight: '10%', cap: '10' },
      { id: '4', activity: 'Add New Wardrobe Item (Extraction)', weight: '15%', cap: '10' },
      { id: '5', activity: 'Update / Enrich Wardrobe Item', weight: '10%', cap: '15' },
      { id: '6', activity: 'Social', weight: '10%', cap: '20' },
      { id: '7', activity: 'Circular Intelligence', weight: '10%', cap: '' },
      { id: '8', activity: 'Purchases', weight: '10%', cap: '1' },
      { id: '9', activity: 'Current Wardrobe Quotient', weight: '10%', cap: '' },
      { id: '10', activity: 'Wardrobe Improvement Score', weight: '10%', cap: '' },
    ],
    tiers: [
      { id: '1', score: '0 – 20', tier: 'Tier 0', bonus: '0' },
      { id: '2', score: '21 – 40', tier: 'Tier 1', bonus: '5' },
      { id: '3', score: '41 – 70', tier: 'Tier 2', bonus: '10' },
      { id: '4', score: '71 – 85', tier: 'Tier 3', bonus: '15' },
      { id: '5', score: '86 – 100', tier: 'Tier 4', bonus: '20' },
    ],
    lastModifiedBy: 'Super Admin',
    lastModifiedDate: '18/02/2026 14:30',
  });

  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(savedData)));
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.ootdOption === 'limited') {
      const ootdLimitNum = parseInt(formData.ootdLimit);
      if (!formData.ootdLimit.trim() || isNaN(ootdLimitNum) || ootdLimitNum <= 0) {
        newErrors.ootdLimit = 'The limit value must be greater than 0.';
      }
    }

    if (formData.tryonOption === 'limited') {
      const tryonLimitNum = parseInt(formData.tryonLimit);
      if (!formData.tryonLimit.trim() || isNaN(tryonLimitNum) || tryonLimitNum <= 0) {
        newErrors.tryonLimit = 'The limit value must be greater than 0.';
      }
    }

    formData.activities.forEach((act: any) => {
      if (act.cap !== '') {
        const capNum = parseFloat(act.cap);
        if (isNaN(capNum) || capNum <= 0) {
          newErrors[`act_${act.id}`] = 'Cap value must be a positive number.';
        }
      }
    });

    let previousBonus = -1;
    let prevInvalid = false;
    formData.tiers.forEach((tier: any) => {
      const bonusNum = parseFloat(tier.bonus);
      if (isNaN(bonusNum) || bonusNum < 0) {
        newErrors[`tier_${tier.id}`] = 'Bonus percentage must be a non-negative number.';
        prevInvalid = true;
      } else if (bonusNum > 20) {
        newErrors[`tier_${tier.id}`] = 'Bonus percentage cannot exceed the maximum allowed limit of 20%.';
        prevInvalid = true;
      } else if (!prevInvalid && bonusNum < previousBonus) {
        newErrors[`tier_${tier.id}`] = 'Bonus percentage must be equal to or greater than the previous tier.';
      } else {
        previousBonus = bonusNum;
      }
    });

    const targetWearNum = parseFloat(formData.targetWear);
    if (!formData.targetWear.trim() || isNaN(targetWearNum) || targetWearNum <= 0) {
      newErrors.targetWear = 'Target Wear must be a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validateForm()) {
      setShowSaveModal(true);
    } else {
      toast.error('Failed to save configurations. Please try again.');
    }
  };

  const handleConfirmSave = () => {
    toast.success('App configurations saved successfully.');
    setShowSaveModal(false);
    // would update savedData here in real app
  };

  const handleDiscard = () => {
    setFormData(JSON.parse(JSON.stringify(savedData)));
    setErrors({});
  };

  const updateActivityCap = (id: string, value: string) => {
    setFormData({
      ...formData,
      activities: formData.activities.map((act: any) =>
        act.id === id ? { ...act, cap: value } : act
      ),
    });
    setErrors(prev => { const n = { ...prev }; delete n[`act_${id}`]; return n; });
  };

  const updateTierBonus = (id: string, value: string) => {
    setFormData({
      ...formData,
      tiers: formData.tiers.map((tier: any) =>
        tier.id === id ? { ...tier, bonus: value } : tier
      ),
    });
    setErrors(prev => { const n = { ...prev }; delete n[`tier_${id}`]; return n; });
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                App Configuration
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Manage usage limits, engagement models, and Circular Intelligence contexts.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Free OOTD Limit Configuration Section */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Free OOTD Limit Configuration
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
              <div className="space-y-4">
                <FormField>
                  <FormLabel htmlFor="ootdOption" required>Free OOTD Option</FormLabel>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ootdOption"
                        value="limited"
                        checked={formData.ootdOption === 'limited'}
                        onChange={(e) => {
                          setFormData({ ...formData, ootdOption: 'limited' });
                          setErrors({ ...errors, ootdLimit: '' });
                        }}
                        className="w-4 h-4 border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-900 dark:text-white">Limited</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ootdOption"
                        value="unlimited"
                        checked={formData.ootdOption === 'unlimited'}
                        onChange={(e) => {
                          setFormData({ ...formData, ootdOption: 'unlimited' });
                          setErrors({ ...errors, ootdLimit: '' });
                        }}
                        className="w-4 h-4 border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-900 dark:text-white">Unlimited</span>
                    </label>
                  </div>
                </FormField>

                {formData.ootdOption === 'limited' && (
                  <FormField>
                    <FormLabel htmlFor="ootdLimit" required>No. of OOTD Limit</FormLabel>
                    <FormInput
                      id="ootdLimit"
                      type="number"
                      min="1"
                      value={formData.ootdLimit}
                      onChange={(e) => {
                        setFormData({ ...formData, ootdLimit: e.target.value });
                        setErrors({ ...errors, ootdLimit: '' });
                      }}
                      placeholder="Enter limit"
                      className={errors.ootdLimit ? 'border-error-500' : ''}
                    />
                    {errors.ootdLimit && (
                      <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.ootdLimit}</p>
                    )}
                  </FormField>
                )}
              </div>
            </FormSection>
          </div>
        </div>

        {/* 2. Free Virtual Try-On Limit Configuration Section */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Free Virtual Try-On Limit Configuration
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
              <div className="space-y-4">
                <FormField>
                  <FormLabel htmlFor="tryonOption" required>Free Virtual Try-On Option</FormLabel>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tryonOption"
                        value="limited"
                        checked={formData.tryonOption === 'limited'}
                        onChange={(e) => {
                          setFormData({ ...formData, tryonOption: 'limited' });
                          setErrors({ ...errors, tryonLimit: '' });
                        }}
                        className="w-4 h-4 border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-900 dark:text-white">Limited</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tryonOption"
                        value="unlimited"
                        checked={formData.tryonOption === 'unlimited'}
                        onChange={(e) => {
                          setFormData({ ...formData, tryonOption: 'unlimited' });
                          setErrors({ ...errors, tryonLimit: '' });
                        }}
                        className="w-4 h-4 border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-900 dark:text-white">Unlimited</span>
                    </label>
                  </div>
                </FormField>

                {formData.tryonOption === 'limited' && (
                  <FormField>
                    <FormLabel htmlFor="tryonLimit" required>No. of Virtual Try-On Limit</FormLabel>
                    <FormInput
                      id="tryonLimit"
                      type="number"
                      min="1"
                      value={formData.tryonLimit}
                      onChange={(e) => {
                        setFormData({ ...formData, tryonLimit: e.target.value });
                        setErrors({ ...errors, tryonLimit: '' });
                      }}
                      placeholder="Enter limit"
                      className={errors.tryonLimit ? 'border-error-500' : ''}
                    />
                    {errors.tryonLimit && (
                      <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.tryonLimit}</p>
                    )}
                  </FormField>
                )}
              </div>
            </FormSection>
          </div>
        </div>

        {/* 3. Engagement Weight Model Configuration */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Engagement Weight Model Configuration
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white">
                <tr>
                  <th className="px-6 py-3 font-medium">Activity</th>
                  <th className="px-6 py-3 font-medium">Weight</th>
                  <th className="px-6 py-3 font-medium">Capped (In Days)</th>
                </tr>
              </thead>
              <tbody>
                {formData.activities.map((act: any) => (
                  <tr key={act.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="px-6 py-4">{act.activity}</td>
                    <td className="px-6 py-4">{act.weight}</td>
                    <td className="px-6 py-4">
                      {act.cap === '' ? (
                        <span className="text-neutral-400">— System Controlled —</span>
                      ) : (
                        <div>
                          <FormInput
                            type="number"
                            value={act.cap}
                            onChange={(e) => updateActivityCap(act.id, e.target.value)}
                            className={`max-w-[150px] ${errors[`act_${act.id}`] ? 'border-error-500' : ''}`}
                            placeholder="Cap limit"
                          />
                          {errors[`act_${act.id}`] && (
                            <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors[`act_${act.id}`]}</p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Engagement Tiers & Bonus % */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Engagement Tiers & Bonus %
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white">
                <tr>
                  <th className="px-6 py-3 font-medium">Score</th>
                  <th className="px-6 py-3 font-medium">Tier</th>
                  <th className="px-6 py-3 font-medium">Bonus on Coin Pack (%)</th>
                </tr>
              </thead>
              <tbody>
                {formData.tiers.map((tier: any) => (
                  <tr key={tier.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="px-6 py-4">{tier.score}</td>
                    <td className="px-6 py-4">{tier.tier}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FormInput
                          type="number"
                          value={tier.bonus}
                          onChange={(e) => updateTierBonus(tier.id, e.target.value)}
                          className={`max-w-[150px] ${errors[`tier_${tier.id}`] ? 'border-error-500' : ''}`}
                          placeholder="Bonus %"
                        />
                        <span className="text-neutral-500">%</span>
                      </div>
                      {errors[`tier_${tier.id}`] && (
                        <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors[`tier_${tier.id}`]}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Circular Intelligence Settings */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Circular Intelligence Settings
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
              <FormField>
                <FormLabel htmlFor="targetWear" required>Target Wear</FormLabel>
                <FormInput
                  id="targetWear"
                  type="number"
                  min="1"
                  value={formData.targetWear}
                  onChange={(e) => {
                    setFormData({ ...formData, targetWear: e.target.value });
                    setErrors({ ...errors, targetWear: '' });
                  }}
                  placeholder="Target Wear"
                  className={errors.targetWear ? 'border-error-500' : ''}
                />
                {errors.targetWear && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.targetWear}</p>
                )}
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Platform constant used in circular score normalization (wears per item per month)
                </p>
              </FormField>
            </FormSection>
          </div>
        </div>

        {/* Audit Information Section */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Audit Information
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel htmlFor="lastModifiedBy">Last Modified By</FormLabel>
                  <div className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm">
                    {savedData.lastModifiedBy}
                  </div>
                </FormField>
                <FormField>
                  <FormLabel htmlFor="lastModifiedDate">Last Modified Date</FormLabel>
                  <div className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm">
                    {savedData.lastModifiedDate}
                  </div>
                </FormField>
              </div>
            </FormSection>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <SecondaryButton onClick={handleDiscard}>
            Discard
          </SecondaryButton>
          <PrimaryButton onClick={handleSaveClick}>
            Save
          </PrimaryButton>
        </div>

        {/* Save Confirmation Modal */}
        <FormModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          title="Save Configuration"
          maxWidth="max-w-md"
        >
          <FormSection>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Save Configuration?
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  This will apply the configuration changes immediately to all users globally. Changes take effect right away with no approval flow.
                </p>
              </div>
            </div>
          </FormSection>

          <FormFooter>
            <SecondaryButton onClick={() => setShowSaveModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleConfirmSave}>
              Save
            </PrimaryButton>
          </FormFooter>
        </FormModal>
      </div>
    </div>
  );
}