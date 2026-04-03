import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, Dumbbell, HeartPulse, LayoutDashboard, PiggyBank, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habits', label: 'Habit Tracker', icon: BarChart3 },
  { to: '/fitness', label: 'Diet & Fitness', icon: Dumbbell },
  { to: '/finance', label: 'Finance', icon: PiggyBank },
  { to: '/pregnancy', label: 'Pregnancy', icon: HeartPulse },
  { to: '/learning', label: 'Learning & Career', icon: BookOpen },
];

export function AppLayout() {
  const { pathname } = useLocation();
  const { signOut, session } = useAuth();

  return (
    <div className="min-h-screen bg-brand-50 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-brand-100 bg-white p-5">
        <h1 className="mb-6 text-xl font-bold text-brand-800">Life Planning Tool</h1>
        <nav className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                  active ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-brand-100'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 rounded-xl bg-brand-50 p-3 text-xs text-slate-600">{session?.user.email}</div>
        <button className="btn-secondary mt-3 w-full" onClick={() => signOut()}>
          <LogOut size={14} className="mr-1" />
          Logout
        </button>
      </aside>
      <main className="p-4 lg:p-7">
        <Outlet />
      </main>
    </div>
  );
}
