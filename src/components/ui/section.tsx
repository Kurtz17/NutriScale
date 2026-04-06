import { cn } from '@/lib/utils';
import * as React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ title, description, className, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        'flex flex-col rounded-2xl bg-white p-8 shadow-lg',
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-black text-2xl font-bold">{title}</h2>}
          {description && <p className="text-gray-500 mt-2">{description}</p>}
        </div>
      )}
      {children}
    </section>
  ),
);
Section.displayName = 'Section';

export { Section };
