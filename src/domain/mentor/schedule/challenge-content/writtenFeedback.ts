import type { ScheduleTypeConfig } from '../constants/scheduleConfig';

/** 서면 피드백 일정 설정 */
export const WRITTEN_FEEDBACK_CONFIG: ScheduleTypeConfig = {
  type: 'written-feedback',
  barStartOffset: 0,
  barEndOffset: 3,
  scrollTargetOffset: 1,
  segments: [
    {
      id: 'mission-submit',
      label: '멘티 미션제출기간',
      startOffset: -Infinity,
      endOffset: 0,
      lineStyle: 'faded',
      cardStyle: 'light',
      showBorder: false,
      isActionSegment: false,
      scrollTarget: false,
    },
    {
      id: 'review',
      label: '제출확인 기간',
      startOffset: 0,
      endOffset: 1,
      lineStyle: 'muted',
      cardStyle: 'light',
      showBorder: true,
      isActionSegment: false,
      scrollTarget: false,
    },
    {
      id: 'feedback-submit',
      label: '피드백 제출기간',
      startOffset: 1,
      endOffset: 3,
      lineStyle: 'solid',
      cardStyle: 'primary',
      showBorder: true,
      isActionSegment: true,
      scrollTarget: true,
    },
  ],
};
