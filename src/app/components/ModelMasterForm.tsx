import { useState } from 'react';
import { ArrowLeft, Save, Database, AlertCircle, Check, Plus, Trash2 } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { formatDate } from '@/utils/dateFormatter';
import { ModelMaster, CostTier } from '../types/modelMaster';

interface ModelMasterFormProps {
  model?: ModelMaster;
  isCreating: boolean;
  onBack: () => void;
  onSave: (model: ModelMaster) => void;
}

export default function ModelMasterForm({ model, isCreating, onBack, onSave }: ModelMasterFormProps) {
  const [formData, setFormData] = useState<ModelMaster>(model || {
    id: '',
    provider: 'OpenAI',
    inputCosts: [{ startRange: 0, endRange: 10000000, costPerMillion: 0 }],
    outputCosts: [{ startRange: 0, endRange: 10000000, costPerMillion: 0 }],
    hasImageOutput: false,
    imageOutputCosts: [{ startRange: 0, endRange: 1000, costPerMillion: 0 }],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCostChange = (type: 'inputCosts' | 'outputCosts' | 'imageOutputCosts', index: number, field: keyof CostTier, value: any) => {
    const updated = [...(formData[type] || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, [type]: updated });
  };

  const addCostTier = (type: 'inputCosts' | 'outputCosts' | 'imageOutputCosts') => {
    const currentCosts = formData[type] || [];
    const maxEnd = currentCosts.length > 0 ? currentCosts[currentCosts.length - 1].endRange : 0;
    const startRange = typeof maxEnd === 'number' ? maxEnd + 1 : 0;
    
    setFormData({
      ...formData,
      [type]: [...currentCosts, { startRange, endRange: type === 'imageOutputCosts' ? 1000 : 10000000, costPerMillion: 0 }]
    });
  };

  const removeCostTier = (type: 'inputCosts' | 'outputCosts' | 'imageOutputCosts', index: number) => {
    const currentCosts = formData[type] || [];
    if (currentCosts.length <= 1) return; // Keep at least one
    const updated = currentCosts.filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  const handleSave = () => {
    if (!formData.id.trim()) {
      alert('Model ID is required');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmSave = () => {
    const updatedModel: ModelMaster = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedModel);
    setShowConfirmation(false);
  };

  const renderCostTiers = (type: 'inputCosts' | 'outputCosts' | 'imageOutputCosts', title: string, showAdd: boolean = true) => {
    const costs = formData[type] || [];
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="px-5 pt-4 pb-3 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-medium text-neutral-900 dark:text-white">{title}</h2>
          {showAdd && (
            <SecondaryButton onClick={() => addCostTier(type)} size="sm" Icon={Plus}>
              Add Instance
            </SecondaryButton>
          )}
        </div>
        <div className="px-5 py-4 space-y-4">
          {costs.map((tier, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-end p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <div className="flex-1">
                <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">
                  Start Range ({type === 'imageOutputCosts' ? 'Images' : 'Tokens'})
                </label>
                <input
                  type="number"
                  value={tier.startRange}
                  onChange={(e) => handleCostChange(type, index, 'startRange', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">
                  End Range ({type === 'imageOutputCosts' ? 'Images' : 'Tokens'})
                </label>
                <input
                  type="number"
                  value={tier.endRange}
                  onChange={(e) => handleCostChange(type, index, 'endRange', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Cost / Million (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={tier.costPerMillion}
                  onChange={(e) => handleCostChange(type, index, 'costPerMillion', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white"
                />
              </div>
              {costs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCostTier(type, index)}
                  className="p-2 text-error-600 hover:bg-error-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {isCreating ? 'Add New Model Master' : formData.id}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span>Master Management</span>
              <span>/</span>
              <span>Model Master</span>
              <span>/</span>
              <span className="text-neutral-900 dark:text-white">{isCreating ? 'Add New' : 'Edit Model'}</span>
            </div>
          </div>
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
            <ArrowLeft className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="px-5 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">Basic Details</h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Model ID <span className="text-error-500">*</span></label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled={!isCreating}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white disabled:opacity-50"
                    placeholder="Enter Model ID (e.g., gpt-4o)"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Provider <span className="text-error-500">*</span></label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white"
                  >
                    <option value="OpenAI">OpenAI</option>
                    <option value="Gemini">Gemini</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                {!isCreating && (
                   <div className="flex gap-4">
                    <div>
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Created At</label>
                      <p className="text-sm text-neutral-900 dark:text-white">{formatDate(formData.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Updated At</label>
                      <p className="text-sm text-neutral-900 dark:text-white">{formatDate(formData.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {renderCostTiers('inputCosts', 'Input Cost')}
          {renderCostTiers('outputCosts', 'Output Cost')}

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
             <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-neutral-900 dark:text-white">Image Output</h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Enable if this model can output images</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={formData.hasImageOutput} onChange={(e) => setFormData({...formData, hasImageOutput: e.target.checked})} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${formData.hasImageOutput ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.hasImageOutput ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
             </div>
          </div>

          {formData.hasImageOutput && renderCostTiers('imageOutputCosts', 'Image Output Cost')}

          <div className="flex items-center justify-end gap-3 pt-4">
            <SecondaryButton onClick={onBack}>Discard</SecondaryButton>
            <PrimaryButton onClick={handleSave} icon={Save}>
              {isCreating ? 'Save Model' : 'Update Model'}
            </PrimaryButton>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-md w-full mx-4 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  {isCreating ? 'Create Model?' : 'Update Model Details?'}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {isCreating 
                    ? 'Are you sure you want to save this new model configuration?'
                    : 'Are you sure you want to update the details of this model?'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <SecondaryButton onClick={() => setShowConfirmation(false)}>Cancel</SecondaryButton>
              <PrimaryButton onClick={confirmSave} icon={Check}>
                {isCreating ? 'Save Model' : 'Update Model'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
