import { useMemo, useState } from 'react';

import { LIVE_FEEDBACK_MOCK_DATA } from '@/pages/schedule/challenge-content/liveFeedbackMock';

interface MenteeRow {
  menteeName: string;
  challengeTitle: string;
  challengeId: number;
  sessionCount: number;
  completedCount: number;
}

/**
 * 좌측 메뉴 "라이브설정 > 멘티관리" 페이지.
 *
 * BE 미연동 — 라이브 피드백 mock 에서 멘티 단위로 집계한 1차 골격.
 *
 * TODO(BE):
 *  - 멘티 리스트 API (멘티 프로필/제출 자료/연락처) 확정 후 mock 자리 교체
 *  - 검색·정렬·필터 (디자이너 명세 확정 후)
 *  - 멘티 상세 진입 (이력서/자소서 첨부 미리보기)
 */
const FeedbackLiveMenteePage = () => {
  const [keyword, setKeyword] = useState('');

  const mentees = useMemo<MenteeRow[]>(() => {
    const map = new Map<string, MenteeRow>();
    for (const bar of LIVE_FEEDBACK_MOCK_DATA) {
      if (bar.barType !== 'live-feedback' || !bar.liveFeedback) continue;
      const key = `${bar.challengeId}::${bar.liveFeedback.menteeName}`;
      const existing = map.get(key);
      const completed = bar.liveFeedback.status === 'completed' ? 1 : 0;
      if (existing) {
        existing.sessionCount += 1;
        existing.completedCount += completed;
      } else {
        map.set(key, {
          menteeName: bar.liveFeedback.menteeName,
          challengeTitle: bar.challengeTitle,
          challengeId: bar.challengeId,
          sessionCount: 1,
          completedCount: completed,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.menteeName.localeCompare(b.menteeName, 'ko'),
    );
  }, []);

  const filtered = useMemo(() => {
    const trimmed = keyword.trim();
    if (!trimmed) return mentees;
    return mentees.filter(
      (m) =>
        m.menteeName.includes(trimmed) || m.challengeTitle.includes(trimmed),
    );
  }, [mentees, keyword]);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          멘티관리
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          라이브 피드백을 신청한 멘티 목록을 확인하세요.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="멘티 이름 또는 챌린지명 검색"
          aria-label="멘티 검색"
          className="border-neutral-80 text-xsmall14 text-neutral-10 placeholder:text-neutral-50 h-9 rounded-md border bg-white px-3 sm:w-72"
        />
        <p className="text-xsmall14 text-neutral-40">
          총 <span className="text-neutral-10 font-semibold">{filtered.length}</span>
          명
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="border-neutral-85 flex flex-col items-center justify-center gap-2 rounded-md border bg-white py-16">
          <p className="text-small16 text-neutral-30 font-medium">
            검색 결과가 없습니다.
          </p>
          <p className="text-xsmall14 text-neutral-40">
            다른 키워드로 다시 검색해 보세요.
          </p>
        </div>
      ) : (
        <div className="border-neutral-85 overflow-hidden rounded-md border bg-white">
          <table className="w-full table-fixed">
            <thead className="bg-neutral-95">
              <tr className="text-xsmall14 text-neutral-30">
                <th className="px-4 py-2 text-left font-medium">멘티</th>
                <th className="px-4 py-2 text-left font-medium">챌린지</th>
                <th className="w-20 px-4 py-2 text-right font-medium">세션</th>
                <th className="w-20 px-4 py-2 text-right font-medium">완료</th>
              </tr>
            </thead>
            <tbody className="divide-neutral-90 divide-y">
              {filtered.map((m) => (
                <tr
                  key={`${m.challengeId}-${m.menteeName}`}
                  className="text-xsmall14"
                >
                  <td className="text-neutral-10 truncate px-4 py-3 font-medium">
                    {m.menteeName}
                  </td>
                  <td className="text-neutral-30 truncate px-4 py-3">
                    {m.challengeTitle}
                  </td>
                  <td className="text-neutral-30 px-4 py-3 text-right">
                    {m.sessionCount}
                  </td>
                  <td className="text-primary px-4 py-3 text-right font-semibold">
                    {m.completedCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-neutral-95 text-xxsmall12 text-neutral-40 rounded-md px-3 py-2">
        ⚠ 멘티 리스트는 mock 데이터입니다. 실제 데이터 연동은 BE API 확정 후
        진행됩니다.
      </div>
    </div>
  );
};

export default FeedbackLiveMenteePage;
