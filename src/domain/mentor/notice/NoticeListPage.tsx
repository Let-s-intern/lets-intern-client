'use client';

import Link from 'next/link';

// TODO: API 연동 시 교체
interface Notice {
  id: number;
  type: 'ESSENTIAL' | 'ADDITIONAL';
  title: string;
  createDate: string;
}

const MOCK_NOTICES: Notice[] = [
  {
    id: 1,
    type: 'ESSENTIAL',
    title: '3월 활동비 정산 서류 제출 및 등록 안내 (~03.20)',
    createDate: '2026-03-07',
  },
  {
    id: 2,
    type: 'ESSENTIAL',
    title: '4월 챌린지 멘토 배정 확정 일정 공유',
    createDate: '2026-03-06',
  },
  {
    id: 3,
    type: 'ADDITIONAL',
    title: '딱 1분만 투자해 주세요! 설문 완료 시 기프티콘 도착 (~03.17)',
    createDate: '2026-03-07',
  },
  {
    id: 4,
    type: 'ADDITIONAL',
    title: '일부 멘토 피드백 전송 실패 현상 안내 (복구 완료)',
    createDate: '2026-03-05',
  },
  {
    id: 5,
    type: 'ADDITIONAL',
    title: '일부 멘토 피드백 전송 실패 현상 안내 (복구 중)',
    createDate: '2026-03-04',
  },
  {
    id: 6,
    type: 'ADDITIONAL',
    title: '서비스 안정화를 위한 정기 점검 안내 (2026.03.05 04:25 ~ 2026.03.05 05:25)',
    createDate: '2026-03-02',
  },
];

function getRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '1일 전';
  return `${diffDays}일 전`;
}

export default function NoticeListPage() {
  // TODO: API 연동 시 useQuery로 교체
  const notices = MOCK_NOTICES;

  const essentialNotices = notices.filter((n) => n.type === 'ESSENTIAL');
  const additionalNotices = notices.filter((n) => n.type === 'ADDITIONAL');

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <h1 className="text-medium22 font-semibold text-neutral-0">공지사항</h1>

      {/* 중요 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-small18 font-semibold text-neutral-0">중요</h2>
        <div className="flex flex-col rounded-[16px] border border-neutral-80">
          {essentialNotices.length === 0 ? (
            <div className="px-6 py-8 text-center text-xsmall14 text-neutral-40">
              중요 공지사항이 없습니다.
            </div>
          ) : (
            essentialNotices.map((notice, i) => (
              <Link
                key={notice.id}
                href={`/mentor/notice/${notice.id}`}
                className={`flex items-center px-6 py-4 text-xsmall16 text-neutral-10 transition-colors hover:bg-neutral-95 ${
                  i < essentialNotices.length - 1
                    ? 'border-b border-neutral-80'
                    : ''
                }`}
              >
                {notice.title}
              </Link>
            ))
          )}
        </div>
      </section>

      {/* 실시간 공지 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-small18 font-semibold text-neutral-0">
          실시간 공지
        </h2>
        <div className="flex flex-col rounded-[16px] border border-neutral-80">
          {additionalNotices.length === 0 ? (
            <div className="px-6 py-8 text-center text-xsmall14 text-neutral-40">
              실시간 공지사항이 없습니다.
            </div>
          ) : (
            additionalNotices.map((notice, i) => (
              <Link
                key={notice.id}
                href={`/mentor/notice/${notice.id}`}
                className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-neutral-95 ${
                  i < additionalNotices.length - 1
                    ? 'border-b border-neutral-80'
                    : ''
                }`}
              >
                <span className="shrink-0 rounded border border-neutral-80 px-3 py-1 text-xxsmall12 text-neutral-40">
                  {getRelativeDate(notice.createDate)}
                </span>
                <span className="text-xsmall16 text-neutral-10">
                  {notice.title}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
