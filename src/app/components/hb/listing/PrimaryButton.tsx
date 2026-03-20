/**
 * REUSABLE PRIMARY BUTTON COMPONENT
 * 
 * Main action button used throughout listing pages
 * 
 * SPECIFICATIONS:
 * - Height: 40px (py-2)
 * - Padding: 16px horizontal (px-4)
 * - Background: primary-600
 * - Hover Background: primary-700
 * - Active Background: primary-800
 * - Text Color: white
 * - Border Radius: 8px (rounded-lg)
 * - Icon Size: 16px × 16px (w-4 h-4)
 * - Gap between icon and text: 8px (gap-2)
 * - Transition: colors (transition-colors)
 * - Font Size: 14px (default)
 * 
 * USAGE:
 * <PrimaryButton icon={Plus} onClick={handleAdd}>Add Lead</PrimaryButton>
 * <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
 */

import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  hideTextOnMobile?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PrimaryButton({ 
  children, 
  icon: Icon, 
  iconPosition = 'left',
  onClick, 
  type = 'button',
  className = '',
  hideTextOnMobile = false,
  disabled = false,
  size = 'md'
}: PrimaryButtonProps) {
  
  // Define size-specific classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5 text-base'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        bg-primary-600 
        hover:bg-primary-700 
        active:bg-primary-800 
        text-white 
        rounded-lg 
        transition-colors 
        inline-flex items-center gap-2
        flex-shrink-0
        whitespace-nowrap
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span className="flex-shrink-0">{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
}