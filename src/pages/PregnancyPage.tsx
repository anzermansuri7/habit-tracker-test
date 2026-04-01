import { useState } from 'react';
import { toast } from 'sonner';
import { ModuleCard } from '../components/ModuleCard';
import { SimpleTable } from '../components/SimpleTable';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import type { PregnancyLog } from '../types/models';

export function PregnancyPage() {
  const logs = useSupabaseTable<PregnancyLog>('pregnancy_logs');
  const [entry, setEntry] = useState({ date: new Date().toISOString().slice(0, 10), weight_kg: 60, diet_note: '', medication: '', reminder: '' });

  return (
    <div className="space-y-4">
      <ModuleCard title="Pregnancy Weekly Overview" description="Track weight, diet, medication and reminders.">
        <form className="grid gap-2 md:grid-cols-2" onSubmit={async (e) => { e.preventDefault(); await logs.insert(entry); toast.success('Pregnancy log saved'); }}>
          <input className="input" type="date" value={entry.date} onChange={(e) => setEntry({ ...entry, date: e.target.value })} />
          <input className="input" type="number" value={entry.weight_kg} onChange={(e) => setEntry({ ...entry, weight_kg: Number(e.target.value) })} />
          <input className="input" placeholder="Diet" value={entry.diet_note} onChange={(e) => setEntry({ ...entry, diet_note: e.target.value })} />
          <input className="input" placeholder="Medication" value={entry.medication} onChange={(e) => setEntry({ ...entry, medication: e.target.value })} />
          <input className="input md:col-span-2" placeholder="Reminder" value={entry.reminder} onChange={(e) => setEntry({ ...entry, reminder: e.target.value })} />
          <button className="btn-primary md:col-span-2">Save weekly log</button>
        </form>
      </ModuleCard>
      <SimpleTable columns={['Date', 'Weight', 'Diet', 'Medication', 'Reminder']} rows={logs.rows.map((l) => [l.date, l.weight_kg ?? '-', l.diet_note ?? '-', l.medication ?? '-', l.reminder ?? '-'])} />
    </div>
  );
}
