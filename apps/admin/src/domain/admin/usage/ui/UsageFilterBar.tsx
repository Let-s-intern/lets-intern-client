import { useEffect, useState } from 'react';

import { PROGRAM_TYPE_OPTIONS } from '../constants/programType';
import {
  PAID_QUICK_RANGES,
  RECENT_UNUSED_PRESET_DAYS,
  RECENT_UNUSED_PRESET_LABEL,
  USAGE_SORT_OPTIONS,
  USAGE_STATUS_OPTIONS,
} from '../constants/usageFilter';
import {
  dateDaysAgo,
  hasAdvancedFilter,
  type UsageFilterKey,
  type UsageFilterState,
} from '../utils/usageFilterParams';
import UsageDateRangeFilter from './UsageDateRangeFilter';

/**
 * 이용 히스토리 검색·필터 (LC-3201, PRD 7.3).
 *
 * 자주 쓰는 조건을 1행에 두고 나머지를 접는다. 열 개를 한 줄에 늘어놓으면 화면이 무거워
 * 정작 매일 쓰는 조건을 찾지 못한다.
 *
 * 값은 이 컴포넌트가 들고 있지 않다. 전부 URL 에서 내려오고 변경은 위로 올린다 —
 * 화면이 조건을 따로 기억하면 주소창의 조건과 실제로 걸린 조건이 갈린다.
 */

const FIELD_CLASS = 'rounded border border-neutral-75 px-2 py-1';

/**
 * 주 액션(`검색`)이 가장 강해야 한다.
 *
 * 빠른 조회를 검정 배경으로 두었더니 이 영역에서 가장 강한 요소가 되어, 정작 주 액션인
 * 검색보다 시선을 먼저 가져갔다. 보조 기능이 주 기능보다 강하면 위계가 뒤집힌다.
 * 강조 방식은 환불 히스토리의 탭(`bg-neutral-0` + 흰 글자)과 같게 맞춘다.
 */
const PRIMARY_BUTTON_CLASS =
  'rounded border border-neutral-0 bg-neutral-0 px-3 py-1 text-sm text-white';
const BUTTON_CLASS = 'rounded border border-neutral-75 px-3 py-1 text-sm';

/** 날짜 입력 옆에 붙는 작은 버튼. 입력 높이를 넘지 않게 둔다. */
const QUICK_RANGE_CLASS =
  'rounded border border-neutral-75 px-2 py-1 text-xs whitespace-nowrap';

interface Props {
  filters: UsageFilterState;
  /** 값이 비면 조건을 지운다. 페이지 되돌림은 호출부가 맡는다. */
  onChange: (patch: Partial<Record<UsageFilterKey, string>>) => void;
  /** 빠른 선택의 기준 시각. 안에서 시계를 읽으면 테스트가 실제 날짜에 의존한다. */
  now?: Date | number;
}

/**
 * 검색어 입력 한 칸.
 *
 * 프로그램과 유저 두 칸이 같은 모양·같은 동작이어야 한다. 한쪽만 타자 중에 조회가 나가거나
 * 생김새가 다르면 운영이 두 칸을 다른 것으로 오해한다.
 */
const SearchField = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <label className="text-sm">
    <span className="text-neutral-40 mb-1 block">{label}</span>
    <input
      className={FIELD_CLASS}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);

