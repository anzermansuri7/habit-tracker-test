import { NavLink, Outlet } from 'react-router-dom';
import { Activity, BookOpen, CircleDollarSign, HeartPulse, LayoutDashboard, ShieldCheck, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
}

const navConfig = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, service: null },
  { to: '/habits', label: 'Habits', icon: Sparkles, service: 'Habit Tracker' },
  { to: '/diet-fitness', label: 'Diet & Fitness', icon: Activity, service: 'Diet and Fitness Tracker' },
  { to: '/finance', label: 'Finance', icon: CircleDollarSign, service: 'Finance' },
  { to: '/pregnancy', label: 'Pregnancy', icon: HeartPulse, service: 'Pregnancy' },
  { to: '/learning', label: 'Learning', icon: BookOpen, service: 'Learning & Career' },
  { to: '/admin', label: 'Admin', icon: ShieldCheck, service: null, adminOnly: true },
] as const;

export function AppLayout({ profile }: Props) {
  const allowed = navConfig.filter((item) => {
    if ('adminOnly' in item && item.adminOnly && profile.role !== 'admin') return false;
    if (!item.service) return true;
    return profile.selected_modules.includes(item.service);
  });

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-r border-stone-200 bg-white p-5">
        <h1 className="mb-3 text-xl font-bold text-brand-700">Life Planning Tool</h1>
        <p className="mb-6 text-xs text-stone-500">{profile.full_name} · {profile.role.toUpperCase()}</p>
        <nav className="space-y-2">
          {allowed.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-100 text-brand-700' : 'text-stone-600 hover:bg-stone-100'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
