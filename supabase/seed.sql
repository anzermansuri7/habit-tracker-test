-- Run after creating one real auth user. Replace <USER_ID> with auth uid.
insert into public.habit_logs (user_id, date, learning_hours, namaz_count, workout_done, workout_type, diet_followed)
values
  ('<USER_ID>', current_date - 2, 1.5, 5, true, 'Strength', true),
  ('<USER_ID>', current_date - 1, 2.0, 4, true, 'Cardio', true);

insert into public.weight_logs (user_id, date, weight_kg)
values
  ('<USER_ID>', current_date - 2, 74.2),
  ('<USER_ID>', current_date - 1, 73.8);
