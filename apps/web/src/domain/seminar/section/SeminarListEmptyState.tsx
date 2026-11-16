'use client';

import ProgramCard from '@/domain/program/programs/card/ProgramCard';
import { useSeminarList } from '../hooks/useSeminarList';
import SuggestSeminarCta from './SuggestSeminarCta';

/** 지난 세미나 미리보기로 노출할 최대 개수(한 줄) */
const PREVIEW_COUNT = 4;

interface SeminarListEmptyStateProps {
  onGoClosed: () => void;
}

/**
 * 모집 중 세미나 0건 빈 상태(S4-empty).
 * 안내 문구 + 제안 CTA(placeholder) + 지난 세미나 미리보기 + 종료 탭 이동 버튼.
 */
const SeminarListEmptyState = ({ onGoClosed }: SeminarListEmptyStateProps) => {
  const { data } = useSeminarList('closed');
  const previewPrograms = (data?.programList ?? []).slice(0, PREVIEW_COUNT);

  return (
    <div className="flex flex-col items-center gap-12 md:gap-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xsmall14 text-neutral-45 md:text-xsmall16">
          현재 모집 중인 무료 세미나가 없어요
        </p>
        <h3 className="text-small18 font-bold text-neutral-0 md:text-medium24">
          곧{' '}
          <span className="inline-block -rotate-2 rounded-none bg-primary px-2 py-1 text-neutral-100">
            더 유익해진
          </span>{' '}
          <br className="md:hidden" />
          무료 세미나로 찾아올게요
        </h3>
      </div>

      <SuggestSeminarCta />

      {previewPrograms.length > 0 && (
        <div className="flex w-full flex-col items-center gap-6">
          <h4 className="text-small18 font-bold text-neutral-0 md:text-medium24">
            지금까지 진행된 무료 세미나에요!
          </h4>
          <div className="grid w-full grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4 md:gap-y-11">
            {previewPrograms.map((program) => (
              <ProgramCard
                key={program.programInfo.programType + program.programInfo.id}
                program={program}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onGoClosed}
            className="rounded-xs bg-neutral-0 px-5 py-3 text-xsmall14 font-semibold text-neutral-100 md:text-xsmall16"
          >
            종료된 무료 세미나 보러가기
          </button>
        </div>
      )}
    </div>
  );
};

export default SeminarListEmptyState;
