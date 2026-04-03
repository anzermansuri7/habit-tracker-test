import { useState } from 'react';
import { toast } from 'sonner';
import { ModuleCard } from '../components/ModuleCard';
import { SimpleTable } from '../components/SimpleTable';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import type { Debt, Emi, Expense } from '../types/models';

export function FinancePage() {
  const expenses = useSupabaseTable<Expense>('expenses');
  const debts = useSupabaseTable<Debt>('debts');
  const emis = useSupabaseTable<Emi>('emis');
  const [expense, setExpense] = useState({ date: new Date().toISOString().slice(0, 10), amount: 0, category: 'Food', note: '' });

  return (
    <div className="space-y-4">
      <ModuleCard title="Expense Entry">
        <form className="grid gap-2 md:grid-cols-4" onSubmit={async (e) => { e.preventDefault(); await expenses.insert(expense); toast.success('Expense saved'); }}>
          <input className="input" type="date" value={expense.date} onChange={(e) => setExpense({ ...expense, date: e.target.value })} />
          <input className="input" type="number" min={0} value={expense.amount} onChange={(e) => setExpense({ ...expense, amount: Number(e.target.value) })} />
          <select className="input" value={expense.category} onChange={(e) => setExpense({ ...expense, category: e.target.value })}><option>Food</option><option>Bills</option><option>EMI</option><option>Transport</option><option>Healthcare</option></select>
          <button className="btn-primary">Add</button>
        </form>
      </ModuleCard>
      <div className="grid gap-4 xl:grid-cols-2">
        <ModuleCard title="Debt Tracker" action={<button className="btn-secondary" onClick={async () => { await debts.insert({ name: 'Credit Card', total_amount: 5000, remaining_amount: 3000, interest_rate: 22 }); toast.success('Sample debt added'); }}>+ Sample debt</button>}>
          <SimpleTable columns={['Name', 'Total', 'Remaining']} rows={debts.rows.map((d) => [d.name, `$${d.total_amount}`, `$${d.remaining_amount}`])} />
        </ModuleCard>
        <ModuleCard title="Auto-Debit EMI" action={<button className="btn-secondary" onClick={async () => { await emis.insert({ name: 'Bike EMI', amount: 120, due_day: 5, active: true }); toast.success('Sample EMI added'); }}>+ Sample EMI</button>}>
          <SimpleTable columns={['Name', 'Amount', 'Due Day']} rows={emis.rows.map((e) => [e.name, `$${e.amount}`, e.due_day])} />
        </ModuleCard>
      </div>
      <SimpleTable columns={['Date', 'Category', 'Amount']} rows={expenses.rows.map((e) => [e.date, e.category, `$${e.amount.toFixed(2)}`])} />
    </div>
  );
}
