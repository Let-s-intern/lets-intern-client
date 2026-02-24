'use client';

import { PROGRAMS } from '../shared/programs';
import { CHALLENGE_COMPARISON } from '../shared/comparisons';
import type { ProgramId } from '../types';

interface CompareResultCardProps {
  programIds: ProgramId[];
  onClose: () => void;
}

const InfoRow = ({
  label,
  values,
}: {
  label: string;
  values: string[];
}) => (
  <div className="flex border-b border-neutral-90">
    <div className="flex w-[140px] shrink-0 items-center bg-neutral-95 px-4 py-3 text-sm font-semibold text-neutral-20">
      {label}
    </div>
    {values.map((value, i) => (
      <div
        key={i}
        className="flex flex-1 items-center px-4 py-3 text-sm leading-5 text-neutral-30"
      >
        <span className="whitespace-pre-line">{value}</span>
      </div>
    ))}
  </div>
);

const CompareResultCard = ({ programIds, onClose }: CompareResultCardProps) => {
  const programs = programIds.map((id) => PROGRAMS[id]);
  const comparisons = programIds.map(
    (id) => CHALLENGE_COMPARISON.find((c) => c.programId === id)!,
  );

  return (
    <div className="flex w-full flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-neutral-0">비교 결과</h4>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200"
        >
          닫기
        </button>
      </div>

      {/* 비교 테이블 */}
      <div className="overflow-hidden rounded-xl border border-neutral-90 bg-white shadow-md">
        {/* 프로그램 헤더 */}
        <div className="flex border-b border-neutral-90">
          <div className="w-[140px] shrink-0 bg-neutral-95" />
          {programs.map((program) => (
            <div
              key={program.id}
              className="flex flex-1 flex-col gap-1 border-l border-neutral-90 px-4 py-4"
            >
              <span className="text-base font-bold text-neutral-0">
                {program.title}
              </span>
              <span className="text-xs text-neutral-50">
                {program.subtitle}
              </span>
            </div>
          ))}
        </div>

        {/* 비교 항목 */}
        <InfoRow
          label="추천 대상"
          values={comparisons.map((c) => c.target)}
        />
        <InfoRow
          label="기간"
          values={comparisons.map((c) => c.duration)}
        />
        <InfoRow
          label="플랜별 가격"
          values={comparisons.map((c) => c.pricing)}
        />
        <InfoRow
          label="피드백 횟수"
          values={comparisons.map((c) => c.feedback)}
        />
        <InfoRow
          label="결과물"
          values={comparisons.map((c) => c.deliverable)}
        />
        <InfoRow
          label="커리큘럼"
          values={comparisons.map((c) => c.curriculum)}
        />
        {comparisons.some((c) => c.features) && (
          <InfoRow
            label="주요 특징"
            values={comparisons.map((c) => c.features ?? '-')}
          />
        )}
      </div>

      {/* CTA 버튼들 */}
      <div className="flex gap-3">
        {programs.map((program) => (
          <a
            key={program.id}
            href={`/program/challenge/${program.id}`}
            className="flex flex-1 items-center justify-center rounded-lg bg-indigo-500 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            [{program.title}] 바로가기
          </a>
        ))}
      </div>
    </div>
  );
};

export default CompareResultCard;
