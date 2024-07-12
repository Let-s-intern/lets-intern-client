import { useQuery } from '@tanstack/react-query';
import { getLiveIdSchema } from '../schema';
import axios from '../utils/axios';

export const useLiveQueryKey = 'useLiveQueryKey';

export const useLiveQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useLiveQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}`);
      return getLiveIdSchema.parse(res.data.data);
    },
  });
};
