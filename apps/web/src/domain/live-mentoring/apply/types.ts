import type {
  LiveMentoringCategory,
  LiveMentoringDuration,
} from '@/api/live-mentoring/liveMentoringSchema';

/**
 * 신청 시트에서 고른 슬롯 1칸.
 *
 * 슬롯은 서버에서 30분 고정으로 내려온다(`liveMentoringSlotSchema`). 60분 플랜은
 * 이 칸을 연속 2개 고르는 것이지, 60분짜리 슬롯이 따로 있는 것이 아니다.
 */
export interface SelectedApplySlot {
  slotId: number;
  /** 'YYYY-MM-DD' — 캘린더에서 고른 날. */
  date: string;
  /** 'HH:mm' — 시작 시각. */
  time: string;
  /** 서버 원본 `LocalDateTime`. 신청 생성 때 그대로 쓴다. */
  startDate: string;
  /** 서버 원본 `LocalDateTime`. 연속 판정에 쓴다. */
  endDate: string;
}

/**
 * 신청 시트가 채워 나가는 입력값.
 *
 * 이 Push 는 여기까지만 만든다. 실제 신청 생성(`POST`)은 Push 3 이다.
 */
export interface ApplyDraft {
  /**
   * 선택한 플랜.
   *
   * 상세 응답 `durationPrices[]` 에는 id 가 없고 `{ duration, price }` 뿐이라
   * **진행시간(분)이 곧 플랜 식별자**다. 한 개설이 같은 진행시간을 두 번 열 수는 없다.
   */
  duration: LiveMentoringDuration | null;
  /** 30분 플랜은 1개, 60분 플랜은 연속 2개. 플랜이 바뀌면 비워진다. */
  slots: SelectedApplySlot[];
  /**
   * 신청 생성 DTO 의 `mentoringCategory`.
   *
   * 멘토가 오픈 설정에서 고른 타입 중 하나다. 상세 페이지의 유형 카드가 아니다 —
   * 카드는 필수가 아니라 비어 있을 수 있고, 그러면 고를 것이 없는 상품이 된다.
   */
  mentoringCategory: LiveMentoringCategory | null;
  /** 예약 시간 변경 고지 동의. 미체크면 신청할 수 없다. */
  agreedToScheduleChange: boolean;
}

/**
 * 시간 버튼 한 칸.
 *
 * 목록에 있다는 것이 곧 고를 수 있다는 뜻이다 — 고를 수 없는 자리는 만들지 않으므로
 * 선택 가능 여부를 나타내는 필드가 없다.
 */
export interface ApplySlotOption {
  /** 'HH:mm' — 시작 시각. 그날 목록 안에서 유일하다. */
  time: string;
  /** 버튼 문구 (예: '10:00 ~ 10:30'). */
  label: string;
}
