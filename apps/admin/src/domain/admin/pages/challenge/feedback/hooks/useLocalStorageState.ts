import { ChallengeMissionFeedbackList } from '@/api/challenge/challengeSchema';
import { useEffect, useState } from 'react';
import type { AttendanceRow } from '../types';

const useLocalStorageState = () => {
  const [mission, setMission] =
    useState<ChallengeMissionFeedbackList['missionList'][0]>();
  const [attendance, setAttendance] = useState<AttendanceRow>();

  useEffect(() => {
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    setAttendance(attendance);
    const mission = JSON.parse(localStorage.getItem('mission') || '{}');
    setMission(mission);
  }, []);

  return { mission, attendance };
};

export default useLocalStorageState;
