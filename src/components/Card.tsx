import { ReactNode } from 'react';

interface Props {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Card({ title, action, children }: Props) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
