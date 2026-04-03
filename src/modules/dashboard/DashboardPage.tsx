import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { ModuleHeader } from '../../components/ModuleHeader';
import { StatCard } from '../../components/StatCard';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts';
import { supabase } from '../../lib/supabase';

export function DashboardPage({ userId }: { userId: string }) {
  const [habitPercent, setHabitPercent] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [debtTotal, setDebtTotal] = useState(0);
  const [learningWeek, setLearningWeek] = useState(0);
  const [weightData, setWeightData] = useState<{ day: string; weight: number }[]>([]);
  const [habitsByName, setHabitsByName] = useState<{ name: string; completion: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      const [habitLogs, expenses, debts, learning, weights, habits] = await Promise.all([
        supabase.from('habit_logs').select('completed, log_date, habit_id').eq('user_id', userId),
        supabase.from('expenses').select('amount, expense_date').eq('user_id', userId),
        supabase.from('debts').select('outstanding_amount').eq('user_id', userId),
        supabase.from('learning_logs').select('hours, log_date').eq('user_id', userId),
        supabase.from('weight_logs').select('weight_kg, log_date').eq('user_id', userId).order('log_date', { ascending: true }).limit(7),
        supabase.from('habits').select('id, name').eq('user_id', userId),
      ]);

      const logs = habitLogs.data ?? [];
      const completed = logs.filter((log) => log.completed).length;
      setHabitPercent(logs.length ? Math.round((completed / logs.length) * 100) : 0);

      const month = new Date().getMonth();
      const year = new Date().getFullYear();
      const monthly = (expenses.data ?? [])
        .filter((ex) => {
          const d = new Date(ex.expense_date);
          return d.getMonth() === month && d.getFullYear() === year;
        })
        .reduce((sum, ex) => sum + Number(ex.amount), 0);
      setMonthlyExpenses(monthly);

      setDebtTotal((debts.data ?? []).reduce((sum, d) => sum + Number(d.outstanding_amount), 0));

      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const hours = (learning.data ?? [])
        .filter((log) => new Date(log.log_date) >= weekAgo)
        .reduce((sum, log) => sum + Number(log.hours), 0);
      setLearningWeek(hours);

      setWeightData((weights.data ?? []).map((log) => ({ day: new Date(log.log_date).toLocaleDateString('en-US', { weekday: 'short' }), weight: Number(log.weight_kg) })));

      const habitsMap = new Map((habits.data ?? []).map((habit) => [habit.id, habit.name]));
      const grouped = new Map<string, { total: number; done: number }>();
      logs.forEach((log) => {
        const name = habitsMap.get(log.habit_id) ?? 'Unknown';
        const existing = grouped.get(name) ?? { total: 0, done: 0 };
        existing.total += 1;
        existing.done += log.completed ? 1 : 0;
        grouped.set(name, existing);
      });
      setHabitsByName(
        Array.from(grouped.entries()).map(([name, stats]) => ({ name, completion: Math.round((stats.done / stats.total) * 100) }))
      );
    };

    load();
  }, [userId]);

  const currentWeight = useMemo(() => (weightData.length ? weightData[weightData.length - 1].weight : 0), [weightData]);

  return (
    <div>
      <ModuleHeader title="Unified Dashboard" description="Live values from your modules in one view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Habit completion" value={`${habitPercent}%`} subtitle="Overall" />
        <StatCard label="Current weight" value={currentWeight ? `${currentWeight} kg` : '-'} subtitle="Latest log" />
        <StatCard label="Monthly expenses" value={`$${monthlyExpenses.toFixed(2)}`} subtitle="Current month" />
        <StatCard label="Debt summary" value={`$${debtTotal.toFixed(2)}`} subtitle="Outstanding" />
        <StatCard label="Learning hours" value={`${learningWeek.toFixed(1)}h`} subtitle="Last 7 days" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card title="Weight trend">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#4f5f47" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Habit completion by area">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitsByName}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="completion" fill="#7d8d73" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
