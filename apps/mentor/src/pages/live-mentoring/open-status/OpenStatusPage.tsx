import {
  useLiveMentoringOpenStatusQuery,
  useLiveMentoringSettingsQuery,
} from '@/api/live-mentoring/liveMentoring';
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

const OpenStatusPage = () => {
  const { data, isLoading } = useLiveMentoringOpenStatusQuery();
  /*
   * 타이틀·카테고리는 개설이 아니라 **상품** 소유라 개설 이력 행에 들어 있지 않다.
   * 표 상단 요약 한 곳에만 둔다 — 행마다 반복하면 과거 개설에 현재 제목이 붙어
   * "그때 이 제목으로 열었다"는 거짓 정보가 된다.
   */
  const { data: settings } = useLiveMentoringSettingsQuery();

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

      {settings &&
        (settings.liveMentoringId === null ? (
          <p className="text-xsmall14 text-neutral-40">
            아직 만들어진 상품이 없습니다. 오픈 설정에서 타이틀과 타입을 먼저
            저장해주세요.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {/*
              표에서 옮겨온 타이틀이라 줄바꿈 규칙도 같이 가져온다 —
              `break-keep`(word-break: keep-all) 이 없으면 좁은 화면에서
              "자소서 실전 첨" / "삭 멘토링" 처럼 단어 중간이 끊긴다.
            */}
            <span className="text-xsmall16 text-neutral-10 break-keep font-semibold">
              {settings.title}
            </span>
            <span className="text-xsmall14 text-neutral-40">
              {settings.categories.map((c) => CATEGORY_LABELS[c]).join(' · ')}
            </span>
          </div>
        ))}

      {/*
        표가 `min-w-[560px]` 라 좁은 화면에서는 컨테이너를 넘친다.
        `overflow-hidden` 이면 넘친 열이 잘린 채 접근할 방법이 없으므로 가로 스크롤을 준다.
      */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[560px]">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
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
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
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
