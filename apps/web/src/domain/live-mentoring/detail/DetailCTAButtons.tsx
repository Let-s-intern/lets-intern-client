'use client';

import {
  DesktopApplyCTA,
  DesktopCTA,
  MobileApplyCTA,
  MobileCTA,
} from '@/common/button/ApplyCTA';
import dayjs from '@/lib/dayjs';

interface DetailCTAButtonsProps {
  title: string;
  /**
   * 예약 가능 슬롯 중 가장 이른 시작 시각(`LocalDateTime`).
   * 예약 가능한 슬롯이 하나도 없으면 null.
   */
  beginning: string | null;
  /**
   * 예약 가능 슬롯 중 가장 늦은 종료 시각(`LocalDateTime`).
   * 예약 가능한 슬롯이 하나도 없으면 null.
   */
  deadline: string | null;
  /** 신청 CTA 클릭 — 상세 페이지가 신청 시트를 연다. */
  onApplyClick: () => void;
}

/** 슬롯이 하나도 없을 때의 비활성 버튼. 공용 CTA 의 비활성 버튼과 같은 규격이다. */
const NoSlotButton = () => (
  <button
    disabled
    className="bg-neutral-80 text-xsmall16 text-neutral-40 w-full rounded-sm px-6 py-3 font-medium"
  >
    현재 예약 가능한 일정이 없습니다
  </button>
);

/**
 * 상세 페이지 하단 고정 신청 CTA.
 *
 * 챌린지·라이브·VOD 상페가 모두 쓰는 공용 컴포넌트(`common/button/ApplyCTA`)를 그대로
 * 쓴다 — 데스크탑 우하단 바 / 모바일 하단 고정 바, 마감 카운트다운, 인스타그램 인앱
 * 브라우저 경고까지 다른 상페와 동작이 같아진다.
 *
 * 슬롯이 하나도 없으면 바를 감추지 않고 비활성 상태로 남긴다. `ApplyCTA` 에 그냥
 * null 을 넘기면 안 된다 — `deadline` 이 null 이면 "출시알림신청" 을 띄우도록 되어 있어
 * 의도와 전혀 다른 화면이 나온다. 그래서 분기를 여기서 처리하고 공용 컴포넌트는
 * 레이아웃 껍데기(`MobileCTA`/`DesktopCTA`)만 빌려 쓴다.
 *
 * 신청을 누르면 상세 페이지가 들고 있는 신청 시트를 연다. 시트 상태를 여기서 갖지
 * 않는 이유는 히어로의 플랜 카드도 같은 시트를 열기 때문이다 — 주인은 페이지다.
 */
const DetailCTAButtons = ({
  title,
  beginning,
  deadline,
  onApplyClick,
}: DetailCTAButtonsProps) => {
  if (beginning === null || deadline === null) {
    return (
      <>
        <MobileCTA
          className="flex flex-col items-center lg:hidden"
          title={title}
        >
          <NoSlotButton />
        </MobileCTA>
        <DesktopCTA className="hidden items-center justify-between gap-8 lg:flex">
          <span className="font-bold text-neutral-100">{title}</span>
          <div className="flex min-w-80 max-w-[60rem] justify-end">
            <NoSlotButton />
          </div>
        </DesktopCTA>
      </>
    );
  }

  const now = dayjs();
  const firstSlotStart = dayjs(beginning);
  const program = {
    title,
    /*
      공개 슬롯 API 는 시작이 미래인 슬롯만 내려준다. 첫 슬롯 시작을 그대로 넘기면
      `ApplyCTA` 의 `isOutOfDate`(= 지금이 beginning 이전) 가 항상 참이 되어
      "출시알림신청" 이 뜬다. 열려 있는 슬롯이 있으면 신청은 지금부터 가능하므로
      시작이 미래면 현재 시각으로 당긴다.
    */
    beginning: firstSlotStart.isAfter(now) ? now : firstSlotStart,
    /*
      마감은 마지막 슬롯이 끝나는 시각이다. 기간이 날짜 단위이던 시절의
      `endOf('day')` 보정은 걷어냈다 — 슬롯은 시각 단위라 17:30 에 끝나는 일정이
      23:59 까지 열려 있는 것처럼 보인다.
    */
    deadline: dayjs(deadline),
  };

  return (
    <>
      <MobileApplyCTA
        program={program}
        onApplyClick={onApplyClick}
        isAlreadyApplied={false}
      />
      <DesktopApplyCTA
        program={program}
        onApplyClick={onApplyClick}
        isAlreadyApplied={false}
      />
    </>
  );
};

export default DetailCTAButtons;
