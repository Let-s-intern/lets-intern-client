import type { ReservationFilterState } from '../utils/buildListParams';

interface SelectOption {
  value: string;
  label: string;
}

interface ReservationFiltersProps {
  filter: ReservationFilterState;
  onChange: (next: ReservationFilterState) => void;
  challengeOptions: SelectOption[];
  mentorOptions: SelectOption[];
}

const inputClassName =
  'border-neutral-80 text-xsmall14 rounded border px-3 py-2';

export default function ReservationFilters({
  filter,
  onChange,
  challengeOptions,
  mentorOptions,
}: ReservationFiltersProps) {
  const update = <K extends keyof ReservationFilterState>(
    key: K,
    value: ReservationFilterState[K],
  ) => {
    onChange({ ...filter, [key]: value });
  };

  return (
    <div className="border-neutral-80 grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-3">
      <label className="flex flex-col gap-1">
        <span className="text-xsmall14 text-neutral-0 font-medium">
          프로그램명
        </span>
        <select
          value={filter.challengeId}
          onChange={(e) => update('challengeId', e.target.value)}
          className={inputClassName}
        >
          <option value="">전체</option>
          {challengeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
