import { useState } from 'react';
import { toast } from 'sonner';
import { ModuleCard } from '../components/ModuleCard';
import { SimpleTable } from '../components/SimpleTable';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import type { HabitLog } from '../types/models';

export function HabitPage() {
  const { rows, insert } = useSupabaseTable<HabitLog>('habit_logs');
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), learning_hours: 1, namaz_count: 5, workout_done: true, workout_type: 'Strength', diet_followed: true });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await insert(form);
      toast.success('Habit log saved');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <ModuleCard title="Habit Tracker" description="Daily/weekly/monthly discipline tracking with streak visibility.">
        <form className="grid gap-3 md:grid-cols-3" onSubmit={submit}>
          <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input type="number" className="input" value={form.learning_hours} min={0} step={0.5} onChange={(e) => setForm({ ...form, learning_hours: Number(e.target.value) })} />
          <input type="number" className="input" min={0} max={5} value={form.namaz_count} onChange={(e) => setForm({ ...form, namaz_count: Number(e.target.value) })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.workout_done} onChange={(e) => setForm({ ...form, workout_done: e.target.checked })} /> Workout done</label>
          <input placeholder="Workout type" className="input" value={form.workout_type} onChange={(e) => setForm({ ...form, workout_type: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.diet_followed} onChange={(e) => setForm({ ...form, diet_followed: e.target.checked })} /> Diet adherence</label>
          <button className="btn-primary md:col-span-3" type="submit">Save habit log</button>
        </form>
      </ModuleCard>
      <SimpleTable
        columns={['Date', 'Learning', 'Namaz', 'Workout', 'Diet']}
        rows={rows.map((r) => [r.date, `${r.learning_hours}h`, `${r.namaz_count}/5`, r.workout_type || (r.workout_done ? 'Yes' : 'No'), r.diet_followed ? 'Yes' : 'No'])}
      />
    </div>
  );
}
