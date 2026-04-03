import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AppLayout } from './layouts/AppLayout';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { FinancePage } from './pages/FinancePage';
import { FitnessPage } from './pages/FitnessPage';
import { HabitPage } from './pages/HabitPage';
import { LearningPage } from './pages/LearningPage';
import { PregnancyPage } from './pages/PregnancyPage';

function AppRoutes() {
  const { session, loading } = useAuth();

  if (loading) return <div className="p-10">Loading...</div>;
  if (!session) return <AuthPage />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/habits" element={<HabitPage />} />
        <Route path="/fitness" element={<FitnessPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/pregnancy" element={<PregnancyPage />} />
        <Route path="/learning" element={<LearningPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
