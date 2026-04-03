import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { HabitsPage } from './modules/habits/HabitsPage';
import { DietFitnessPage } from './modules/diet/DietFitnessPage';
import { FinancePage } from './modules/finance/FinancePage';
import { PregnancyPage } from './modules/pregnancy/PregnancyPage';
import { LearningPage } from './modules/learning/LearningPage';
import { supabase } from './lib/supabase';
import { SERVICE_OPTIONS, UserProfile } from './types';
import { ModuleHeader } from './components/ModuleHeader';

function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('Loading...');
    const action = mode === 'login'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password });
    const { error } = await action;
    setStatus(error ? error.message : 'Success.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-stone-100 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-brand-700">Life Planning Tool</h1>
        <input className="w-full rounded-lg border px-3 py-2" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-lg border px-3 py-2" type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full rounded-lg bg-brand-700 py-2 font-medium text-white">{mode === 'login' ? 'Login' : 'Create account'}</button>
        <button type="button" className="w-full rounded-lg border py-2" onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}>
          {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </button>
        {status ? <p className="text-sm text-stone-500">{status}</p> : null}
      </form>
    </div>
  );
}

function Onboarding({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [form, setForm] = useState<{
    full_name: string;
    phone: string;
    age: string;
    gender: string;
    weight_kg: string;
    height_cm: string;
    role: 'admin' | 'regular';
    selected_modules: string[];
  }>({
    full_name: '',
    phone: '',
    age: '',
    gender: '',
    weight_kg: '',
    height_cm: '',
    role: 'regular',
    selected_modules: [...SERVICE_OPTIONS],
  });
  const [status, setStatus] = useState('');

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      selected_modules: prev.selected_modules.includes(service)
        ? prev.selected_modules.filter((value) => value !== service)
        : [...prev.selected_modules, service],
    }));
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.full_name || form.selected_modules.length === 0) {
      setStatus('Name and at least one service are required.');
      return;
    }

    const payload = {
      id: userId,
      full_name: form.full_name,
      phone: form.phone || null,
      age: form.age ? Number(form.age) : null,
      gender: form.gender || null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      height_cm: form.height_cm ? Number(form.height_cm) : null,
      role: form.role,
      selected_modules: form.selected_modules,
    };

    const { error } = await supabase.from('users').upsert(payload);
    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus('Profile saved.');
    onDone();
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <ModuleHeader title="Complete your profile" description="Tell us about yourself and select services to activate." />
      <form className="space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200" onSubmit={save}>
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Name" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Phone number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-lg border px-3 py-2" type="number" placeholder="Age" value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
          <input className="rounded-lg border px-3 py-2" placeholder="Gender" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} />
          <input className="rounded-lg border px-3 py-2" type="number" placeholder="Weight (kg)" value={form.weight_kg} onChange={(e) => setForm((f) => ({ ...f, weight_kg: e.target.value }))} />
          <input className="rounded-lg border px-3 py-2" type="number" placeholder="Height (cm)" value={form.height_cm} onChange={(e) => setForm((f) => ({ ...f, height_cm: e.target.value }))} />
        </div>
        <select className="w-full rounded-lg border px-3 py-2" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'admin' | 'regular' }))}>
          <option value="regular">Regular User</option>
          <option value="admin">Admin</option>
        </select>
        <div>
          <p className="mb-2 text-sm font-medium">Services</p>
          <div className="grid gap-2 md:grid-cols-2">
            {SERVICE_OPTIONS.map((service) => (
              <label key={service} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                <input type="checkbox" checked={form.selected_modules.includes(service)} onChange={() => toggleService(service)} />
                {service}
              </label>
            ))}
          </div>
        </div>
        <button className="rounded-lg bg-brand-700 px-4 py-2 text-white">Save Profile</button>
        {status ? <p className="text-sm text-stone-500">{status}</p> : null}
      </form>
    </div>
  );
}

function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    supabase.from('users').select('*').order('created_at', { ascending: false }).then(({ data }) => setUsers((data ?? []) as UserProfile[]));
  }, []);

  return (
    <div>
      <ModuleHeader title="Admin · User Directory" description="View all registered users and selected services." />
      <div className="space-y-3">
        {users.map((user) => (
          <article key={user.id} className="rounded-xl bg-white p-4 ring-1 ring-stone-200">
            <p className="font-semibold">{user.full_name} ({user.role})</p>
            <p className="text-sm text-stone-500">{user.phone ?? 'No phone'} · age {user.age ?? '-'}</p>
            <p className="text-xs text-stone-500">{user.selected_modules.join(', ')}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user.id) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await supabase.from('users').select('*').eq('id', session.user.id).maybeSingle();
      setProfile((data as UserProfile | null) ?? null);
      setLoading(false);
    };
    loadProfile();
  }, [session?.user.id]);

  const availableModules = useMemo(() => profile?.selected_modules ?? [], [profile?.selected_modules]);

  if (!session) return <AuthScreen />;
  if (loading) return <div className="p-10">Loading...</div>;
  if (!profile) return <Onboarding userId={session.user.id} onDone={() => window.location.reload()} />;

  return (
    <Routes>
      <Route path="/" element={<AppLayout profile={profile} />}>
        <Route index element={<DashboardPage userId={session.user.id} />} />
        {availableModules.includes('Habit Tracker') && <Route path="habits" element={<HabitsPage userId={session.user.id} />} />}
        {availableModules.includes('Diet and Fitness Tracker') && <Route path="diet-fitness" element={<DietFitnessPage userId={session.user.id} />} />}
        {availableModules.includes('Finance') && <Route path="finance" element={<FinancePage userId={session.user.id} />} />}
        {availableModules.includes('Pregnancy') && <Route path="pregnancy" element={<PregnancyPage userId={session.user.id} />} />}
        {availableModules.includes('Learning & Career') && <Route path="learning" element={<LearningPage userId={session.user.id} />} />}
        {profile.role === 'admin' && <Route path="admin" element={<AdminPage />} />}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
