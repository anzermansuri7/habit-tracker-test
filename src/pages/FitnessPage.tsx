import { useState } from 'react';
import { toast } from 'sonner';
import { ModuleCard } from '../components/ModuleCard';
import { SimpleTable } from '../components/SimpleTable';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import type { MealLog, WeightLog, WorkoutLog } from '../types/models';

export function FitnessPage() {
  const meals = useSupabaseTable<MealLog>('meals');
  const weights = useSupabaseTable<WeightLog>('weight_logs');
  const workouts = useSupabaseTable<WorkoutLog>('workouts');

  const [meal, setMeal] = useState({ date: new Date().toISOString().slice(0, 10), meal_type: 'Breakfast', description: '', calories: 0 });
  const [weight, setWeight] = useState({ date: new Date().toISOString().slice(0, 10), weight_kg: 70 });
  const [workout, setWorkout] = useState({ date: new Date().toISOString().slice(0, 10), type: 'Cardio', duration_min: 30, intensity: 'Medium' });

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ModuleCard title="Meal Logger">
        <form className="space-y-2" onSubmit={async (e) => { e.preventDefault(); await meals.insert(meal); toast.success('Meal saved'); }}>
          <input className="input" type="date" value={meal.date} onChange={(e) => setMeal({ ...meal, date: e.target.value })} />
          <select className="input" value={meal.meal_type} onChange={(e) => setMeal({ ...meal, meal_type: e.target.value })}><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snacks</option></select>
          <input className="input" placeholder="Description" value={meal.description} onChange={(e) => setMeal({ ...meal, description: e.target.value })} />
          <button className="btn-primary w-full">Add meal</button>
        </form>
      </ModuleCard>
      <ModuleCard title="Weight Tracker">
        <form className="space-y-2" onSubmit={async (e) => { e.preventDefault(); await weights.insert(weight); toast.success('Weight logged'); }}>
          <input className="input" type="date" value={weight.date} onChange={(e) => setWeight({ ...weight, date: e.target.value })} />
          <input className="input" type="number" value={weight.weight_kg} onChange={(e) => setWeight({ ...weight, weight_kg: Number(e.target.value) })} />
          <button className="btn-primary w-full">Add weight</button>
        </form>
      </ModuleCard>
      <ModuleCard title="Workout Logs" description="Workout type + duration + intensity.">
        <form className="space-y-2" onSubmit={async (e) => { e.preventDefault(); await workouts.insert(workout); toast.success('Workout saved'); }}>
          <input className="input" type="date" value={workout.date} onChange={(e) => setWorkout({ ...workout, date: e.target.value })} />
          <input className="input" value={workout.type} onChange={(e) => setWorkout({ ...workout, type: e.target.value })} />
          <input className="input" type="number" value={workout.duration_min} onChange={(e) => setWorkout({ ...workout, duration_min: Number(e.target.value) })} />
          <button className="btn-primary w-full">Add workout</button>
        </form>
      </ModuleCard>
      <SimpleTable columns={['Date', 'Type', 'Duration']} rows={workouts.rows.map((r) => [r.date, r.type, `${r.duration_min} min`])} />
    </div>
  );
}
