import type { FeedbackStatus } from '@/api/challenge/challengeSchema';
import type { PeriodBarData } from '@/pages/schedule/types';
import type { LiveFeedbackRound } from './hooks/useLiveFeedbackList';

/**
 * 11컬럼 통합 표의 한 행을 표현하는 타입.
 *
 * 서면(`type === 'written'`)과 라이브(`type === 'live'`)는 동일한 타입을 공유하되,
 * 일부 컬럼은 한쪽에서만 의미를 가진다 (서면=참여/멘토참여 빈값, 라이브=멘티 제출 빈값).
 * 빈 컬럼은 selector 단계에서 `null`로 채우고 표는 그대로 렌더한다.
 */
export interface FeedbackRow {
  /** React key 용 고유 id (`written-{missionId}` / `live-{feedbackId|missionId}`) */
  id: string;
  /** 행 종류 */
  type: 'written' | 'live';
  /** 정렬·표시 기준 일자. ISO 또는 YYYY-MM-DD */
  startDate: string;
  /** 라이브 행: 시작 시간 "HH:mm". 서면 행은 null */
  startTime: string | null;
  /** 종료 시간 "HH:mm". 서면 행은 null */
  endTime: string | null;

  /** 컬럼: 피드백 상태 — 라이브 4종 / 서면 4종 매핑 후 라벨 (없으면 null) */
  statusLabel: string | null;
  /** 컬럼: 피드백 상태 — 뱃지 색상 키 */
  statusTone:
    | 'completed'
    | 'inProgress'
    | 'waiting'
    | 'absent'
    | 'submitted'
    | 'notSubmitted'
    | null;

  /** 컬럼: 멘티 예약 — 라이브 전용 ('예약 전' | '예약 완료'). 서면 = null */
  reservationLabel: '예약 전' | '예약 완료' | null;
  /** 컬럼: 멘티 제출 — '제출' | '미제출'. 라이브에서는 제출물 미연동 영역이라 null 가능 */
  submissionLabel: '제출' | '미제출' | null;
  /** 컬럼: 멘티 — 참여 표시 (라이브 전용). 서면 = null */
  menteeParticipation: '참여' | '불참' | null;
  /** 컬럼: 멘토 — 참여 표시 (라이브 전용). 서면 = null */
  mentorParticipation: '참여' | '불참' | null;

  /** 컬럼: 챌린지 */
  challengeTitle: string;
  /** 컬럼: 미션 회차 — "5회차" 형태 */
  thLabel: string;
  /** 컬럼: 피드백 일정 — 사전 포맷된 표기 문자열 */
  scheduleLabel: string;
  /** 컬럼: 멘티 성명 (라이브=세션 멘티, 서면=요약 라벨) */
  menteeNameLabel: string;
  /** 컬럼: 상세 보기 활성화 여부 */
  canOpenDetail: boolean;

  /** 모달 진입에 필요한 원본 데이터 (분기는 type 기준) */
  source:
    | {
        type: 'written';
        challengeId: number;
        missionId: number;
        missionTh: number;
        challengeTitle: string;
      }
    | {
        type: 'live';
        bar: PeriodBarData;
        round: LiveFeedbackRound;
      };
}

/**
 * 라이브 슬롯 4종 UI 상태 (피드백 현황 표 행에서 사용).
 * `resolveLiveFeedbackStatus`와 동일한 의미를 갖는다.
 */
export type LiveRowUiStatus = 'waiting' | 'inProgress' | 'completed' | 'missed';

/**
 * 서면 행 piece — 미션 단위 상태 매핑 결과.
 * 서면은 멘티별 행이 아니라 미션 단위 요약 행이다.
 */
export interface WrittenRowSummary {
  hasSubmission: boolean;
  isAllComplete: boolean;
  hasFeedbackStarted: boolean;
  submittedCount: number;
  notSubmittedCount: number;
}

/**
 * 라이브 행 — `FeedbackStatus`(BE) + 시간 기준.
 * Push 2의 `resolveLiveFeedbackStatus` 매핑 결과 재사용.
 */
export type LiveBeStatus = FeedbackStatus;
