import { CHALLENGE_COMPARISON } from '../shared/comparisons';
import { PROGRAMS } from '../shared/programs';
import type { ProgramId } from '../types';

interface CompareResultCardProps {
  programIds: ProgramId[];
  onClose: () => void;
}

const InfoRow = ({ label, values }: { label: string; values: string[] }) => (
  <div className="flex items-start gap-10 border-b border-[#e6e6e6] py-4">
    <div className="w-20 shrink-0 text-sm font-semibold leading-5 text-black">
      {label}
    </div>
    <div className="flex flex-1 gap-10">
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

const CompareResultCard = ({ programIds, onClose }: CompareResultCardProps) => {
  const programs = programIds.map((id) => PROGRAMS[id]);
  const comparisons = programIds.map(
    (id) => CHALLENGE_COMPARISON.find((c) => c.programId === id)!,
  );

  const compareTitle = programs.map((p) => p.shortTitle).join(' vs ');

  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white px-10 py-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between gap-5">
        <h4 className="text-base font-bold leading-6 text-black">
          {compareTitle}
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#7a7d84] transition-colors hover:bg-[#f3f3f3]"
        >
          닫기
        </button>
      </div>

      {/* 프로그램 썸네일 헤더 */}
      <div className="flex items-end gap-10 pl-[120px]">
        {programs.map((program) => (
          <div key={program.id} className="flex flex-1 flex-col gap-1">
            <div className="h-[9.375rem] w-full max-w-[12.5rem] overflow-hidden rounded-[5px]">
              <img
                src={program.thumbnail}
                alt={program.title}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold leading-5 text-[#27272d]">
              {program.title}
            </span>
          </div>
        ))}
      </div>

      {/* 비교 항목 */}
      <div className="flex flex-col">
        <InfoRow label="설명" values={comparisons.map((c) => c.description)} />
        <InfoRow label="추천 대상" values={comparisons.map((c) => c.target)} />
        <InfoRow label="기간" values={comparisons.map((c) => c.duration)} />
        <InfoRow
          label="플랜별 가격"
          values={comparisons.map((c) => c.pricing)}
        />
        <InfoRow
          label="피드백 및 특강"
          values={comparisons.map((c) => c.feedback)}
        />
        <InfoRow label="혜택" values={comparisons.map((c) => c.deliverable)} />
        <InfoRow
          label="커리큘럼"
          values={comparisons.map((c) => c.curriculum)}
        />
      </div>

      {/* CTA 버튼들 */}
      <div className="flex gap-10 pl-[7.5rem]">
        {programs.map((program) => (
          <a
            key={program.id}
            href={program.link}
            className="flex h-[2.875rem] flex-1 items-center justify-center rounded-lg bg-[#5f66f6] hover:bg-[#4d55f5]"
          >
            <span className="text-center text-xs font-bold leading-4 text-white">
              [{program.title}] 바로가기
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CompareResultCard;
