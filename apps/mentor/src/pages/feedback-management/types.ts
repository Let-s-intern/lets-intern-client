import type { FeedbackStatus } from '@/api/challenge/challengeSchema';
import type { LiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import type { PeriodBarData } from '@/pages/schedule/types';
import type { LiveFeedbackRound } from './hooks/useLiveFeedbackList';

/**
 * 11컬럼 통합 표의 한 행을 표현하는 타입.
 *
 * 서면(`type === 'written'`)·라이브(`type === 'live'`)·1대1 라이브 멘토링
 * (`type === 'live-mentoring'`)이 동일한 타입을 공유하되, 일부 컬럼은 한쪽에서만
 * 의미를 가진다 (서면=참여/멘토참여 빈값, 라이브=멘티 제출 빈값).
 * 빈 컬럼은 selector 단계에서 `null`로 채우고 표는 그대로 렌더한다.
 *
 * 1대1은 챌린지에 속하지 않아 스키마가 그대로 맞지 않는다. 아래 각 필드 주석이
 * 컬럼별 계약이고, 1대1에서 달라지는 것만 정리하면 이렇다.
 *
 * | 컬럼 | 1대1 행의 값 |
 * |---|---|
 * | 챌린지 (`challengeTitle`) | `1대1 라이브 멘토링` 고정. 상품명은 멘토당 하나뿐이라 싣지 않는다 |
 * | 미션 회차 (`thLabel`) | `해당 없음`. 빈 칸으로 두면 "안 냈음"으로 읽힌다 |
 * | 멘티 제출 (`submissionLabel`) | 신청 시 낸 질문·전달 파일을 제출물로 본다 |
 * | 멘티·멘토 참여 | 예약 응답에 출석이 없다. `null`(표에서 `·`) |
 * | 상세 (`canOpenDetail`) | 항상 `true`. 멘티 제출물 모달을 연다 |
 */
export interface FeedbackRow {
  /**
   * React key 용 고유 id
   * (`written-{missionId}` / `live-{feedbackId|missionId}` / `live-mentoring-{applicationId}`)
   */
  id: string;
  /** 행 종류 */
  type: 'written' | 'live' | 'live-mentoring';
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
    | 'liveWaiting'
    | 'liveCompleted'
    | 'liveMissed'
    | 'liveCancelled'
    | null;

  /**
   * 컬럼: 멘티 예약 — 라이브·1대1 전용 ('예약 전' | '예약 완료'). 서면 = null.
   * 1대1은 서버가 결제 완료 확정 건만 내리므로 항상 '예약 완료'다.
   */
  reservationLabel: '예약 전' | '예약 완료' | null;
  /**
   * 컬럼: 멘티 제출 — '제출' | '일부 제출' | '지각 제출' | '미제출'.
   * '지각 제출'은 서면 행 전용(피드백 대상이 아님을 표에서 구분). 라이브는 제출물
   * 미연동 영역이라 null 가능.
   * '일부 제출'은 1대1 행 전용 — 질문과 전달 파일 중 하나만 냈을 때다.
   */
  submissionLabel: '제출' | '일부 제출' | '지각 제출' | '미제출' | null;
  /**
   * 컬럼: 멘티 — 참여 표시 (라이브 전용). 서면 = null.
   * 1대1도 null 이다 — 예약 응답에 출석 정보가 없다.
   */
  menteeParticipation: '참여' | '불참' | null;
  /** 컬럼: 멘토 — 참여 표시 (라이브 전용). 서면·1대1 = null */
  mentorParticipation: '참여' | '불참' | null;

  /** 컬럼: 챌린지. 1대1은 챌린지가 없어 `1대1 라이브 멘토링` 으로 채운다 */
  challengeTitle: string;
  /** 컬럼: 미션 회차 — "5회차" 형태. 1대1은 회차가 없어 `해당 없음` 으로 채운다 */
  thLabel: string;
  /** 컬럼: 피드백 일정 — 사전 포맷된 표기 문자열 */
  scheduleLabel: string;
  /** 컬럼: 멘티 성명 (라이브=세션 멘티, 서면=요약 라벨) */
  menteeNameLabel: string;
  /** 컬럼: 상세 보기 활성화 여부 */
  canOpenDetail: boolean;
  /**
   * 상세를 못 여는 이유. `canOpenDetail === false` 이면서 이 값이 있으면 표가
   * 잠긴 버튼과 함께 이유를 보여 준다. 이유 없이 잠긴 버튼은 고장으로 읽힌다.
   * 서면 미제출 행처럼 이유를 적지 않는 경우는 null.
   */
  detailDisabledReason: string | null;

  /** 모달 진입에 필요한 원본 데이터 (분기는 type 기준) */
  source:
    | {
        type: 'written';
        challengeId: number;
        missionId: number;
        missionTh: number;
        challengeTitle: string;
        /** 클릭한 멘티의 출석 id — 모달 초기 선택용 (미제출자는 null) */
        attendanceId: number | null;
      }
    | {
        type: 'live';
        bar: PeriodBarData;
        round: LiveFeedbackRound;
      }
    | {
        /**
         * 원본 예약을 그대로 싣는다. 상세를 열 때 여기서
         * `reservation.applicationId` 를 꺼내 제출물 모달에 넘긴다.
         */
        type: 'live-mentoring';
        reservation: LiveMentoringReservation;
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
