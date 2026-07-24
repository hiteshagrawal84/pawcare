import { cn } from '@/lib/utils';

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl border border-gray-100 bg-white shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pb-2', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-bold text-lg text-paw-charcoal font-[family-name:var(--font-jakarta)]', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pt-2', className)} {...props} />;
}

export function Badge({
  className,
  variant = 'green',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'green' | 'orange' | 'gray' | 'red' | 'blue' }) {
  const colors = {
    green: 'bg-paw-green/15 text-paw-green',
    orange: 'bg-paw-orange/15 text-paw-orange',
    gray: 'bg-gray-100 text-gray-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
  };
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', colors[variant], className)}
      {...props}
    />
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-xl bg-gray-200', className)} {...props} />;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">🐾</div>
      <h3 className="text-lg font-bold text-paw-charcoal mb-2">{title}</h3>
      {description && <p className="text-paw-muted text-sm max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function SectionHeader({
  badge,
  title,
  description,
  badgeColor = 'green',
}: {
  badge?: string;
  title: string;
  description?: string;
  badgeColor?: 'green' | 'orange';
}) {
  return (
    <div className="text-center mb-14">
      {badge && (
        <div
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4',
            badgeColor === 'green' ? 'bg-paw-green/15 text-paw-green' : 'bg-paw-orange/15 text-paw-orange'
          )}
        >
          {badge}
        </div>
      )}
      <h2 className="text-4xl font-extrabold mb-4 text-paw-charcoal font-[family-name:var(--font-jakarta)]">
        {title}
      </h2>
      {description && <p className="text-lg max-w-xl mx-auto text-paw-muted">{description}</p>}
    </div>
  );
}
