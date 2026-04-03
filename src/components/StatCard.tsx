interface Props {
  label: string;
  value: string;
  subtitle?: string;
}

export function StatCard({ label, value, subtitle }: Props) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-white p-4 ring-1 ring-brand-100">
      <p className="text-sm text-stone-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-stone-800">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-stone-500">{subtitle}</p> : null}
    </div>
  );
}