const UsageFilterBar = ({ filters, onChange, now }: Props) => {
  // 입력 중에는 URL 을 건드리지 않는다. 타자마다 조회가 나가면 서버를 계속 때린다.
  const [programKeywordInput, setProgramKeywordInput] = useState(
    filters.programKeyword,
  );
  const [userKeywordInput, setUserKeywordInput] = useState(filters.userKeyword);

  // 뒤로 가기나 칩 해제로 조건이 바뀌면 입력칸도 그 조건을 보여줘야 한다.
  useEffect(
    () => setProgramKeywordInput(filters.programKeyword),
    [filters.programKeyword],
  );
  useEffect(
    () => setUserKeywordInput(filters.userKeyword),
    [filters.userKeyword],
  );

  const [advancedOpen, setAdvancedOpen] = useState(false);

  /*
    접어 둔 자리에 조건이 걸려 있으면 펼친다. 공유받은 링크에 상세 조건이 들어 있을 때
    접힌 채로 두면 보이지 않는 조건이 결과를 바꾸고, 운영은 그 이유를 화면에서 찾을 수 없다.
    반대로 자동으로 닫지는 않는다 — 사용자가 연 것을 화면이 되감으면 안 된다.
  */
  const advancedActive = hasAdvancedFilter(filters);
  useEffect(() => {
    if (advancedActive) setAdvancedOpen(true);
  }, [advancedActive]);

  const baseTime = now ?? Date.now();

  const submitKeywords = () =>
    onChange({
      programKeyword: programKeywordInput.trim(),
      userKeyword: userKeywordInput.trim(),
    });

  return (
    <form
      className="mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        submitKeywords();
      }}
    >
      <div className="flex flex-wrap items-end gap-3">
        <SearchField
          label="프로그램"
          placeholder="프로그램 제목 일부"
          value={programKeywordInput}
          onChange={setProgramKeywordInput}
        />

        <SearchField
          label="유저"
          placeholder="이름 또는 이메일"
          value={userKeywordInput}
          onChange={setUserKeywordInput}
        />

        <UsageDateRangeFilter
          label="결제일"
          from={filters.paidFrom}
          to={filters.paidTo}
          onChange={(range) =>
            onChange({ paidFrom: range.from, paidTo: range.to })
          }
          /*
            손으로 날짜를 두 번 고르는 일이 가장 잦아 빠른 선택을 붙인다.
            날짜 입력 아래가 아니라 같은 줄에 둔다 — 아래에 두면 이 칸만 2단이 되어
            같은 줄의 다른 입력들과 기준선이 어긋난다.
          */
          trailing={
            <div className="ml-1 flex gap-1">
              {PAID_QUICK_RANGES.map((range) => (
                <button
                  key={range.days}
                  type="button"
                  className={QUICK_RANGE_CLASS}
                  onClick={() =>
                    onChange({
                      paidFrom: dateDaysAgo(range.days, baseTime),
                      paidTo: '',
                    })
                  }
                >
                  {range.label}
                </button>
              ))}
              <button
                type="button"
                className={QUICK_RANGE_CLASS}
                onClick={() => onChange({ paidFrom: '', paidTo: '' })}
              >
                전체
              </button>
            </div>
          }
        />

        <label className="text-sm">
          <span className="text-neutral-40 mb-1 block">이용 상태</span>
          <select
            className={FIELD_CLASS}
            value={filters.usageStatus}
            onChange={(e) => onChange({ usageStatus: e.target.value })}
          >
            <option value="">전체</option>
            {/*
              `미이용` 과 `집계 이전` 을 한 선택지로 묶지 않는다. 묶으면 소급이 불가능한
              과거 결제가 미이용 목록에 섞이고, 그 목록이 잘못된 전액 환불의 근거가 된다.
            */}
            {USAGE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {/*
          버튼도 다른 칸과 같은 줄에 선다. 라벨 자리를 비워 두어 입력들과 바닥선을 맞춘다 —
          라벨이 있는 칸과 없는 칸이 섞이면 눈이 줄을 찾지 못한다.
        */}
        <div className="flex items-end gap-2">
          <button type="submit" className={PRIMARY_BUTTON_CLASS}>
            검색
          </button>

          {/*
            이 화면이 존재하는 이유인 질의다(PRD 5.5.3). 조건을 감추지 않고 필터에 채워 넣어,
            누른 뒤에도 무엇이 걸렸는지 보이고 손으로 6일·10일로 고칠 수 있게 한다.
            다만 보조 기능이라 주 액션인 `검색` 보다 약하게 둔다.
          */}
          <button
            type="button"
            className={BUTTON_CLASS}
            onClick={() =>
              onChange({
                paidFrom: dateDaysAgo(RECENT_UNUSED_PRESET_DAYS, baseTime),
                paidTo: '',
                usageStatus: 'NOT_USED',
              })
            }
          >
            {RECENT_UNUSED_PRESET_LABEL}
          </button>
        </div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          aria-expanded={advancedOpen}
          className="text-neutral-40 text-sm underline"
          onClick={() => setAdvancedOpen((prev) => !prev)}
        >
          {advancedOpen ? '상세 조건 접기' : '상세 조건 펼치기'}
        </button>
      </div>

      {advancedOpen && (
        <div className="border-neutral-80 bg-neutral-95 mt-2 flex flex-wrap items-end gap-3 rounded border p-3">
          <label className="text-sm">
            <span className="text-neutral-40 mb-1 block">프로그램 타입</span>
            <select
              className={FIELD_CLASS}
              value={filters.programType}
              onChange={(e) => onChange({ programType: e.target.value })}
            >
              <option value="">전체</option>
              {PROGRAM_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <UsageDateRangeFilter
            label="최초 이용일"
            from={filters.firstAccessedFrom}
            to={filters.firstAccessedTo}
            onChange={(range) =>
              onChange({
                firstAccessedFrom: range.from,
                firstAccessedTo: range.to,
              })
            }
          />

          <label className="flex items-center gap-2 text-sm">
            {/* 취소돼도 분쟁은 이어진다. 기본은 포함이다(PRD 5.5.1). */}
            <input
              type="checkbox"
              checked={filters.includeCanceled}
              onChange={(e) =>
                onChange({ includeCanceled: e.target.checked ? '' : 'false' })
              }
            />
            취소 건 포함
          </label>

          <label className="text-sm">
            <span className="text-neutral-40 mb-1 block">정렬</span>
            <select
              className={FIELD_CLASS}
              value={filters.sort}
              onChange={(e) => onChange({ sort: e.target.value })}
            >
              {USAGE_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </form>
  );
};

export default UsageFilterBar;
