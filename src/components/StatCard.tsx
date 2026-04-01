import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}

export function StatCard({ title, value, hint, icon }: StatCardProps) {
  return (
    <article className="card">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </article>
  );
}
