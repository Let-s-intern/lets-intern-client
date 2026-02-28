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

const COMPARE_ROWS: { label: string; key: keyof (typeof CHALLENGE_COMPARISON)[0] }[] = [
  { label: '추천 대상', key: 'target' },
  { label: '기간', key: 'duration' },
  { label: '플랜별 가격', key: 'pricing' },
  { label: '피드백 횟수', key: 'feedback' },
  { label: '결과물', key: 'deliverable' },
  { label: '커리큘럼', key: 'curriculum' },
];

const MobileInfoRow = ({
  label,
  values,
}: {
  label: string;
  values: string[];
}) => (
  <div className="flex flex-col">
    {/* 라벨 행 — 회색 배경 */}
    <div className="bg-neutral-90 px-5 py-3">
      <span className="text-xs font-semibold text-[#5c5f66]">{label}</span>
    </div>
    {/* 값 행 — 2분할 */}
    <div className="flex gap-3 border-b border-neutral-200 px-5 py-4">
      {values.map((value, i) => (
        <div key={i} className="min-w-0 flex-1">
          <span className="whitespace-pre-line text-sm text-[#27272d]">
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

  // 동적 제목 생성
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
    // 전체화면 오버레이
    <div className="fixed inset-x-0 top-0 z-50 flex h-screen flex-col bg-white">
      {/* sticky 헤더 — 뒤로가기 버튼 + "비교함" 타이틀 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-200 bg-white px-5 py-4">
        <button type="button" onClick={onClose} className="shrink-0">
          <MdOutlineArrowBack size="1.5rem" />
        </button>
        <span className="text-base font-semibold text-[#27272d]">비교함</span>
      </header>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto pb-8">
        {/* 동적 제목 */}
        <div className="px-5 pb-4 pt-6">
          <h4 className="text-xl font-bold text-[#27272d]">{compareTitle}</h4>
        </div>

        {/* 프로그램 썸네일 + 바로가기 버튼 — 좌우 2분할 */}
        <div className="flex gap-3 px-5 pb-6">
          {programs.map((program) => (
            <div key={program.id} className="flex flex-1 flex-col gap-3">
              <div
                className="aspect-video w-full rounded-[7px] p-3"
                style={{ backgroundColor: CARD_COLORS[program.id as ProgramId] }}
              >
                <span className="text-sm font-bold text-white">
                  {program.title}
                </span>
              </div>
              <span className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-5 text-[#27272d]">
                {program.title}
              </span>
              <a
                href={`/program/challenge/${program.id}`}
                className="flex items-center justify-center rounded-lg bg-[#f3f3f3] py-2.5 transition-colors hover:bg-[#e7e7e7]"
              >
                <span className="text-xs font-semibold text-[#5c5f66]">
                  바로가기
                </span>
              </a>
            </div>
          ))}
        </div>

        {/* 비교 항목 테이블 */}
        <div className="flex flex-col">
          {COMPARE_ROWS.map(({ label, key }) => (
            <MobileInfoRow
              key={label}
              label={label}
              values={comparisons.map((c) => String(c[key] ?? '-'))}
            />
          ))}
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
