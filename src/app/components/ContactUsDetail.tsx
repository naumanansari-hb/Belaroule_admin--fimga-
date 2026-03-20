import { useState } from 'react';
import { ArrowLeft, MessageSquare, User, Mail, Calendar, FileText, AlertCircle } from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect, FormTextarea } from './hb/common/Form';
import { toast } from 'sonner';
import { formatDate } from '@/utils/dateFormatter';

interface ContactUsDetailProps {
  ticketId: string;
  userName: string;
  userEmail: string;
  subject: string;
  contactedDate: string;
  status: 'open' | 'closed';
  onBack: () => void;
  onUpdate: (status: 'open' | 'closed', conclusion: string) => void;
}

export default function ContactUsDetail({
  ticketId,
  userName,
  userEmail,
  subject,
  contactedDate,
  status: initialStatus,
  onBack,
  onUpdate,
}: ContactUsDetailProps) {
  const [status, setStatus] = useState<'open' | 'closed'>(initialStatus);
  const [conclusion, setConclusion] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Mock message data
  const message = "I tried redeeming Bella Coins but it shows an error every time. I've tried logging out and back in, but the issue persists. Please help resolve this as soon as possible.";

  // Check if ticket is closed
  const isClosed = status === 'closed';

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as 'open' | 'closed');
    setHasUnsavedChanges(true);
    setValidationError('');
  };

  const handleConclusionChange = (value: string) => {
    setConclusion(value);
    setHasUnsavedChanges(true);
    setValidationError('');
  };

  const handleUpdate = () => {
    // Validate: If closing ticket, conclusion is required
    if (status === 'closed' && !conclusion.trim()) {
      setValidationError('Conclusion is required to close the ticket.');
      toast.error('Conclusion is required to close the ticket.');
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = () => {
    setShowConfirmModal(false);
    
    // Simulate API call
    toast.success('Ticket updated successfully');
    
    // Send email notification if conclusion is provided
    if (conclusion.trim()) {
      toast.info('Email notification sent to user');
    }
    
    onUpdate(status, conclusion);
    setHasUnsavedChanges(false);
  };

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Do you want to proceed without updating?');
      if (confirmDiscard) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Ticket Details"
          breadcrumbs={[
            { label: 'Communication Management', href: '#' },
            { label: 'Contact Us', href: '#', onClick: onBack },
            { label: ticketId, current: true },
          ]}
        >
          <SecondaryButton onClick={handleDiscard} size="sm" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </SecondaryButton>
        </PageHeader>

        {/* MAIN CONTENT */}
        <div className="space-y-6">
          {/* Ticket Status Alert */}
          {isClosed && (
            <div className="bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-success-900 dark:text-success-100 mb-1">
                    Ticket Closed
                  </h3>
                  <p className="text-xs text-success-700 dark:text-success-300">
                    This ticket has been closed and is now read-only. No further actions can be performed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ticket Information Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Ticket Information
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Ticket ID</p>
                  <p className="text-sm text-neutral-900 dark:text-white font-medium">{ticketId}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Contacted Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <p className="text-sm text-neutral-900 dark:text-white">{formatDate(contactedDate)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">User Name</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-400" />
                    <p className="text-sm text-neutral-900 dark:text-white">{userName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">User Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <p className="text-sm text-neutral-900 dark:text-white">{userEmail}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Subject</p>
                  <p className="text-sm text-neutral-900 dark:text-white font-medium">{subject}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  User Message
                </h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {message}
              </p>
            </div>
          </div>

          {/* Admin Response Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Admin Response
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Status Field */}
              <div>
                <FormLabel htmlFor="status" required={false}>
                  Status
                </FormLabel>
                <FormSelect
                  id="status"
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isClosed}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </FormSelect>
              </div>

              {/* Conclusion Field */}
              <div>
                <FormLabel htmlFor="conclusion" required={status === 'closed'}>
                  Conclusion
                </FormLabel>
                <FormTextarea
                  id="conclusion"
                  value={conclusion}
                  onChange={(e) => handleConclusionChange(e.target.value)}
                  placeholder="Enter your response to the user..."
                  rows={6}
                  maxLength={1000}
                  disabled={isClosed}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {status === 'closed' && 'Conclusion is required when closing a ticket'}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {conclusion.length}/1000 characters
                  </p>
                </div>
                {validationError && (
                  <p className="text-xs text-error-600 dark:text-error-400 mt-1">
                    {validationError}
                  </p>
                )}
              </div>

              {/* Information Note */}
              {!isClosed && (
                <div className="bg-info-50 dark:bg-info-950 border border-info-200 dark:border-info-800 rounded-lg p-3">
                  <p className="text-xs text-info-700 dark:text-info-300">
                    <strong>Note:</strong> When you add a conclusion and update the ticket, an email notification will be sent to the user.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {!isClosed && (
            <div className="flex justify-end gap-3">
              <SecondaryButton onClick={handleDiscard} size="md">
                Discard
              </SecondaryButton>
              <PrimaryButton onClick={handleUpdate} size="md" disabled={!hasUnsavedChanges}>
                Update Ticket
              </PrimaryButton>
            </div>
          )}
        </div>

        {/* CONFIRMATION MODAL */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  Confirm Update
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                  Are you sure you want to update this ticket? 
                  {conclusion.trim() && ' An email notification will be sent to the user.'}
                </p>
                <div className="flex justify-end gap-3">
                  <SecondaryButton onClick={() => setShowConfirmModal(false)} size="sm">
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton onClick={handleConfirmUpdate} size="sm">
                    Confirm Update
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
