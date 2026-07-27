import { useLiveMentoringOpenStatusQuery } from '@/api/live-mentoring/liveMentoring';
import type { OpenStatusRow } from '@/api/live-mentoring/liveMentoringSchema';
import { CATEGORY_LABELS, durationLabel, formatPrice } from '../constants';

const STATUS_LABEL: Record<OpenStatusRow['status'], string> = {
  OPEN: '오픈중',
  CLOSED: '마감',
};

const STATUS_CLASS: Record<OpenStatusRow['status'], string> = {
  OPEN: 'bg-primary-10 text-primary',
  CLOSED: 'bg-gray-100 text-gray-500',
};

// 헤더는 "피드백 기간"·"예약 수"처럼 공백이 있어 좁은 열에서 두 줄로 쪼개진다.
const headerCellClass =
  'whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-gray-500';
const bodyCellClass = 'px-4 py-3 text-sm text-gray-700';

/**
 * 통째로 하나의 값인 셀 — 절대 끊지 않는다.
 * 기본 `word-break: normal` 은 **한글을 글자 단위로 끊어서**, 좁은 열에서
 * "30분·6" / "0분" 이나 "07-14 ~" / "07-28" 같은 깨진 표기가 나온다.
 */
const atomicCellClass = `${bodyCellClass} whitespace-nowrap`;

/**
 * 길어질 수 있는 한글 텍스트 셀 — 줄바꿈은 허용하되 **어절 단위로만** 끊는다.
 * `break-keep`(word-break: keep-all) 이 없으면 "자소서 실전 첨" / "삭 멘토링" 처럼
 * 단어 중간에서 잘린다.
 */
const textCellClass = `${bodyCellClass} break-keep`;

const OpenStatusPage = () => {
  const { data, isLoading } = useLiveMentoringOpenStatusQuery();

  return (
    <div className="flex flex-col gap-6 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          오픈 현황
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          내가 오픈한 1대1 라이브 멘토링의 상태와 예약 수를 확인하세요.
        </p>
        {/* 예약/결제 시스템이 아직 없어 서버가 예약 수를 항상 0으로 준다 — 의도된 한계. */}
        <p className="text-xs text-gray-400">
          * 예약 수는 예약 시스템 연동 전까지 0으로 표시됩니다.
        </p>
      </header>

      {/*
        표가 `min-w-[560px]` 라 좁은 화면에서는 컨테이너를 넘친다.
        `overflow-hidden` 이면 넘친 열이 잘린 채 접근할 방법이 없으므로 가로 스크롤을 준다.
      */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[560px]">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className={headerCellClass}>타이틀</th>
              <th className={headerCellClass}>카테고리</th>
              <th className={headerCellClass}>진행시간</th>
              <th className={headerCellClass}>피드백 기간</th>
              <th className={headerCellClass}>가격</th>
              <th className={headerCellClass}>상태</th>
              <th className={headerCellClass}>예약 수</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  오픈한 멘토링이 없습니다.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={`${row.categories.join()}-${index}`}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className={textCellClass}>{row.title}</td>
                  <td className={textCellClass}>
                    {row.categories.map((c) => CATEGORY_LABELS[c]).join(' · ')}
                  </td>
                  <td className={atomicCellClass}>
                    {row.durations.map(durationLabel).join('·')}
                  </td>
                  <td className={atomicCellClass}>
                    {`${row.feedbackStartDate.slice(5)} ~ ${row.feedbackEndDate.slice(5)}`}
                  </td>
                  <td className={atomicCellClass}>
                    {row.durations.length > 1 ? '최저 ' : ''}
                    {formatPrice(row.price)}
                  </td>
                  <td className={bodyCellClass}>
                    <span
                      className={`whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[row.status]}`}
                    >
                      {STATUS_LABEL[row.status]}
                    </span>
                  </td>
                  <td className={atomicCellClass}>{row.reservationCount}건</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpenStatusPage;
