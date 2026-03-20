/**
 * CARD COMPONENT
 * 
 * Base card container following the design system
 * Used for grouping related content
 */

import { cn } from '../../ui/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg",
      className
    )}>
      {children}
    </div>
  );
}
