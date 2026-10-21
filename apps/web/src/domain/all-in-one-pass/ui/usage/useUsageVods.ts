import { useQuery } from '@tanstack/react-query';
import type { PassVod } from '../../types';

/** 나의 패스 이용 > VOD 목록 (route handler 프록시 경유) */
export const useUsageVods = () =>
  useQuery<PassVod[]>({
    queryKey: ['all-in-one-pass', 'vods'],
    queryFn: async () => {
      const res = await fetch('/api/all-in-one-pass/vods');
      if (!res.ok) throw new Error('VOD 목록 조회 실패');
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
