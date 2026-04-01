export type HabitType = 'learning' | 'namaz' | 'workout' | 'diet';

export interface HabitLog {
  id: string;
  user_id: string;
  date: string;
  learning_hours: number;
  namaz_count: number;
  workout_done: boolean;
  workout_type?: string | null;
  diet_followed: boolean;
}

export interface WeightLog {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number;
}

export interface Expense {
  id: string;
  user_id: string;
  date: string;
  amount: number;
  category: string;
  note?: string | null;
}

export interface Debt {
  id: string;
  user_id: string;
  name: string;
  total_amount: number;
  remaining_amount: number;
  interest_rate?: number | null;
}

export interface Emi {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_day: number;
  active: boolean;
}

export interface LearningLog {
  id: string;
  user_id: string;
  date: string;
  skill: string;
  hours: number;
}

export interface PregnancyLog {
  id: string;
  user_id: string;
  date: string;
  weight_kg?: number | null;
  diet_note?: string | null;
  medication?: string | null;
  reminder?: string | null;
}

export interface MealLog {
  id: string;
  user_id: string;
  date: string;
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  description: string;
  calories?: number | null;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  date: string;
  type: string;
  duration_min: number;
  intensity?: string | null;
}
