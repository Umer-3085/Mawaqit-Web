import React from 'react';
import { cn } from '@/components/ui/utils';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function PageContainer({ children, className, as: Component = 'div' }: PageContainerProps) {
  return (
    <Component className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1', className)}>
      {children}
    </Component>
  );
}
