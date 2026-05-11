import { toast } from 'sonner';
import ModelMasterForm from './ModelMasterForm';
import { ModelMaster } from '../types/modelMaster';
import { mockModels } from './ModelMasterManagement';

interface ViewModelMasterProps {
  modelId?: string;
  onNavigate: (pageId: string) => void;
}

export default function ViewModelMaster({ modelId, onNavigate }: ViewModelMasterProps) {
  const model = mockModels.find(m => m.id === modelId);

  const handleSave = (updatedModel: ModelMaster) => {
    console.log('Updating model:', updatedModel);
    toast.success('Model updated successfully!');
    onNavigate('model-master');
  };

  if (!model) {
    return (
      <div className="p-6 text-center text-neutral-500">
        Model not found.
        <button onClick={() => onNavigate('model-master')} className="mt-4 text-primary-600 block mx-auto underline">
          Back to list
        </button>
      </div>
    );
  }

  return (
    <ModelMasterForm
      model={model}
      isCreating={false}
      onBack={() => onNavigate('model-master')}
      onSave={handleSave}
    />
  );
}
