import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Shield, 
  Calendar, 
  ArrowLeft,
  MoreVertical,
  Key,
  Save,
  X,
} from 'lucide-react';

interface SubAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdDate: string;
}

interface SubAdminDetailProps {
  subAdmin: SubAdmin;
  onBack: () => void;
  onUpdate: (subAdmin: SubAdmin) => void;
  onDelete: (subAdmin: SubAdmin) => void;
}

export default function SubAdminDetail({ subAdmin, onBack, onUpdate, onDelete }: SubAdminDetailProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: subAdmin.name,
    email: subAdmin.email,
    role: subAdmin.role,
    status: subAdmin.status,
  });

  // Status badge helper following BADGE_GUIDELINES.md Pattern 1
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-success-500', label: 'Active' },
      inactive: { color: 'bg-error-500', label: 'Inactive' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleSave = () => {
    // Show confirmation popup for role/status change
    const hasRoleOrStatusChange = formData.role !== subAdmin.role || formData.status !== subAdmin.status;
    
    if (hasRoleOrStatusChange) {
      const confirmMessage = 'Changing role or status will force logout for this Sub Admin. Continue?';
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    onUpdate({
      ...subAdmin,
      ...formData,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: subAdmin.name,
      email: subAdmin.email,
      role: subAdmin.role,
      status: subAdmin.status,
    });
    setIsEditing(false);
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* Header with action buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              title="Back to list"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: '600' }} className="text-neutral-900 dark:text-white">
              Edit Admin User
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Edit/Save Button */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                title="Edit Admin User"
              >
                <Edit className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                </button>
                <button
                  onClick={handleSave}
                  className="w-9 h-9 flex items-center justify-center bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  title="Save Changes"
                >
                  <Save className="w-4 h-4 text-white" />
                </button>
              </>
            )}

            {/* More Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                title="More Actions"
              >
                <MoreVertical className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              </button>

              {/* More Actions Menu */}
              {showMoreMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMoreMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-20 overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Reset password for sub admin:', subAdmin);
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3 text-neutral-700 dark:text-neutral-300"
                    >
                      <Key className="w-4 h-4" />
                      <span>Reset Password</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(subAdmin);
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-error-50 dark:hover:bg-error-950 transition-colors flex items-center gap-3 text-error-600 dark:text-error-400 border-t border-neutral-200 dark:border-neutral-800"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT - Single Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <h4 style={{ fontSize: '14px', fontWeight: '500' }} className="text-neutral-900 dark:text-white px-6 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                Account Information
              </h4>

              {/* Block Content */}
              <div className="px-6 py-4 space-y-3">
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Admin User ID</label>
                  <p className="text-sm text-neutral-900 dark:text-white">{subAdmin.id}</p>
                </div>
                
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white cursor-not-allowed"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Full Name</label>
                      <p className="text-sm text-neutral-900 dark:text-white">{subAdmin.name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Email</label>
                      <p className="text-sm text-neutral-900 dark:text-white">{subAdmin.email}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Account Created */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <h4 style={{ fontSize: '14px', fontWeight: '500' }} className="text-neutral-900 dark:text-white px-6 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                Account Created
              </h4>

              {/* Block Content */}
              <div className="px-6 py-4 space-y-3">
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Created Date</label>
                  <p className="text-sm text-neutral-900 dark:text-white">{formatDate(subAdmin.createdDate)}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Last Login</label>
                  <p className="text-sm text-neutral-900 dark:text-white">{formatDate(subAdmin.lastLogin)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Role & Permissions */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <h4 style={{ fontSize: '14px', fontWeight: '500' }} className="text-neutral-900 dark:text-white px-6 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                Role & Permissions
              </h4>

              {/* Block Content */}
              <div className="px-6 py-4 space-y-3">
                {isEditing ? (
                  <div>
                    <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Assigned Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Content Manager">Content Manager</option>
                      <option value="User Support">User Support</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Analytics Manager">Analytics Manager</option>
                    </select>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Changing role will force logout
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Assigned Role</label>
                    <p className="text-sm text-neutral-900 dark:text-white">{subAdmin.role}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <h4 style={{ fontSize: '14px', fontWeight: '500' }} className="text-neutral-900 dark:text-white px-6 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                Account Status
              </h4>

              {/* Block Content */}
              <div className="px-6 py-4 space-y-3">
                {isEditing ? (
                  <div>
                    <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Inactive users cannot log in and will be logged out immediately
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Current Status</label>
                    <div className="mt-1">{getStatusBadge(subAdmin.status)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg px-4 py-3">
              <p className="text-xs text-warning-800 dark:text-warning-200">
                <strong>Security Note:</strong> Changing role or status will immediately terminate the active session and require a fresh login.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}