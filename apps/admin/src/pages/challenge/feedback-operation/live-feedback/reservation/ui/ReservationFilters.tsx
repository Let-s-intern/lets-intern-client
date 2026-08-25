import { twMerge } from '@/lib/twMerge';
import type { ReservationFilterState } from '../utils/buildListParams';
import {
  RESERVATION_TYPE_OPTIONS,
  type ReservationTypeFilter,
} from '../utils/reservationRow';

interface SelectOption {
  value: string;
  label: string;
}

interface ReservationFiltersProps {
  filter: ReservationFilterState;
  onChange: (next: ReservationFilterState) => void;
  challengeOptions: SelectOption[];
  mentorOptions: SelectOption[];
  /**
   * 유형이 고정된 화면(1대1 전용 하위탭)에서는 유형 select 를 감춘다.
   * 고정 유형과 다른 값을 고를 수 있으면 탭 이름과 목록 내용이 어긋난다.
   */
  hideTypeFilter?: boolean;
}

const inputClassName =
  'border-neutral-80 text-xsmall14 rounded border px-3 py-2';

export default function ReservationFilters({
  filter,
  onChange,
  challengeOptions,
  mentorOptions,
  hideTypeFilter = false,
}: ReservationFiltersProps) {
  const update = <K extends keyof ReservationFilterState>(
    key: K,
    value: ReservationFilterState[K],
  ) => {
    onChange({ ...filter, [key]: value });
  };

  // 1대1에는 프로그램명이 없다. 유형을 바꾸면서 직전 선택을 함께 비운다.
  const updateType = (type: ReservationTypeFilter) => {
    onChange({
      ...filter,
      type,
      challengeId: type === 'LIVE_MENTORING' ? '' : filter.challengeId,
    });
  };

  const challengeDisabled = filter.type === 'LIVE_MENTORING';

  return (
    <div className="border-neutral-80 grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-3">
      {!hideTypeFilter && (
        <label className="flex flex-col gap-1">
          <span className="text-xsmall14 text-neutral-0 font-medium">유형</span>
          <select
            aria-label="유형"
            value={filter.type}
            onChange={(e) =>
              updateType(e.target.value as ReservationTypeFilter)
            }
            className={inputClassName}
          >
            {RESERVATION_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-xsmall14 text-neutral-0 font-medium">
          프로그램명
        </span>
        <select
          aria-label="프로그램명"
          value={filter.challengeId}
          onChange={(e) => update('challengeId', e.target.value)}
          disabled={challengeDisabled}
          className={twMerge(
            inputClassName,
            challengeDisabled && 'bg-neutral-95 text-neutral-40',
          )}
        >
          <option value="">전체</option>
          {challengeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {challengeDisabled && (
          <span className="text-xxsmall12 text-neutral-40">
            1대1 라이브 멘토링에는 챌린지가 없어 프로그램명으로 거를 수
            없습니다.
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xsmall14 text-neutral-0 font-medium">멘토명</span>
        <select
          value={filter.mentorId}
          onChange={(e) => update('mentorId', e.target.value)}
          className={inputClassName}
        >
          <option value="">전체</option>
          {mentorOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xsmall14 text-neutral-0 font-medium">멘티명</span>
        {/*
          멘티 필터는 별도 검색 API 부재(PRD §7-1 기본안)로 예약 목록 결과에서
          이름 부분 일치하는 클라이언트 필터로 동작한다.
        */}
        <input
          type="text"
          value={filter.menteeName}
          onChange={(e) => update('menteeName', e.target.value)}
          placeholder="멘티 이름"
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xsmall14 text-neutral-0 font-medium">
          예약 날짜
        </span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            aria-label="예약 날짜 시작"
            value={filter.feedbackStartDate}
            onChange={(e) => update('feedbackStartDate', e.target.value)}
            className={inputClassName}
          />
          <span className="text-neutral-40">~</span>
          <input
            type="date"
            aria-label="예약 날짜 끝"
            value={filter.feedbackEndDate}
            onChange={(e) => update('feedbackEndDate', e.target.value)}
            className={inputClassName}
          />
        </div>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xsmall14 text-neutral-0 font-medium">
          신청 날짜
        </span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            aria-label="신청 날짜 시작"
            value={filter.createStartDate}
            onChange={(e) => update('createStartDate', e.target.value)}
            className={inputClassName}
          />
          <span className="text-neutral-40">~</span>
          <input
            type="date"
            aria-label="신청 날짜 끝"
            value={filter.createEndDate}
            onChange={(e) => update('createEndDate', e.target.value)}
            className={inputClassName}
          />
        </div>
      </label>
    </div>
  );
}
