-- Run this after creating at least one auth user.
-- Replace USER_ID_HERE with a valid uuid from auth.users.
insert into public.users (id, full_name, phone, age, gender, weight_kg, height_cm, role)
values ('USER_ID_HERE', 'Demo User', '+10000000000', 30, 'Male', 75, 175, 'regular')
on conflict (id) do nothing;

insert into public.habits (user_id, name, target_value, unit)
values
('USER_ID_HERE', 'Learning', 2, 'hours'),
('USER_ID_HERE', 'Namaz', 5, 'times'),
('USER_ID_HERE', 'Workout', 1, 'session'),
('USER_ID_HERE', 'Diet adherence', 1, 'yes/no');
-- Run after creating one real auth user. Replace <USER_ID> with auth uid.
insert into public.habit_logs (user_id, date, learning_hours, namaz_count, workout_done, workout_type, diet_followed)
values
  ('<USER_ID>', current_date - 2, 1.5, 5, true, 'Strength', true),
  ('<USER_ID>', current_date - 1, 2.0, 4, true, 'Cardio', true);

insert into public.weight_logs (user_id, date, weight_kg)
values
  ('<USER_ID>', current_date - 2, 74.2),
  ('<USER_ID>', current_date - 1, 73.8);
