import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'library_my_first_visited';

type VisitState = 'first' | 'return' | null;

export function useLibraryMyVisit() {
  const [visitState, setVisitState] = useState<VisitState>(null);

  useEffect(() => {
    const visited = localStorage.getItem(STORAGE_KEY);
    setVisitState(visited ? 'return' : 'first');
  }, []);

  const markVisited = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisitState('return');
  }, []);

  return { visitState, markVisited };
}
