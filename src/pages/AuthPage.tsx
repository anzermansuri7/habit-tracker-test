import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') await signIn(email, password);
      else await signUp(email, password);
      toast.success(mode === 'login' ? 'Welcome back' : 'Account created');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 p-4">
      <form className="card w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-brand-800">Life Planning Tool</h1>
        <p className="text-sm text-slate-500">Sign in to your personal life dashboard.</p>
        <input className="input" placeholder="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary w-full" type="submit">
          {mode === 'login' ? 'Login' : 'Create account'}
        </button>
        <button type="button" className="text-sm text-brand-700" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>
      </form>
    </div>
  );
}
