'use client';

import { useMyMentorApplicationsQuery } from '@/api/mentor-application/mentorApplication';
import Link from 'next/link';

import StatusResultCard from '../ui/StatusResultCard';

// 제목(신청 현황 조회)과 같은 왼쪽 정렬로 둔다
const messageClassName = 'text-xsmall14 text-neutral-30';

/** 회원 본인 신청 목록. 폼 없이 결과 카드만 최신순으로 보인다 */
export default function MyStatusSection() {
  const { data, isError } = useMyMentorApplicationsQuery();

  return (
    <div aria-live="polite">
      {isError ? (
        <p className={messageClassName}>
          조회하지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      ) : data?.length === 0 ? (
        <div className="flex flex-col items-start gap-6 py-8">
          <p className={messageClassName}>아직 신청한 내역이 없습니다.</p>
          <Link
            href="/mentor-apply"
            className="bg-primary text-static-100 hover:bg-primary-hover text-xsmall16 rounded-sm px-6 py-3 font-semibold transition-colors"
          >
            신청하기
          </Link>
        </div>
      ) : data ? (
        <ul className="flex flex-col gap-4">
          {data.map((application, index) => (
            <li key={`${application.submittedAt}-${index}`}>
              <StatusResultCard application={application} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
