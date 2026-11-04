'use client';

// 선택일의 프로그램/일정 목록 — 상태 뱃지·일시·참여/대시보드 버튼
import SolidButton from '@/common/button/SolidButton';
import dayjs from '@/lib/dayjs';
import { useToast } from '@letscareer/ui';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import type {
  NormalizedCalendarEvent,
  PassCalendarEventType,
  PassParticipationStatus,
} from '../../../types';
import { useCalendarApply } from './CalendarApplyContext';

type Day = ReturnType<typeof dayjs>;

/** 캘린더 유형 라벨 (프로그램 종류 아님 — 어드민 캘린더 유형) */
const TYPE_LABEL: Record<PassCalendarEventType, string> = {
  CHALLENGE: '챌린지',
  LIVE: 'LIVE 클래스',
  GUERRILLA: '게릴라세션',
  MILESTONE: '기타 일정',
};

const STATUS_LABEL: Record<PassParticipationStatus, string> = {
  BEFORE: '참여 가능',
  IN_PROGRESS: '참여 중',
  DONE: '참여 완료',
};
const STATUS_BADGE: Record<PassParticipationStatus, string> = {
  IN_PROGRESS: 'bg-primary-10 text-primary',
  BEFORE: 'border-neutral-80 text-primary border',
  DONE: 'bg-neutral-90 text-neutral-40',
};

interface Props {
  date: Day;
  events: NormalizedCalendarEvent[];
  stickyTop?: number;
}

