import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useSupabaseTable<T extends { id: string; user_id: string }>(table: string) {
  const { session } = useAuth();
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRows = useCallback(async () => {
    if (!session?.user.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error(error);
      setRows([]);
    } else {
      setRows((data ?? []) as T[]);
    }
    setLoading(false);
  }, [session?.user.id, table]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const insert = useCallback(
    async (payload: Record<string, unknown>) => {
      if (!session?.user.id) return;
      const { error } = await supabase.from(table).insert({ ...payload, user_id: session.user.id });
      if (error) throw error;
      await fetchRows();
    },
    [fetchRows, session?.user.id, table],
  );

  return { rows, loading, insert, refresh: fetchRows };
}
