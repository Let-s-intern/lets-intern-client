'use client';

import ProgramStatusTag from '@/domain/program/programs/card/ProgramStatusTag';
import dayjs from '@/lib/dayjs';
import { ProgramInfo } from '@/schema';
import { PROGRAM_BADGE_STATUS } from '@/utils/programConst';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { captureSeminarCardClick, captureSeminarEncore } from '../analytics';
import MegaphoneIcon from './MegaphoneIcon';

// 완료 표시는 localStorage로 지속. localStorage는 기기 단위라 userId로 키를 나누지 않는다
// (나누면 useUserQuery 로딩 중 anon 키로 저장됐다가 userId 확정 시 상태가 풀리는 레이스 발생).
const encoreStorageKey = (programId: number) => `seminar_encore:${programId}`;

/**
 * 모집 종료 세미나 카드(figma 14). 썸네일·제목·진행일자 + 하단 "모집 완료" 뱃지와
 * "앵콜 요청" 버튼(요청하기/요청 완료 토글). 완료 여부는 localStorage로 지속하고,
 * 요청 시 PostHog 이벤트(seminar_encore_requested)를 캡처한다(취소는 캡처하지 않음).
 */
const SeminarClosedCard = ({
  program,
  userId,
}: {
  program: ProgramInfo;
  userId?: number;
}) => {
  const router = useRouter();
  const { programInfo } = program;
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    setRequested(
      localStorage.getItem(encoreStorageKey(programInfo.id)) === '1',
    );
  }, [programInfo.id]);

  const link = `/program/${programInfo.programType.toLowerCase()}/${programInfo.id}`;

  const handleEncore = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭(상세 이동)과 분리
    // 토글: 요청 ↔ 취소. PostHog 캡처는 요청 시에만(취소는 UI/캐시만).
    const next = !requested;
    const key = encoreStorageKey(programInfo.id);
    if (next) {
      localStorage.setItem(key, '1');
      captureSeminarEncore({
        seminarId: programInfo.id,
        seminarTitle: programInfo.title ?? null,
        status: 'POST',
        userId,
      });
    } else {
      localStorage.removeItem(key);
    }
    setRequested(next);
  };

  const handleCardClick = () => {
    captureSeminarCardClick({
      seminarId: programInfo.id,
      seminarTitle: programInfo.title ?? null,
      status: 'POST',
      userId,
    });
    router.push(link);
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex h-full w-full cursor-pointer flex-col gap-3"
    >
      <img
        className="bg-neutral-80 aspect-[540/421] w-full rounded-lg object-cover"
        src={programInfo.thumbnail || undefined}
        alt="세미나 썸네일"
      />
      <h3 className="text-xsmall14 md:text-xsmall16 line-clamp-2 font-semibold">
        {programInfo.title}
      </h3>
      {/* 진행일자 */}
      <div className="flex items-center gap-1.5">
        <span className="text-xxsmall12 md:text-xsmall14 text-neutral-0">
          진행일자
        </span>
        <span className="text-xxsmall12 md:text-xsmall14 text-primary font-semibold">
          {dayjs(programInfo.startDate).format('YY.MM.DD')}
        </span>
      </div>

      {/* 모집완료 뱃지(자기 줄) → 앵콜 버튼(풀폭) 세로 스택 (figma 19) */}
      <div className="flex flex-col items-start gap-2">
        <ProgramStatusTag status={PROGRAM_BADGE_STATUS.POST} />
        <button
          type="button"
          onClick={handleEncore}
          aria-pressed={requested}
          className={`text-xsmall14 rounded-xxs flex w-full items-center justify-center gap-1 whitespace-nowrap px-3.5 py-2 font-medium transition-colors ${requested ? 'bg-primary-80 text-neutral-85' : 'bg-primary-10 text-neutral-20'}`}
        >
          <MegaphoneIcon className="h-4 w-4" />
          {requested ? '앵콜 요청 완료' : '앵콜 요청하기'}
        </button>
      </div>
    </div>
  );
};

export default SeminarClosedCard;
