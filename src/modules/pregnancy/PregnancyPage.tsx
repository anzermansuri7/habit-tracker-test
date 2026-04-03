import { FormEvent, useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { ModuleHeader } from '../../components/ModuleHeader';
import { supabase } from '../../lib/supabase';

interface PregnancyLog { id: string; week_no: number | null; weight_kg: number | null; diet_notes: string | null; medication: string | null; }

export function PregnancyPage({ userId }: { userId: string }) {
  const [logs, setLogs] = useState<PregnancyLog[]>([]);
  const [form, setForm] = useState({ week: '', weight: '', diet: '', medication: '' });

  const load = async () => {
    const { data } = await supabase.from('pregnancy_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setLogs((data ?? []) as PregnancyLog[]);
  };

  useEffect(() => {
    load();
  }, [userId]);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    await supabase.from('pregnancy_logs').insert({
      user_id: userId,
      week_no: form.week ? Number(form.week) : null,
      weight_kg: form.weight ? Number(form.weight) : null,
      diet_notes: form.diet || null,
      medication: form.medication || null,
    });
    setForm({ week: '', weight: '', diet: '', medication: '' });
    await load();
  };

  return (
    <div>
      <ModuleHeader title="Pregnancy Tracker" description="Add weekly updates, medications, and nutrition notes." />
      <Card title="Weekly logs">
        <form className="mb-4 grid gap-2 md:grid-cols-4" onSubmit={add}>
          <input className="rounded-lg border px-3 py-2" placeholder="Week" value={form.week} onChange={(e) => setForm((f) => ({ ...f, week: e.target.value }))} />
          <input className="rounded-lg border px-3 py-2" placeholder="Weight kg" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} />
          <input className="rounded-lg border px-3 py-2" placeholder="Medication" value={form.medication} onChange={(e) => setForm((f) => ({ ...f, medication: e.target.value }))} />
          <button className="rounded-lg bg-brand-700 px-3 py-2 text-white">Save</button>
          <input className="md:col-span-4 rounded-lg border px-3 py-2" placeholder="Diet notes" value={form.diet} onChange={(e) => setForm((f) => ({ ...f, diet: e.target.value }))} />
        </form>
        <ul className="space-y-2 text-sm">
          {logs.map((log) => <li key={log.id} className="rounded-lg border p-2">Week {log.week_no ?? '-'} · {log.weight_kg ?? '-'}kg · {log.medication ?? 'No meds'} · {log.diet_notes ?? ''}</li>)}
        </ul>
      </Card>
    </div>
  );
}
