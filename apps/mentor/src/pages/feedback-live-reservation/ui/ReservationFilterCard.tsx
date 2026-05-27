import type {
  ReservationFilterState,
  UseReservationFiltersResult,
} from '../hooks/useReservationFilters';

interface ReservationFilterCardProps {
  filters: ReservationFilterState;
  setFilter: UseReservationFiltersResult['setFilter'];
  resetFilters: () => void;
  programTitleOptions: string[];
  menteeNameOptions: string[];
}

const fieldLabelClass = 'text-xsmall14 text-neutral-30 font-medium';
const selectClass =
  'text-xsmall14 text-neutral-10 border-neutral-80 focus:border-primary h-11 w-full rounded-md border bg-white px-3 outline-none';
const dateInputClass =
  'text-xsmall14 text-neutral-10 border-neutral-80 focus:border-primary h-11 w-full rounded-md border bg-white px-3 outline-none';

/**
 * 예약 현황 필터 카드.
 * 프로그램명/멘티명 select + 예약 날짜/신청 날짜 범위(date input).
 */
const ReservationFilterCard = ({
  filters,
  setFilter,
  resetFilters,
  programTitleOptions,
  menteeNameOptions,
}: ReservationFilterCardProps) => {
  return (
    <section className="border-neutral-85 flex flex-col gap-4 rounded-lg border bg-white p-5 md:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className={fieldLabelClass}>프로그램명</span>
          <select
            aria-label="프로그램명 검색"
            className={selectClass}
            value={filters.programTitle}
            onChange={(e) => setFilter('programTitle', e.target.value)}
          >
            <option value="">프로그램 선택...</option>
            {programTitleOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={fieldLabelClass}>멘티명</span>
          <select
            aria-label="멘티명 검색"
            className={selectClass}
            value={filters.menteeName}
            onChange={(e) => setFilter('menteeName', e.target.value)}
          >
            <option value="">멘티 선택...</option>
            {menteeNameOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1.5">
          <span className={fieldLabelClass}>예약 날짜</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              aria-label="예약 시작 날짜"
              className={dateInputClass}
              value={filters.reserveFrom}
              onChange={(e) => setFilter('reserveFrom', e.target.value)}
            />
            <span className="text-neutral-50">~</span>
            <input
              type="date"
              aria-label="예약 종료 날짜"
              className={dateInputClass}
              value={filters.reserveTo}
              onChange={(e) => setFilter('reserveTo', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className={fieldLabelClass}>신청 날짜</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              aria-label="신청 시작 날짜"
              className={dateInputClass}
              value={filters.createFrom}
              onChange={(e) => setFilter('createFrom', e.target.value)}
            />
            <span className="text-neutral-50">~</span>
            <input
              type="date"
              aria-label="신청 종료 날짜"
              className={dateInputClass}
              value={filters.createTo}
              onChange={(e) => setFilter('createTo', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={resetFilters}
          className="text-xsmall14 text-neutral-40 border-neutral-80 hover:bg-neutral-95 h-10 rounded-md border px-4 font-medium"
        >
          필터 초기화
        </button>
      </div>
    </section>
  );
};

export default ReservationFilterCard;
