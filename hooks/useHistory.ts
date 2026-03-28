'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { EditHistoryRecord } from '@/types';

export function useHistory(userId: string | null) {
  const [history, setHistory] = useState<EditHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('edit_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data ?? []);
    } catch (e) {
      console.error('Failed to fetch history:', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchHistory();
    else setHistory([]);
  }, [userId, fetchHistory]);

  const deleteRecord = useCallback(async (id: string) => {
    if (!userId) return;
    await supabase.from('edit_history').delete().eq('id', id).eq('user_id', userId);
    setHistory((prev) => prev.filter((r) => r.id !== id));
  }, [userId]);

  return { history, loading, fetchHistory, deleteRecord };
}