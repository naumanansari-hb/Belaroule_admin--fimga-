import { toast } from 'sonner';
import ModelMasterForm from './ModelMasterForm';
import { ModelMaster } from '../types/modelMaster';

interface AddModelMasterProps {
  onNavigate: (pageId: string) => void;
}

export default function AddModelMaster({ onNavigate }: AddModelMasterProps) {
  const handleSave = (model: ModelMaster) => {
    console.log('Saving new model:', model);
    toast.success('Model created successfully!');
    onNavigate('model-master');
  };

  return (
    <ModelMasterForm
      isCreating={true}
      onBack={() => onNavigate('model-master')}
      onSave={handleSave}
    />
  );
}
