import { FormEvent, useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { ModuleHeader } from '../../components/ModuleHeader';
import { supabase } from '../../lib/supabase';

interface LearningLog { id: string; skill_name: string; hours: number; log_date: string; }

export function LearningPage({ userId }: { userId: string }) {
  const [logs, setLogs] = useState<LearningLog[]>([]);
  const [form, setForm] = useState({ skill: '', hours: '' });

  const load = async () => {
    const { data } = await supabase.from('learning_logs').select('*').eq('user_id', userId).order('log_date', { ascending: false });
    setLogs((data ?? []) as LearningLog[]);
  };

  useEffect(() => {
    load();
  }, [userId]);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.skill || !form.hours) return;
    await supabase.from('learning_logs').insert({ user_id: userId, skill_name: form.skill, hours: Number(form.hours) });
    setForm({ skill: '', hours: '' });
    await load();
  };

  const total = logs.reduce((sum, item) => sum + Number(item.hours), 0);

  return (
    <div>
      <ModuleHeader title="Learning & Career Tracker" description="Track skills and update learning hours daily." />
      <Card title={`Total logged hours: ${total.toFixed(1)}h`}>
        <form className="mb-4 grid gap-2 md:grid-cols-3" onSubmit={add}>
          <input className="rounded-lg border px-3 py-2" placeholder="Skill" value={form.skill} onChange={(e) => setForm((f) => ({ ...f, skill: e.target.value }))} />
          <input className="rounded-lg border px-3 py-2" placeholder="Hours" type="number" step="0.5" value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} />
          <button className="rounded-lg bg-brand-700 px-3 py-2 text-white">Save</button>
        </form>
        <ul className="space-y-2 text-sm">
          {logs.map((log) => <li key={log.id} className="rounded-lg border p-2">{log.log_date}: {log.skill_name} ({log.hours}h)</li>)}
        </ul>
      </Card>
    </div>
  );
}
