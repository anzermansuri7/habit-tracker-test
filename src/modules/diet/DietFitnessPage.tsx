import { FormEvent, useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { ModuleHeader } from '../../components/ModuleHeader';
import { supabase } from '../../lib/supabase';

interface Meal { id: string; meal_type: string; description: string; }
interface Workout { id: string; workout_type: string; duration_mins: number | null; }
interface WeightLog { id: string; weight_kg: number; log_date: string; }

export function DietFitnessPage({ userId }: { userId: string }) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [mealText, setMealText] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [workoutType, setWorkoutType] = useState('');
  const [workoutMins, setWorkoutMins] = useState('');
  const [weight, setWeight] = useState('');

  const load = async () => {
    const [m, w, wt] = await Promise.all([
      supabase.from('meals').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('workouts').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('weight_logs').select('*').eq('user_id', userId).order('log_date', { ascending: false }).limit(10),
    ]);
    setMeals((m.data ?? []) as Meal[]);
    setWorkouts((w.data ?? []) as Workout[]);
    setWeights((wt.data ?? []) as WeightLog[]);
  };

  useEffect(() => {
    load();
  }, [userId]);

  const addMeal = async (e: FormEvent) => {
    e.preventDefault();
    if (!mealText.trim()) return;
    await supabase.from('meals').insert({ user_id: userId, meal_type: mealType, description: mealText });
    setMealText('');
    await load();
  };

  const addWorkout = async (e: FormEvent) => {
    e.preventDefault();
    if (!workoutType.trim()) return;
    await supabase.from('workouts').insert({ user_id: userId, workout_type: workoutType, duration_mins: workoutMins ? Number(workoutMins) : null });
    setWorkoutType('');
    setWorkoutMins('');
    await load();
  };

  const addWeight = async (e: FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    await supabase.from('weight_logs').upsert({ user_id: userId, weight_kg: Number(weight), log_date: new Date().toISOString().slice(0, 10) }, { onConflict: 'user_id,log_date' });
    setWeight('');
    await load();
  };

  return (
    <div>
      <ModuleHeader title="Diet & Fitness Tracker" description="Add and update meals, workouts, and weight logs." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Meal log">
          <form className="mb-3 space-y-2" onSubmit={addMeal}>
            <select className="w-full rounded-lg border px-3 py-2" value={mealType} onChange={(e) => setMealType(e.target.value)}>
              <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snacks</option>
            </select>
            <input className="w-full rounded-lg border px-3 py-2" placeholder="Meal description" value={mealText} onChange={(e) => setMealText(e.target.value)} />
            <button className="rounded-lg bg-brand-700 px-3 py-2 text-white">Save meal</button>
          </form>
          <ul className="space-y-2 text-sm">
            {meals.map((meal) => <li key={meal.id} className="rounded-lg border p-2">{meal.meal_type}: {meal.description}</li>)}
          </ul>
        </Card>

        <Card title="Workout logs">
          <form className="mb-3 space-y-2" onSubmit={addWorkout}>
            <input className="w-full rounded-lg border px-3 py-2" placeholder="Workout type" value={workoutType} onChange={(e) => setWorkoutType(e.target.value)} />
            <input className="w-full rounded-lg border px-3 py-2" type="number" placeholder="Duration (mins)" value={workoutMins} onChange={(e) => setWorkoutMins(e.target.value)} />
            <button className="rounded-lg bg-brand-700 px-3 py-2 text-white">Save workout</button>
          </form>
          <ul className="space-y-2 text-sm">
            {workouts.map((w) => <li key={w.id} className="rounded-lg border p-2">{w.workout_type} ({w.duration_mins ?? '-'} mins)</li>)}
          </ul>
        </Card>

        <Card title="Weight tracking">
          <form className="mb-3 space-y-2" onSubmit={addWeight}>
            <input className="w-full rounded-lg border px-3 py-2" type="number" step="0.1" placeholder="Current weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <button className="rounded-lg bg-brand-700 px-3 py-2 text-white">Save weight</button>
          </form>
          <ul className="space-y-2 text-sm">
            {weights.map((w) => <li key={w.id} className="rounded-lg border p-2">{w.log_date}: {w.weight_kg} kg</li>)}
          </ul>
        </Card>
      </div>
    </div>
  );
}
