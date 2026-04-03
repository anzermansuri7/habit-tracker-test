export type Role = 'admin' | 'regular';

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string | null;
  age: number | null;
  gender: string | null;
  weight_kg: number | null;
  height_cm: number | null;
  role: Role;
  selected_modules: string[];
}

export const SERVICE_OPTIONS = [
  'Habit Tracker',
  'Diet and Fitness Tracker',
  'Finance',
  'Pregnancy',
  'Learning & Career',
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];
