import { addDays } from 'date-fns';

// ---------------------------------------------------------------------------
// 일정 구간(Segment) 정의
// ---------------------------------------------------------------------------

/** 캘린더 바의 개별 구간 */
export interface BarSegment {
  /** 구간 식별자 */
  id: string;
  /** 카드에 표시할 라벨 */
  label: string;
  /** 구간 시작일 계산 (미션 endDate 기준 offset) */
  startOffset: number;
  /** 구간 종료일 계산 (미션 endDate 기준 offset) */
  endOffset: number;
  /** 상단 라인 스타일: 'solid' | 'faded' | 'muted' */
  lineStyle: 'solid' | 'faded' | 'muted';
  /** 카드 배경 스타일: 'primary' = 진한색, 'light' = 연한색 */
  cardStyle: 'primary' | 'light';
  /** 카드 오른쪽 구분선 표시 여부 */
  showBorder: boolean;
  /** 이 구간이 멘토의 주요 액션 구간인지 (회차/카운트/라인 표시 위치) */
  isActionSegment: boolean;
  /** 태그 클릭 시 이 구간으로 스크롤할지 */
  scrollTarget: boolean;
}

/** 일정 타입 설정 */
export interface ScheduleTypeConfig {
  /** 일정 타입 식별자 */
  type: string;
  /** 구간 목록 (순서대로 렌더링) */
  segments: BarSegment[];
  /** 전체 바 시작 offset (미션 startDate 기준, 보통 0) */
  barStartOffset: number;
  /** 전체 바 종료 offset (미션 endDate 기준) */
  barEndOffset: number;
  /** 스크롤 타겟 offset (미션 endDate 기준, 태그 클릭 시 이동 위치) */
  scrollTargetOffset: number;
}

// ---------------------------------------------------------------------------
// 헬퍼: 설정에서 날짜 계산
// ---------------------------------------------------------------------------

/** 설정 기반으로 feedbackStartDate, feedbackDeadline 계산 */
export function computeDatesFromConfig(
  config: ScheduleTypeConfig,
  missionEndDate: string,
) {
  const end = new Date(missionEndDate);
  return {
    feedbackStartDate: addDays(end, config.scrollTargetOffset).toISOString(),
    feedbackDeadline: addDays(end, config.barEndOffset).toISOString(),
  };
}

/** 각 구간이 차지하는 grid 칸 수 계산 */
export function computeSegmentColSpans(
  config: ScheduleTypeConfig,
  missionStartDate: string,
  missionEndDate: string,
) {
  const start = new Date(missionStartDate).getTime();
  const end = new Date(missionEndDate).getTime();
  const missionDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return config.segments.map((seg) => {
    const cols =
      seg.startOffset === -Infinity
        ? missionDays
        : seg.endOffset - seg.startOffset;
    return { segment: seg, cols };
  });
}
