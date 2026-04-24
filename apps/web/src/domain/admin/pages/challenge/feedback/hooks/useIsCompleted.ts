'use client';

import { FeedbackStatusEnum } from '@/api/challenge/challengeSchema';
import { useEffect, useState } from 'react';
import type { AttendanceRow } from '../types';

const { COMPLETED, CONFIRMED } = FeedbackStatusEnum.enum;

const useIsCompleted = () => {
  const [isCompleted, setIsCompleted] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const attendance: AttendanceRow = JSON.parse(
      localStorage.getItem('attendance') ?? '{}',
    );

    if (
      attendance.feedbackStatus === COMPLETED ||
      attendance.feedbackStatus === CONFIRMED
    ) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
    setIsLoading(false);
  }, []);

  return { isCompleted, isLoading };
};

export default useIsCompleted;
