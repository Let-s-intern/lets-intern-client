'use client';

import { MdOutlineArrowBack } from 'react-icons/md';
import { CHALLENGE_COMPARISON } from '../shared/comparisons';
import { PROGRAMS } from '../shared/programs';
import type { ProgramId } from '../types';
import { CARD_COLORS } from './ChallengeCard';

interface MobileCompareViewProps {
  programIds: ProgramId[];
  onClose: () => void;
}

const MobileInfoRow = ({
  label,
  values,
}: {
  label: string;
  values: string[];
}) => (
  <div className="flex flex-col gap-2 border-b border-[#e6e6e6] py-4">
    <span className="text-xs font-semibold text-[#7a7d84]">{label}</span>
    <div className="flex gap-3">
      {values.map((value, i) => (
        <div key={i} className="min-w-0 flex-1">
          <span className="whitespace-pre-line text-sm leading-[22px] text-black">
            {value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const MobileCompareView = ({ programIds, onClose }: MobileCompareViewProps) => {
  const programs = programIds.map((id) => PROGRAMS[id]);
  const comparisons = programIds.map(
    (id) => CHALLENGE_COMPARISON.find((c) => c.programId === id)!,
  );

  // 4.3 동적 제목 생성
  const titleParts = programs.map((p) => {
    if (p.title.includes('경험정리')) return '경험정리';
    if (p.title.includes('이력서')) return '이력서';
    if (p.title.includes('대기업')) return '대기업 자소서';
    if (p.title.includes('자기소개서')) return '자소서';
    if (p.title.includes('포트폴리오')) return '포트폴리오';
    if (p.title.includes('마케팅')) return '마케팅';
    if (p.title.includes('HR')) return 'HR';
    return p.title;
  });
  const compareTitle = titleParts.join(' vs ');

  return (
    // 4.1 전체화면 오버레이
    <div className="fixed inset-x-0 top-0 z-50 flex h-screen flex-col bg-white">
      {/* 4.2 sticky 헤더 — 뒤로가기 버튼 + "비교함" 타이틀 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#e6e6e6] bg-white px-5 py-4">
        <button type="button" onClick={onClose} className="shrink-0">
          <MdOutlineArrowBack size="1.5rem" />
        </button>
        <span className="text-base font-semibold text-[#27272d]">비교함</span>
      </header>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {/* 4.3 동적 제목 */}
        <h4 className="py-5 text-lg font-bold leading-[26px] text-[#27272d]">
          {compareTitle}
        </h4>

        {/* 4.4 프로그램 썸네일 + 바로가기 버튼 — 좌우 2분할 */}
        <div className="flex gap-3 pb-6">
          {programs.map((program) => (
            <div key={program.id} className="flex flex-1 flex-col gap-2">
              <div
                className="flex h-24 w-full items-end overflow-hidden rounded-lg p-3"
                style={{ backgroundColor: CARD_COLORS[program.id as ProgramId] }}
              >
                <span className="text-sm font-bold text-white">
                  {program.title}
                </span>
              </div>
              <span className="line-clamp-1 text-xs font-semibold leading-4 text-[#27272d]">
                {program.title}
              </span>
              <a
                href={`/program/challenge/${program.id}`}
                className="flex h-9 items-center justify-center rounded-lg bg-[#f3f3f3] transition-colors hover:bg-[#e7e7e7]"
              >
                <span className="text-center text-xs font-bold leading-4 text-[#4c4f56]">
                  바로가기
                </span>
              </a>
            </div>
          ))}
        </div>

        {/* 4.5 비교 항목 테이블 — 라벨 행 + 2분할 값 행 */}
        <div className="flex flex-col">
          <MobileInfoRow
            label="추천 대상"
            values={comparisons.map((c) => c.target)}
          />
          <MobileInfoRow
            label="기간"
            values={comparisons.map((c) => c.duration)}
          />
          <MobileInfoRow
            label="플랜별 가격"
            values={comparisons.map((c) => c.pricing)}
          />
          <MobileInfoRow
            label="피드백 횟수"
            values={comparisons.map((c) => c.feedback)}
          />
          <MobileInfoRow
            label="결과물"
            values={comparisons.map((c) => c.deliverable)}
          />
          <MobileInfoRow
            label="커리큘럼"
            values={comparisons.map((c) => c.curriculum)}
          />
          {comparisons.some((c) => c.features) && (
            <MobileInfoRow
              label="주요 특징"
              values={comparisons.map((c) => c.features ?? '-')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileCompareView;
