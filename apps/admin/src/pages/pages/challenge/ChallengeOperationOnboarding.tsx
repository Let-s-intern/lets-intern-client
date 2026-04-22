'use client';

import { challengeSchema } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
// TODO: next/ → react-router-dom 또는 공유 어댑터로 교체 필요 (Vite 이전)
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ChallengeOnboarding = () => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['challenge', 'admin'],
    queryFn: async () => {
      const res = await axios.get(`/challenge?size=1000`);
      return challengeSchema.parse(res.data.data);
      // return challenges.parse(res.data.data);
    },
  });

  useEffect(() => {
    if (data) {
      router.push(`/admin/challenge/operation/${data.programList[0]?.id}/home`);
    }
  }, [data, router]);

  return null;
};

export default ChallengeOnboarding;
