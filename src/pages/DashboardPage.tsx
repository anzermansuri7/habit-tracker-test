import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Brain, DollarSign, Flame, Scale, Wallet } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import type { Debt, Expense, HabitLog, LearningLog, WeightLog } from '../types/models';

export function DashboardPage() {
  const { rows: habitLogs } = useSupabaseTable<HabitLog>('habit_logs');
  const { rows: weightLogs } = useSupabaseTable<WeightLog>('weight_logs');
  const { rows: expenses } = useSupabaseTable<Expense>('expenses');
  const { rows: debts } = useSupabaseTable<Debt>('debts');
  const { rows: learningLogs } = useSupabaseTable<LearningLog>('learning_logs');

  const metrics = useMemo(() => {
    const habitCompletion = habitLogs.length
      ? Math.round(
          (habitLogs.reduce(
            (acc, item) =>
              acc + (item.learning_hours > 0 ? 1 : 0) + (item.namaz_count >= 5 ? 1 : 0) + (item.workout_done ? 1 : 0) + (item.diet_followed ? 1 : 0),
            0,
          ) /
            (habitLogs.length * 4)) *
            100,
        )
      : 0;

    const latestWeight = weightLogs[0]?.weight_kg ?? 0;
    const monthlyExpense = expenses.reduce((acc, item) => acc + item.amount, 0);
    const debtRemaining = debts.reduce((acc, item) => acc + item.remaining_amount, 0);
    const learningHoursWeek = learningLogs.slice(0, 7).reduce((acc, item) => acc + item.hours, 0);

    return { habitCompletion, latestWeight, monthlyExpense, debtRemaining, learningHoursWeek };
  }, [debts, expenses, habitLogs, learningLogs, weightLogs]);

  const weightTrend = weightLogs.slice(0, 8).reverse().map((w) => ({ date: w.date.slice(5), weight: w.weight_kg }));

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-brand-900">Unified Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Habit Completion" value={`${metrics.habitCompletion}%`} icon={<Flame size={16} className="text-brand-600" />} />
        <StatCard title="Current Weight" value={`${metrics.latestWeight || '-'} kg`} icon={<Scale size={16} className="text-brand-600" />} />
        <StatCard title="Expenses (Month)" value={`$${metrics.monthlyExpense.toFixed(2)}`} icon={<DollarSign size={16} className="text-brand-600" />} />
        <StatCard title="Debt Remaining" value={`$${metrics.debtRemaining.toFixed(2)}`} icon={<Wallet size={16} className="text-brand-600" />} />
        <StatCard title="Learning this Week" value={`${metrics.learningHoursWeek}h`} icon={<Brain size={16} className="text-brand-600" />} />
      </div>
      <section className="card h-[320px]">
        <h3 className="mb-2 text-lg font-semibold">Weight Trend</h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={weightTrend}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#759676" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#759676" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="weight" stroke="#5b785d" fillOpacity={1} fill="url(#colorWeight)" />
          </AreaChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
