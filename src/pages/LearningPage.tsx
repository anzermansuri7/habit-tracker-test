import { useState } from 'react';
import { toast } from 'sonner';
import { ModuleCard } from '../components/ModuleCard';
import { SimpleTable } from '../components/SimpleTable';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import type { LearningLog } from '../types/models';

export function LearningPage() {
  const logs = useSupabaseTable<LearningLog>('learning_logs');
  const [entry, setEntry] = useState({ date: new Date().toISOString().slice(0, 10), skill: 'React', hours: 1 });

  return (
    <div className="space-y-4">
      <ModuleCard title="Learning & Career Tracker" description="Track daily learning effort and skill progression.">
        <form className="grid gap-2 md:grid-cols-3" onSubmit={async (e) => { e.preventDefault(); await logs.insert(entry); toast.success('Learning log saved'); }}>
          <input className="input" type="date" value={entry.date} onChange={(e) => setEntry({ ...entry, date: e.target.value })} />
          <input className="input" value={entry.skill} onChange={(e) => setEntry({ ...entry, skill: e.target.value })} />
          <input className="input" type="number" value={entry.hours} min={0} step={0.5} onChange={(e) => setEntry({ ...entry, hours: Number(e.target.value) })} />
          <button className="btn-primary md:col-span-3">Save log</button>
        </form>
      </ModuleCard>
      <SimpleTable columns={['Date', 'Skill', 'Hours']} rows={logs.rows.map((l) => [l.date, l.skill, `${l.hours} h`])} />
    </div>
  );
}
