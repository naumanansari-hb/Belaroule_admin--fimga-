import { useState } from 'react';
import { 
  ArrowLeft,
  Save,
  X,
  Shield,
  AlertCircle,
  Check,
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { formatDate } from '@/utils/dateFormatter';

interface Role {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdDate: string;
  lastModifiedDate: string;
  assignedCount?: number;
}

interface Permission {
  view: boolean;
  edit: boolean;
  add: boolean;
}

interface ModulePermission {
  module: string;
  permissions: Permission;
  disabled?: boolean; // For modules that don't have all permissions
}

interface RoleDetailProps {
  role: Role;
  isCreating: boolean;
  onBack: () => void;
  onSave: (role: Role, permissions: ModulePermission[]) => void;
  onDelete?: (role: Role) => void;
}

// Default modules with permissions
const defaultModules: ModulePermission[] = [
  { module: 'Dashboard', permissions: { view: false, edit: false, add: false } },
  { module: 'My Profile', permissions: { view: false, edit: false, add: false }, disabled: true },
  { module: 'Sub-Admin', permissions: { view: false, edit: false, add: false } },
  { module: 'User', permissions: { view: false, edit: false, add: false } },
  { module: 'Guest User', permissions: { view: false, edit: false, add: false } },
  { module: 'Roles', permissions: { view: false, edit: false, add: false } },
  { module: 'Category', permissions: { view: false, edit: false, add: false } },
  { module: 'Body Shape', permissions: { view: false, edit: false, add: false } },
  { module: 'Age Group', permissions: { view: false, edit: false, add: false } },
  { module: 'Default Wardrobe', permissions: { view: false, edit: false, add: false } },
  { module: 'Transaction Type', permissions: { view: false, edit: false, add: false } },
  { module: 'Reward Plans', permissions: { view: false, edit: false, add: false } },
  { module: 'Payment History', permissions: { view: false, edit: false, add: false } },
  { module: 'Post', permissions: { view: false, edit: false, add: false } },
  { module: 'Flagged Users', permissions: { view: false, edit: false, add: false } },
  { module: 'Flagged Posts', permissions: { view: false, edit: false, add: false } },
  { module: 'Flagged Comments', permissions: { view: false, edit: false, add: false } },
  { module: 'Flagged Wardrobe Items', permissions: { view: false, edit: false, add: false } },
  { module: 'Task Configurations', permissions: { view: false, edit: false, add: false } },
  { module: 'Prompts & API Setting', permissions: { view: false, edit: false, add: false } },
  { module: 'API/LLM Config', permissions: { view: false, edit: false, add: false } },
  { module: 'Static Pages', permissions: { view: false, edit: false, add: false } },
  { module: 'FAQs', permissions: { view: false, edit: false, add: false } },
  { module: 'Email Notifications', permissions: { view: false, edit: false, add: false } },
  { module: 'System Notification', permissions: { view: false, edit: false, add: false } },
  { module: 'Reports', permissions: { view: false, edit: false, add: false } },
];

export default function RoleDetail({ role, isCreating, onBack, onSave, onDelete }: RoleDetailProps) {
  const [formData, setFormData] = useState({
    name: role.name,
    description: role.description,
    status: role.status,
  });
  const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>(defaultModules);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle permission change with dependency rules
  const handlePermissionChange = (moduleIndex: number, permissionType: 'view' | 'edit' | 'add', value: boolean) => {
    const updated = [...modulePermissions];
    const module = updated[moduleIndex];

    if (permissionType === 'view') {
      // If unchecking view, uncheck edit and add as well
      if (!value) {
        module.permissions.view = false;
        module.permissions.edit = false;
        module.permissions.add = false;
      } else {
        module.permissions.view = true;
      }
    } else {
      // Can only check edit/add if view is checked
      if (module.permissions.view) {
        module.permissions[permissionType] = value;
      }
    }

    setModulePermissions(updated);
  };

  // Handle save with confirmation
  const handleSave = () => {
    // Validate role name
    if (!formData.name.trim()) {
      alert('Role name is required');
      return;
    }

    // Check if trying to deactivate a role with assigned sub-admins
    if (!isCreating && formData.status === 'inactive' && (role.assignedCount || 0) > 0) {
      alert('This role is assigned to sub-admins and cannot be deactivated. Please reassign or remove the sub-admins first.');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSave = () => {
    const updatedRole: Role = {
      ...role,
      name: formData.name,
      description: formData.description,
      status: formData.status,
      lastModifiedDate: new Date().toISOString().split('T')[0],
    };
    
    onSave(updatedRole, modulePermissions);
    setShowConfirmation(false);
  };



  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* HEADER SECTION */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            {/* Left Side - Role Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 style={{ fontSize: '18px', fontWeight: '600' }} className="text-neutral-900 dark:text-white">
                  {isCreating ? 'Create New Role' : formData.name}
                </h1>
                {!isCreating && (
                  <>
                    <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-700"></div>
                    <span style={{ fontWeight: '400' }} className="text-sm text-neutral-600 dark:text-neutral-400">
                      {role.id}
                    </span>
                  </>
                )}
              </div>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">Master Management</span>
                <span>/</span>
                <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">Roles</span>
                <span>/</span>
                <span className="text-neutral-900 dark:text-white">{isCreating ? 'Create New' : 'Edit Role'}</span>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                title="Back to List"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="space-y-6">
          {/* Role Details Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            {/* Block Heading */}
            <div className="px-5 pt-4 pb-3">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Role Details
              </h2>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-800"></div>

            {/* Block Content */}
            <div className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">
                    Role Name <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter role name"
                    maxLength={100}
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Maximum 100 characters. Must be unique.
                  </p>
                </div>

                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">
                    Status <span className="text-error-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter role description"
                  rows={3}
                  maxLength={250}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Maximum 250 characters
                </p>
              </div>

              {!isCreating && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div>
                    <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Created Date</label>
                    <p className="text-sm text-neutral-900 dark:text-white">{formatDate(role.createdDate)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Last Modified</label>
                    <p className="text-sm text-neutral-900 dark:text-white">{formatDate(role.lastModifiedDate)}</p>
                  </div>
                </div>
              )}

              {!isCreating && role.assignedCount !== undefined && role.assignedCount > 0 && (
                <div className="bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg px-4 py-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-warning-800 dark:text-warning-200">
                      <strong>Note:</strong> This role is currently assigned to {role.assignedCount} sub-admin{role.assignedCount > 1 ? 's' : ''}. 
                      You cannot deactivate this role until all sub-admins are reassigned.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Permission Matrix Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            {/* Block Heading */}
            <div className="px-5 pt-4 pb-3">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Permission Matrix
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                View must be enabled before Edit or Add can be selected. Removing View auto-unchecks Edit and Add.
              </p>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-800"></div>

            {/* Block Content - Permission Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Module</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 w-24">View</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 w-24">Edit</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 w-24">Add</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {modulePermissions.map((module, index) => (
                    <tr key={module.module} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                      <td className="px-5 py-3 text-sm text-neutral-900 dark:text-white">
                        {module.module}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {module.disabled ? (
                          <span className="text-neutral-400 dark:text-neutral-600">—</span>
                        ) : (
                          <label className="inline-flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={module.permissions.view}
                              onChange={(e) => handlePermissionChange(index, 'view', e.target.checked)}
                              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                            />
                          </label>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {module.disabled ? (
                          <span className="text-neutral-400 dark:text-neutral-600">—</span>
                        ) : (
                          <label className="inline-flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={module.permissions.edit}
                              onChange={(e) => handlePermissionChange(index, 'edit', e.target.checked)}
                              disabled={!module.permissions.view}
                              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </label>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {module.disabled ? (
                          <span className="text-neutral-400 dark:text-neutral-600">—</span>
                        ) : (
                          <label className="inline-flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={module.permissions.add}
                              onChange={(e) => handlePermissionChange(index, 'add', e.target.checked)}
                              disabled={!module.permissions.view}
                              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </label>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <SecondaryButton onClick={onBack}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleSave} icon={Save}>
              {isCreating ? 'Create Role' : 'Update Role'}
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-md w-full mx-4 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  {isCreating ? 'Create New Role?' : 'Update Role Details?'}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {isCreating 
                    ? 'Are you sure you want to create a new role with these permissions?'
                    : 'Are you sure you want to update the role details and permissions?'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <SecondaryButton onClick={() => setShowConfirmation(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={confirmSave} icon={Check}>
                {isCreating ? 'Create Role' : 'Update Role'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
