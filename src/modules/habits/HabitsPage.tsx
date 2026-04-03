import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { ModuleHeader } from '../../components/ModuleHeader';
import { supabase } from '../../lib/supabase';

interface Habit { id: string; name: string; target_value: number | null; unit: string | null; }
interface HabitLog { id: string; habit_id: string; completed: boolean; value_numeric: number | null; notes: string | null; }

export function HabitsPage({ userId }: { userId: string }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [newHabit, setNewHabit] = useState({ name: '', target: '', unit: '' });
  const [error, setError] = useState('');

  const load = async () => {
    const [{ data: habitsData, error: habitErr }, { data: logsData, error: logErr }] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('habit_logs').select('*').eq('user_id', userId).eq('log_date', new Date().toISOString().slice(0, 10)),
    ]);

    if (habitErr || logErr) {
      setError((habitErr ?? logErr)?.message ?? 'Failed to load habit data. Ensure schema.sql has been executed.');
      return;
    }

    setHabits((habitsData ?? []) as Habit[]);
    setLogs((logsData ?? []) as HabitLog[]);
  };

  useEffect(() => {
    load();
  }, [userId]);

  const seedDefaults = async () => {
    const defaults = [
      { name: 'Learning', target_value: 2, unit: 'hours' },
      { name: 'Namaz', target_value: 5, unit: 'times' },
      { name: 'Workout', target_value: 1, unit: 'session' },
      { name: 'Diet adherence', target_value: 1, unit: 'yes/no' },
    ];
    await supabase.from('habits').insert(defaults.map((habit) => ({ ...habit, user_id: userId })));
    await load();
  };

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;
    await supabase.from('habits').insert({
      user_id: userId,
      name: newHabit.name,
      target_value: newHabit.target ? Number(newHabit.target) : null,
      unit: newHabit.unit || null,
    });
    setNewHabit({ name: '', target: '', unit: '' });
    await load();
  };

  const updateHabitName = async (id: string, name: string) => {
    await supabase.from('habits').update({ name }).eq('id', id).eq('user_id', userId);
    await load();
  };

  const toggleLog = async (habit: Habit, completed: boolean) => {
    const existing = logs.find((log) => log.habit_id === habit.id);
    const payload = {
      user_id: userId,
      habit_id: habit.id,
      log_date: new Date().toISOString().slice(0, 10),
      completed,
      value_numeric: completed ? habit.target_value : 0,
    };

    if (existing) {
      await supabase.from('habit_logs').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('habit_logs').insert(payload);
    }
    await load();
  };

  const completion = habits.length
    ? Math.round(
      (habits.filter((habit) => logs.find((log) => log.habit_id === habit.id)?.completed).length / habits.length) * 100,
    )
    : 0;

  return (
    <div>
      <ModuleHeader title="Habit Tracker" description="Create habits, log daily status, and update records anytime." />
      <Card
        title={`Today's completion: ${completion}%`}
        action={<button className="rounded-lg border px-3 py-1 text-sm" onClick={seedDefaults}>Add default habits</button>}
      >
        {error ? <p className="mb-2 text-sm text-red-600">{error}</p> : null}

        <form className="mb-4 grid gap-2 md:grid-cols-4" onSubmit={addHabit}>
          <input className="rounded-lg border px-3 py-2" placeholder="Habit name" value={newHabit.name} onChange={(e) => setNewHabit((s) => ({ ...s, name: e.target.value }))} />
          <input className="rounded-lg border px-3 py-2" placeholder="Target" value={newHabit.target} onChange={(e) => setNewHabit((s) => ({ ...s, target: e.target.value }))} />
          <input className="rounded-lg border px-3 py-2" placeholder="Unit" value={newHabit.unit} onChange={(e) => setNewHabit((s) => ({ ...s, unit: e.target.value }))} />
          <button className="rounded-lg bg-brand-700 px-3 py-2 text-white">Save</button>
        </form>

        <div className="space-y-3">
          {habits.map((habit) => {
            const todayLog = logs.find((log) => log.habit_id === habit.id);
            return (
              <div key={habit.id} className="rounded-xl border border-stone-200 p-3">
                <div className="flex items-center gap-2">
                  <input
                    className="w-full rounded-lg border px-3 py-2"
                    value={habit.name}
                    onChange={(e) => setHabits((prev) => prev.map((h) => (h.id === habit.id ? { ...h, name: e.target.value } : h)))}
                    onBlur={(e) => updateHabitName(habit.id, e.target.value)}
                  />
                  <button className="rounded-lg border px-3 py-2" onClick={() => supabase.from('habits').delete().eq('id', habit.id).eq('user_id', userId).then(load)}>Delete</button>
                </div>
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={todayLog?.completed ?? false} onChange={(e) => toggleLog(habit, e.target.checked)} />
                  Mark done for today
                </label>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
