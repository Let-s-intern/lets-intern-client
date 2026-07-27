'use client';

import { DesktopApplyCTA, MobileApplyCTA } from '@/common/button/ApplyCTA';
import dayjs from '@/lib/dayjs';

interface DetailCTAButtonsProps {
  title: string;
  /** 신청 가능 기간 = 오픈 설정의 피드백 진행 일정. */
  beginning: string;
  deadline: string;
}

/**
 * 상세 페이지 하단 고정 신청 CTA.
 *
 * 챌린지·라이브·VOD 상페가 모두 쓰는 공용 컴포넌트(`common/button/ApplyCTA`)를 그대로
 * 쓴다 — 데스크탑 우하단 바 / 모바일 하단 고정 바, 마감 카운트다운, 인스타그램 인앱
 * 브라우저 경고까지 다른 상페와 동작이 같아진다.
 *
 * ⚠️ 결제·예약 플로우는 아직 없다. 신청을 누르면 준비 중임을 알린다.
 * TODO(결제 연동): `onApplyClick` 에서 플랜 선택 시트를 열도록 교체할 것.
 */
const DetailCTAButtons = ({
  title,
  beginning,
  deadline,
}: DetailCTAButtonsProps) => {
  const program = {
    title,
    // 오픈 기간은 날짜 단위라 시각이 00:00 으로 잡힌다.
    // 그대로 두면 종료일 당일에 이미 마감으로 판정돼 "출시알림신청" 이 뜬다.
    beginning: dayjs(beginning).startOf('day'),
    deadline: dayjs(deadline).endOf('day'),
  };

  const handleApplyClick = () => {
    window.alert('결제 기능은 준비 중입니다. 곧 신청하실 수 있어요!');
  };

  return (
    <>
      <MobileApplyCTA
        program={program}
        onApplyClick={handleApplyClick}
        isAlreadyApplied={false}
      />
      <DesktopApplyCTA
        program={program}
        onApplyClick={handleApplyClick}
        isAlreadyApplied={false}
      />
    </>
  );
};

export default DetailCTAButtons;
