import type { PropsWithChildren, ReactNode } from 'react';

interface ModuleCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function ModuleCard({ title, description, action, children }: PropsWithChildren<ModuleCardProps>) {
  return (
    <section className="card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
