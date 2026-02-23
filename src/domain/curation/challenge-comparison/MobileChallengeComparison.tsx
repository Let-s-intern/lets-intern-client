import { useState } from 'react';
import { PROGRAMS } from '../../data/constants';
import type { ChallengeComparisonRow, ProgramId } from '../../types/types';

interface MobileChallengeComparisonProps {
  challenges: ChallengeComparisonRow[];
  highlightedPrograms?: {
    primary: ProgramId | null;
    secondary: ProgramId[];
  };
}

const MobileChallengeComparison = ({
  challenges,
  highlightedPrograms = { primary: null, secondary: [] },
}: MobileChallengeComparisonProps) => {
  // 카드 내부 섹션 펼치기/접기
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {},
  );

  // 전체 카드 펼치기/접기 (추천되지 않은 카드는 기본 접혀있음)
  const [expandedChallenges, setExpandedChallenges] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    challenges.forEach((challenge) => {
      const isPrimary = highlightedPrograms.primary === challenge.programId;
      const isSecondary = highlightedPrograms.secondary.includes(
        challenge.programId,
      );
      // 추천된 프로그램만 펼쳐져 있음
      initial[challenge.programId] = isPrimary || isSecondary;
    });
    return initial;
  });

  const toggleChallenge = (programId: string) => {
    setExpandedChallenges((prev) => ({
      ...prev,
      [programId]: !prev[programId],
    }));
  };

  const toggleCard = (programId: string, section: string) => {
    const key = `${programId}-${section}`;
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isExpanded = (programId: string, section: string) => {
    return expandedCards[`${programId}-${section}`] || false;
  };

  const isChallengeExpanded = (programId: string) => {
    return expandedChallenges[programId] || false;
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {challenges.map((challenge) => {
        const program = PROGRAMS[challenge.programId];
        const isPrimary = highlightedPrograms.primary === challenge.programId;
        const isSecondary = highlightedPrograms.secondary.includes(
          challenge.programId,
        );
        const isHighlighted = isPrimary || isSecondary;
        const isCardExpanded = isChallengeExpanded(challenge.programId);

        return (
          <div
            key={challenge.programId}
            className={`flex w-full flex-col overflow-hidden rounded-lg border-2 shadow-md transition-all ${
              isPrimary
                ? 'border-primary/30 bg-primary-20'
                : isSecondary
                  ? 'border-primary/20 bg-primary-10'
                  : 'border-neutral-90 bg-white'
            }`}
          >
            {/* 헤더 - 클릭하여 펼치기/접기 */}
            <button
              type="button"
              onClick={() => toggleChallenge(challenge.programId)}
              className="flex w-full flex-col gap-1 p-4 text-left transition-colors hover:bg-white/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  {isHighlighted && (
                    <span className="w-fit rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-white">
                      {isPrimary ? '주요 추천' : '보완 추천'}
                    </span>
                  )}
                  <h4 className="text-medium18 font-black text-neutral-0">
                    {program.title}
                  </h4>
                  <p className="text-xsmall13 font-medium text-neutral-40">
                    {program.subtitle}
                  </p>
                </div>
                <span
                  className={`text-medium18 font-bold transition-transform ${
                    isCardExpanded
                      ? 'rotate-180 text-primary'
                      : 'text-neutral-40'
                  }`}
                >
                  ▼
                </span>
              </div>
            </button>

            {/* 펼쳐진 내용 */}
            {isCardExpanded && (
              <div className="flex flex-col gap-3 border-t border-neutral-85 p-4">
                {/* 핵심 정보 */}
                <div className="flex flex-col gap-2 rounded-md bg-white/80 p-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xsmall12 font-bold text-neutral-40">
                      추천 대상
                    </span>
                    <span className="text-xsmall13 font-medium leading-relaxed text-neutral-0">
                      {challenge.target}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-90 pt-2">
                    <span className="text-xsmall12 font-bold text-neutral-40">
                      기간
                    </span>
                    <span className="text-xsmall13 font-semibold text-neutral-0">
                      {challenge.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xsmall12 font-bold text-neutral-40">
                      피드백
                    </span>
                    <span className="text-xsmall13 font-semibold text-neutral-0">
                      {challenge.feedback}
                    </span>
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="flex flex-col gap-1.5 rounded-md border border-primary/20 bg-white/90 p-3">
                  <span className="text-xsmall12 font-bold text-primary">
                    플랜별 가격
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {challenge.pricing.split('\n').map((line, i) => (
                      <span
                        key={i}
                        className={`text-xsmall12 font-medium ${
                          line.includes('(환급금 없음)')
                            ? 'text-[10px] text-neutral-50'
                            : 'text-neutral-10'
                        }`}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 결과물 */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xsmall12 font-bold text-neutral-40">
                      결과물
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        toggleCard(challenge.programId, 'deliverable')
                      }
                      className="text-xsmall11 font-bold text-primary transition-colors"
                    >
                      {isExpanded(challenge.programId, 'deliverable')
                        ? '−'
                        : '+'}
                    </button>
                  </div>
                  <p
                    className={`text-xsmall12 whitespace-pre-line font-medium leading-relaxed text-neutral-20 ${
                      isExpanded(challenge.programId, 'deliverable')
                        ? ''
                        : 'line-clamp-2'
                    }`}
                  >
                    {challenge.deliverable}
                  </p>
                </div>

                {/* 커리큘럼 & 특징 (접기/펼치기) */}
                <div className="flex flex-col gap-2 border-t border-neutral-85 pt-3">
                  {/* 커리큘럼 */}
                  {challenge.curriculum && (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          toggleCard(challenge.programId, 'curriculum')
                        }
                        className="flex w-full items-center justify-between py-1"
                      >
                        <span className="text-xsmall13 font-bold text-neutral-30">
                          커리큘럼 보기
                        </span>
                        <span className="text-xsmall11 font-bold text-primary">
                          {isExpanded(challenge.programId, 'curriculum')
                            ? '−'
                            : '+'}
                        </span>
                      </button>
                      {isExpanded(challenge.programId, 'curriculum') && (
                        <p className="text-xsmall12 mt-2 whitespace-pre-line font-medium leading-relaxed text-neutral-20">
                          {challenge.curriculum}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 주요 특징 */}
                  {challenge.features && (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          toggleCard(challenge.programId, 'features')
                        }
                        className="flex w-full items-center justify-between py-1"
                      >
                        <span className="text-xsmall13 font-bold text-neutral-30">
                          주요 특징 보기
                        </span>
                        <span className="text-xsmall11 font-bold text-primary">
                          {isExpanded(challenge.programId, 'features')
                            ? '−'
                            : '+'}
                        </span>
                      </button>
                      {isExpanded(challenge.programId, 'features') && (
                        <p className="text-xsmall12 mt-2 whitespace-pre-line font-medium leading-relaxed text-neutral-20">
                          {challenge.features}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MobileChallengeComparison;
