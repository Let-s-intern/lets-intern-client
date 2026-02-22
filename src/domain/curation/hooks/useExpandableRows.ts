import { useCallback, useState } from 'react';

export function useExpandableRows() {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = useCallback((rowKey: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  }, []);

  return { expandedRows, toggleRow };
}
