import { FormEvent, useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { ModuleHeader } from '../../components/ModuleHeader';
import { supabase } from '../../lib/supabase';

interface Expense { id: string; title: string; amount: number; expense_date: string; notes: string | null; }
interface Debt { id: string; source: string; outstanding_amount: number; }
interface Emi { id: string; title: string; monthly_amount: number; }

export function FinancePage({ userId }: { userId: string }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [emis, setEmis] = useState<Emi[]>([]);
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', notes: '' });
  const [debtForm, setDebtForm] = useState({ source: '', amount: '' });
  const [emiForm, setEmiForm] = useState({ title: '', amount: '', debitDay: '1' });

  const load = async () => {
    const [exp, db, em] = await Promise.all([
      supabase.from('expenses').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('debts').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('emis').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);
    setExpenses((exp.data ?? []) as Expense[]);
    setDebts((db.data ?? []) as Debt[]);
    setEmis((em.data ?? []) as Emi[]);
  };

  useEffect(() => {
    load();
  }, [userId]);

  const addExpense = async (e: FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) return;
    await supabase.from('expenses').insert({ user_id: userId, title: expenseForm.title, amount: Number(expenseForm.amount), notes: expenseForm.notes || null });
    setExpenseForm({ title: '', amount: '', notes: '' });
    await load();
  };

  const addDebt = async (e: FormEvent) => {
    e.preventDefault();
    if (!debtForm.source || !debtForm.amount) return;
    await supabase.from('debts').insert({ user_id: userId, source: debtForm.source, outstanding_amount: Number(debtForm.amount) });
    setDebtForm({ source: '', amount: '' });
    await load();
  };

  const addEmi = async (e: FormEvent) => {
    e.preventDefault();
    if (!emiForm.title || !emiForm.amount) return;
    await supabase.from('emis').insert({ user_id: userId, title: emiForm.title, monthly_amount: Number(emiForm.amount), debit_day: Number(emiForm.debitDay) });
    setEmiForm({ title: '', amount: '', debitDay: '1' });
    await load();
  };

  const total = expenses.reduce((sum, ex) => sum + Number(ex.amount), 0);

  return (
    <div>
      <ModuleHeader title="Finance Tracker" description="Add and update expenses, debt, and EMIs." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Expenses">
          <form className="mb-3 space-y-2" onSubmit={addExpense}>
            <input className="w-full rounded-lg border px-3 py-2" placeholder="Title" value={expenseForm.title} onChange={(e) => setExpenseForm((f) => ({ ...f, title: e.target.value }))} />
            <input className="w-full rounded-lg border px-3 py-2" type="number" placeholder="Amount" value={expenseForm.amount} onChange={(e) => setExpenseForm((f) => ({ ...f, amount: e.target.value }))} />
            <input className="w-full rounded-lg border px-3 py-2" placeholder="Notes" value={expenseForm.notes} onChange={(e) => setExpenseForm((f) => ({ ...f, notes: e.target.value }))} />
            <button className="rounded-lg bg-brand-700 px-3 py-2 text-white">Save expense</button>
          </form>
          <p className="mb-2 text-sm font-semibold">Total: ${total.toFixed(2)}</p>
          <ul className="space-y-2 text-sm">{expenses.map((ex) => <li key={ex.id} className="rounded-lg border p-2">{ex.title}: ${Number(ex.amount).toFixed(2)}</li>)}</ul>
        </Card>

        <Card title="Debts">
          <form className="mb-3 space-y-2" onSubmit={addDebt}>
            <input className="w-full rounded-lg border px-3 py-2" placeholder="Source" value={debtForm.source} onChange={(e) => setDebtForm((f) => ({ ...f, source: e.target.value }))} />
            <input className="w-full rounded-lg border px-3 py-2" type="number" placeholder="Outstanding" value={debtForm.amount} onChange={(e) => setDebtForm((f) => ({ ...f, amount: e.target.value }))} />
            <button className="rounded-lg bg-brand-700 px-3 py-2 text-white">Save debt</button>
          </form>
          <ul className="space-y-2 text-sm">{debts.map((d) => <li key={d.id} className="rounded-lg border p-2">{d.source}: ${Number(d.outstanding_amount).toFixed(2)}</li>)}</ul>
        </Card>

        <Card title="Auto-debit EMIs">
          <form className="mb-3 space-y-2" onSubmit={addEmi}>
            <input className="w-full rounded-lg border px-3 py-2" placeholder="Title" value={emiForm.title} onChange={(e) => setEmiForm((f) => ({ ...f, title: e.target.value }))} />
            <input className="w-full rounded-lg border px-3 py-2" type="number" placeholder="Monthly amount" value={emiForm.amount} onChange={(e) => setEmiForm((f) => ({ ...f, amount: e.target.value }))} />
            <input className="w-full rounded-lg border px-3 py-2" type="number" min={1} max={31} placeholder="Debit day" value={emiForm.debitDay} onChange={(e) => setEmiForm((f) => ({ ...f, debitDay: e.target.value }))} />
            <button className="rounded-lg bg-brand-700 px-3 py-2 text-white">Save EMI</button>
          </form>
          <ul className="space-y-2 text-sm">{emis.map((item) => <li key={item.id} className="rounded-lg border p-2">{item.title}: ${Number(item.monthly_amount).toFixed(2)}</li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
