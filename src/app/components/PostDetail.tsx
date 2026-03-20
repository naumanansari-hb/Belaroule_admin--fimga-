import { useState } from 'react';
import { ArrowLeft, FileText, Heart, MessageCircle, Bookmark, Repeat2, Play } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { FormSection, FormField, FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';

interface Post {
  id: string;
  postedBy: string;
  postedByEmail: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  hashtags: string[];
  likesCount: number;
  commentCount: number;
  savedCount: number;
  repostCount: number;
  postedDate: string;
  status: 'active' | 'inactive';
}

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onSave: (post: Post) => void;
}

export default function PostDetail({ post, onBack, onSave }: PostDetailProps) {
  const [formData, setFormData] = useState({
    status: post.status,
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Handle save
  const handleSave = () => {
    onSave({
      ...post,
      status: formData.status,
    });
  };

  // Handle cancel
  const handleCancel = () => {
    onBack();
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Posts List
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Post Details
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Review post content and engagement metrics. Update post status to control visibility in the community feed.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Media & Engagement */}
          <div className="space-y-4">
            {/* Key Statistics */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
                Key Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-error-100 dark:bg-error-900/30 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-error-100 dark:bg-error-900 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-error-600 dark:text-error-400" />
                  </div>
                  <div>
                    <div className="text-xs text-error-600 dark:text-error-400">Likes</div>
                    <div className="text-lg font-semibold text-error-700 dark:text-error-300">{post.likesCount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-950 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="text-xs text-primary-600 dark:text-primary-400">Comments</div>
                    <div className="text-lg font-semibold text-primary-700 dark:text-primary-300">{post.commentCount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900 flex items-center justify-center">
                    <Bookmark className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                  </div>
                  <div>
                    <div className="text-xs text-warning-600 dark:text-warning-400">Saves</div>
                    <div className="text-lg font-semibold text-warning-700 dark:text-warning-300">{post.savedCount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-success-100 dark:bg-success-900/30 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900 flex items-center justify-center">
                    <Repeat2 className="w-5 h-5 text-success-600 dark:text-success-400" />
                  </div>
                  <div>
                    <div className="text-xs text-success-600 dark:text-success-400">Reposts</div>
                    <div className="text-lg font-semibold text-success-700 dark:text-success-300">{post.repostCount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Preview */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Media Preview
                </h2>
              </div>
              <div className="p-4">
                <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden relative">
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    className="w-full h-full object-cover"
                  />
                  {post.mediaType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-8 h-8 text-neutral-900 ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Post Information */}
          <div className="space-y-4">
            {/* Read-only Information */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Post Information (Read-only)
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Post ID
                  </label>
                  <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {post.id}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Posted By
                  </label>
                  <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <div className="text-sm text-neutral-900 dark:text-white">{post.postedBy}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{post.postedByEmail}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Caption
                  </label>
                  <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {post.caption}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Hashtags
                  </label>
                  <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {post.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Posted Date
                  </label>
                  <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {formatDate(post.postedDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Editable: Status */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Status Management
                </h2>
              </div>
              <div className="p-4">
                <FormSection>
                  <FormField>
                    <FormLabel htmlFor="status" required>
                      Post Status
                    </FormLabel>
                    <FormSelect
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </FormSelect>
                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                      {formData.status === 'active' 
                        ? '✓ This post is visible in the community feed'
                        : '✗ This post is hidden from the community feed'}
                    </p>
                  </FormField>
                </FormSection>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <SecondaryButton
                onClick={handleCancel}
                size="sm"
                className="flex-1"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                onClick={handleSave}
                size="sm"
                className="flex-1"
              >
                Update Status
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* Status Rules Info */}
        <div className="mt-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Status Rules
          </h3>
          <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
            <li>• <strong>Active</strong> posts are visible in the community feed and can be liked, commented, saved, and reposted</li>
            <li>• <strong>Inactive</strong> posts are hidden from the community feed but remain accessible via direct link</li>
            <li>• Post content (caption, hashtags, media) cannot be edited from the admin panel</li>
            <li>• Engagement metrics (likes, comments, saves, reposts) are read-only and reflect actual user interactions</li>
            <li>• Status changes take effect immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
