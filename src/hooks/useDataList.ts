import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseDataListOptions<T> {
  fetcher: () => Promise<{ data: T[] | null; error: any }>;
  initialData?: T[];
  onError?: (error: any) => void;
  autoFetch?: boolean;
}

export function useDataList<T>({ 
  fetcher, 
  initialData = [], 
  onError,
  autoFetch = true 
}: UseDataListOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<any>(null);
  
  // Keep fetcher stable to prevent infinite loops if user passes an inline function
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    
    try {
      const { data: result, error: fetchError } = await fetcherRef.current();
      
      if (fetchError) throw fetchError;
      
      if (result) {
        setData(result);
      }
    } catch (err: any) {
      console.error(err);
      setError(err);
      if (onError) {
        onError(err);
      } else {
        // Default error handling
        toast.error(err.message || '加载列表失败');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [onError]);

  // Initial load
  useEffect(() => {
    if (autoFetch) {
      refresh();
    }
  }, [refresh, autoFetch]);

  // Optimistic helpers
  const optimisticAdd = (item: T) => {
    setData(prev => [item, ...prev]);
  };

  const optimisticUpdate = (idKey: keyof T, updatedItem: T) => {
    setData(prev => prev.map(item => 
      // @ts-ignore
      item[idKey] === updatedItem[idKey] ? updatedItem : item
    ));
  };

  const optimisticDelete = (idKey: keyof T, idValue: any) => {
    setData(prev => prev.filter(item => 
      // @ts-ignore
      item[idKey] !== idValue
    ));
  };

  return {
    data,
    loading,
    error,
    refresh,
    setData,
    optimisticAdd,
    optimisticUpdate,
    optimisticDelete
  };
}
