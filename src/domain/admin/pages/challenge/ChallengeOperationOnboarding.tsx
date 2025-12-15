'use client';

import { challengeSchema } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
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
