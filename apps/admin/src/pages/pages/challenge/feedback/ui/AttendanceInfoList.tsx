'use client';

// TODO: next/ → react-router-dom 또는 공유 어댑터로 교체 필요 (Vite 이전)
import Link from 'next/link';
import { memo } from 'react';
import useLocalStorageState from '../hooks/useLocalStorageState';

const AttendanceInfoList = memo(function AttendanceInfoList() {
  const { mission, attendance } = useLocalStorageState();
  const list = [
    `${attendance?.missionTitle} / ${attendance?.missionRound}회차`,
    `피드백 유형: ${mission?.challengeOptionTitle}`,
    `참여자 정보: ${attendance?.major} / ${attendance?.wishCompany} / ${attendance?.wishJob}`,
    <Link
      key={attendance?.link}
      href={
        attendance?.link ||
        `/admin/challenge/operation/${attendance?.id}/attendances/${mission?.id}/${attendance?.userId}`
      }
      className="text-primary underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      미션 제출 링크
    </Link>,
  ];

  return (
    <ul className="list-inside list-disc">
      {list.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
});

export default AttendanceInfoList;