export default function CalendarDayList({ date, events, stickyTop }: Props) {
  const router = useRouter();
  const toast = useToast();
  const { applyChallenge, applyLive } = useCalendarApply();
  const rootRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  // 날짜 변경 시 목록을 최상단으로 리셋 (이전 스크롤 위치 유지 방지)
  const dateKey = date.valueOf();
  useEffect(() => {
    if (stickyTop != null) {
      // 모바일: 페이지 스크롤 — 목록 상단이 sticky 헤더 위치에 오도록 (아래로는 안 끌어내림)
      const el = rootRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - stickyTop;
      if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top) });
    } else if (ulRef.current) {
      // 데스크탑: 내부 스크롤 리셋
      ulRef.current.scrollTop = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  return (
    <div
      ref={rootRef}
      className="border-neutral-80 rounded-xs flex min-h-[260px] w-full flex-col md:min-h-0 md:w-[312px] md:border"
    >
      <div
        className={clsx(
          'border-neutral-80 flex items-center justify-between px-0 py-2 md:border-b md:px-4 md:pb-3 md:pt-4',
          stickyTop != null && 'sticky z-10 bg-white',
        )}
        style={stickyTop != null ? { top: stickyTop } : undefined}
      >
        <span className="text-small18 text-neutral-0 font-bold">
          {date.format('M월 D일')} 프로그램
        </span>
        <span className="text-small18 text-primary font-medium">
          {events.length}개
        </span>
      </div>

      {events.length === 0 ? (
        <p className="text-xsmall14 text-neutral-40 py-16 text-center">
          해당 일자에 일정이 없습니다.
        </p>
      ) : (
        <ul
          ref={ulRef}
          className="custom-scrollbar flex flex-col px-0 md:h-[480px] md:overflow-y-auto md:px-4"
        >
          {events.map((ev) => {
            // 챌린지 참여 여부는 status 로 판정(참여중/완료). challengeApplicationId 는
            // '시작한' 참여건만 채워지므로(시작 전이면 null) 참여 판정에 쓰면 안 된다.
            const participating =
              ev.type === 'CHALLENGE' &&
              ev.status != null &&
              ev.status !== 'BEFORE';
            // 대시보드 route 는 시작한 챌린지(challengeApplicationId 있음)만 만들 수 있다.
            const started = ev.challengeApplicationId != null;
            const detailHref =
              ev.programId != null
                ? `/program/challenge/${ev.programId}`
                : undefined;
            const dashboardHref =
              started && ev.programId != null
                ? `/challenge/${ev.challengeApplicationId}/${ev.programId}`
                : undefined;
            const showChevron = ev.type === 'CHALLENGE' && detailHref != null;
            const isJoinEvent =
              ev.type === 'GUERRILLA' || ev.type === 'MILESTONE';
            const now = dayjs();
            const joinOpen =
              isJoinEvent &&
              !now.isBefore(dayjs(ev.startDate).subtract(10, 'minute')) &&
              (!ev.endDate || !now.isAfter(dayjs(ev.endDate)));
            const liveNow =
              ev.type === 'LIVE' &&
              ev.status === 'IN_PROGRESS' &&
              !now.isBefore(dayjs(ev.startDate)) &&
              (!ev.endDate || !now.isAfter(dayjs(ev.endDate)));
            // 모집 시작 전(챌린지·라이브 공통) — 신청 불가라 상세 랜딩으로 보낸다
            const recruitUpcoming =
              ev.beginning != null && dayjs(ev.beginning).isAfter(now);

            const onChevron = () => {
              if (detailHref) router.push(detailHref);
            };

            return (
              <li
                key={ev.id}
                className="border-neutral-80 flex flex-col gap-3 border-b px-4 py-5 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  {ev.status && (
                    <span
                      className={clsx(
                        'text-xxsmall12 rounded-[3px] px-2 py-1 font-medium',
                        STATUS_BADGE[ev.status],
                      )}
                    >
                      {STATUS_LABEL[ev.status]}
                    </span>
                  )}
                  <span className="text-xxsmall12 text-neutral-40">
                    {TYPE_LABEL[ev.type]}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xsmall16 text-neutral-0 truncate font-bold">
                    {ev.title}
                  </span>
                  {showChevron && (
                    <button
                      type="button"
                      aria-label="상세 보기"
                      className="shrink-0"
                      onClick={onChevron}
                    >
                      <ChevronRight size={20} className="text-neutral-30" />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {ev.description && (
                    <p className="text-xxsmall12 text-neutral-30 line-clamp-2 font-normal">
                      {ev.description}
                    </p>
                  )}

                  <p className="text-xxsmall12 text-neutral-40 flex flex-wrap items-center justify-between gap-y-1 tracking-tight md:justify-normal md:gap-x-8">
                    <span className="flex gap-1 whitespace-nowrap">
                      {ev.type !== 'CHALLENGE' ? (
                        <>
                          <span>일시</span>
                          <span>
                            {dayjs(ev.startDate).format('YY.MM.DD HH:mm')}
                            {ev.endDate &&
                              (dayjs(ev.endDate).isSame(
                                dayjs(ev.startDate),
                                'day',
                              )
                                ? ` ~ ${dayjs(ev.endDate).format('HH:mm')}`
                                : ` ~ ${dayjs(ev.endDate).format('YY.MM.DD HH:mm')}`)}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>진행기간</span>
                          <span>
                            {dayjs(ev.startDate).format('YY.MM.DD')}
                            {ev.endDate
                              ? ` ~ ${dayjs(ev.endDate).format('YY.MM.DD')}`
                              : ''}
                          </span>
                        </>
                      )}
                    </span>
                    {liveNow && (
                      <span className="text-system-error flex shrink-0 items-center gap-1 whitespace-nowrap font-semibold">
                        <span className="bg-system-error size-1.5 shrink-0 rounded-full" />
                        LIVE 진행 중
                      </span>
                    )}
                  </p>
                </div>

                {ev.type === 'CHALLENGE' && (
                  <SolidButton
                    size="sm"
                    className="text-xsmall14 w-full"
                    // 참여 중인데 아직 시작 전이면 입장 불가 → 비활성화
                    disabled={participating && !started}
                    onClick={() => {
                      if (participating) {
                        // 시작한 챌린지만 대시보드 입장, 시작 전이면 안내(마이페이지와 동일).
                        if (dashboardHref) {
                          router.push(dashboardHref);
                        } else {
                          toast.toast({
                            variant: 'default',
                            title: '아직 시작 전인 챌린지예요',
                            description:
                              '시작일 이후 대시보드에 입장할 수 있어요.',
                          });
                        }
                        return;
                      }
                      // 미참여: 모집예정은 신청 불가 → 랜딩, 모집중은 바텀시트
                      if (recruitUpcoming) {
                        if (detailHref) router.push(detailHref);
                        return;
                      }
                      if (ev.programId != null) applyChallenge(ev.programId);
                    }}
                  >
                    {participating ? '대시보드 입장' : '참여하기'}
                  </SolidButton>
                )}
                {isJoinEvent && ev.url && (
                  <SolidButton
                    size="sm"
                    disabled={!joinOpen}
                    onClick={() =>
                      window.open(ev.url!, '_blank', 'noopener,noreferrer')
                    }
                    className="text-xsmall14 w-full"
                  >
                    참여하기
                  </SolidButton>
                )}
                {ev.type === 'LIVE' &&
                  ev.status === 'BEFORE' &&
                  ev.programId != null && (
                    <SolidButton
                      size="sm"
                      className="text-xsmall14 w-full"
                      onClick={() => {
                        // 모집예정 라이브는 신청 불가 → 랜딩, 모집중은 0원 신청 모달
                        if (recruitUpcoming) {
                          router.push(`/program/live/${ev.programId}`);
                          return;
                        }
                        applyLive(ev.programId!, ev.title);
                      }}
                    >
                      참여하기
                    </SolidButton>
                  )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
