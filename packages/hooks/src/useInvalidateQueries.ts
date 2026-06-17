import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function useInvalidateQueries(queryKey?: QueryKey) {
  const client = useQueryClient();

  const invalidate = useCallback(async () => {
    await client.invalidateQueries({
      queryKey,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  return invalidate;
}
