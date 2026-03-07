'use client';

import Link from 'next/link';

// TODO: API 연동 시 교체
interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  createDate: string;
}

const MOCK_NOTICE_MAP: Record<string, NoticeDetail> = {
  '1': {
    id: 1,
    title: '3월 활동비 정산 서류 제출 및 등록 안내 (~03.20)',
    content:
      '안녕하세요, 렛츠커리어입니다.\n\n3월 활동비 정산을 위한 서류 제출 및 등록 안내드립니다.\n\n제출 기한: 2026년 3월 20일까지\n\n자세한 내용은 아래를 참고해 주세요.',
    createDate: '2026-03-07',
  },
  '2': {
    id: 2,
    title: '4월 챌린지 멘토 배정 확정 일정 공유',
    content:
      '안녕하세요, 렛츠커리어입니다.\n\n4월 챌린지 멘토 배정 확정 일정을 공유드립니다.',
    createDate: '2026-03-06',
  },
  '3': {
    id: 3,
    title: '딱 1분만 투자해 주세요',
    content:
      '안녕하세요, 렛츠커리어입니다.\n\n멘토님들의 소중한 의견을 듣고자 간단한 설문을 준비했습니다.\n설문 완료 시 기프티콘을 보내드립니다.\n\n설문 기한: 2026년 3월 17일까지',
    createDate: '2026-03-07',
  },
  '4': {
    id: 4,
    title: '일부 멘토 피드백 전송 실패 현상 안내 (복구 완료)',
    content:
      '안녕하세요, 렛츠커리어입니다.\n\n일부 멘토 피드백 전송 실패 현상이 발생하여 안내드립니다.\n현재 복구가 완료되었습니다.\n\n불편을 드려 죄송합니다.',
    createDate: '2026-03-05',
  },
  '5': {
    id: 5,
    title: '일부 멘토 피드백 전송 실패 현상 안내 (복구 중)',
    content:
      '안녕하세요, 렛츠커리어입니다.\n\n일부 멘토 피드백 전송 실패 현상이 발생하여 안내드립니다.\n현재 복구 작업이 진행 중입니다.',
    createDate: '2026-03-04',
  },
  '6': {
    id: 6,
    title: '서비스 안정화를 위한 정기 점검 안내',
    content:
      '안녕하세요, 렛츠커리어입니다.\n\n서비스 안정화를 위한 정기 점검을 아래와 같이 진행합니다.\n\n점검 일시: 2026.03.05 04:25 ~ 2026.03.05 05:25\n\n점검 시간 동안 서비스 이용이 제한될 수 있습니다.\n불편을 드려 죄송합니다.',
    createDate: '2026-03-02',
  },
};

export default function NoticeDetailPage({
  noticeId,
}: {
  noticeId: string;
}) {
  // TODO: API 연동 시 useQuery로 교체
  const notice = MOCK_NOTICE_MAP[noticeId];

  if (!notice) {
    return (
      <div className="flex flex-col gap-10">
        <h1 className="text-medium22 font-semibold text-neutral-0">
          공지사항
        </h1>
        <div className="py-20 text-center text-xsmall16 text-neutral-40">
          존재하지 않는 공지사항입니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-medium22 font-semibold text-neutral-0">공지사항</h1>

      <div className="flex flex-col gap-4">
        <Link
          href="/mentor/notice"
          className="flex items-center gap-1 text-xsmall14 text-neutral-40 hover:text-neutral-10"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          뒤로 가기
        </Link>

        <div className="flex flex-col gap-6 rounded-[16px] border border-neutral-80 p-6 md:gap-8 md:p-10">
          <h2 className="text-medium24 font-bold text-neutral-0">
            {notice.title}
          </h2>
          <p className="whitespace-pre-line text-xsmall16 leading-7 text-neutral-10">
            {notice.content}
          </p>
        </div>
      </div>
    </div>
  );
}
