'use client';

import type {
  ProgramCategoryTarget,
  SectionDisplayType,
} from '@/api/program-category/programCategory';
import { useState } from 'react';
import { getSectionEyebrow, getSectionKind } from '../landingCard';
import {
  appendOtherMentorings,
  useAllMentoringTargets,
} from '../useOtherMentorings';
import { SHOW_LIVE_MENTORING_NAV } from '@/domain/live-mentoring/constants';
import FeaturedChallenge, { PassFreeNotice } from './FeaturedChallenge';
import {
  BlogTargetCard,
  MentorTargetCard,
  ProgramTargetCard,
} from './TargetCards';

/** 섹션 한 줄에 처음 보이는 카드 수. 시안 기준 데스크톱 5장 */
const PREVIEW_COUNT = 5;

interface LandingSectionProps {
  /** 탭 앵커 id */
  anchorId: string;
  title: string;
  description?: string;
  targets: ProgramCategoryTarget[];
  passHref: string;
  displayType?: SectionDisplayType | null;
}

/** 랜딩 섹션 하나 = 어드민 랜딩용 노출 목록의 카테고리 하나 */
const LandingSection = ({
  anchorId,
  title,
  description,
  targets: sectionTargets,
  passHref,
  displayType,
}: LandingSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const kind = getSectionKind(sectionTargets, displayType);
  // 멘토링 섹션은 이 카테고리 멘토링을 앞에, 나머지 멘토링 전체를 뒤에 둔다
  const { data: allMentorings = [] } = useAllMentoringTargets(
    kind === 'mentoring' && SHOW_LIVE_MENTORING_NAV,
  );
  const targets =
    kind === 'mentoring' && SHOW_LIVE_MENTORING_NAV
      ? appendOtherMentorings(sectionTargets, allMentorings)
      : sectionTargets;
  const visible = expanded ? targets : targets.slice(0, PREVIEW_COUNT);

  return (
    <section id={anchorId} className="scroll-mt-28 py-10 md:py-14">
      <p className="text-xsmall14 font-semibold text-primary">
        {getSectionEyebrow(targets, kind)}
      </p>
      <div className="mt-1 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-small20 font-bold text-neutral-0 md:text-medium24">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-xsmall14 text-neutral-30 md:text-xsmall16">
              {description}
            </p>
          )}
        </div>
        {kind !== 'challenge' && targets.length > PREVIEW_COUNT && (
          <button
            type="button"
            className="shrink-0 text-xsmall14 text-neutral-40"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? '접기' : '더보기'}
          </button>
        )}
      </div>

      <div className="mt-6">
        {kind === 'challenge' ? (
          <div className="flex flex-col gap-4">
            {/* 챌린지는 기수·버전 구분 없이 하나만 (시안). 첫 번째가 대표다 */}
            <FeaturedChallenge target={targets[0]} />
            <PassFreeNotice passHref={passHref} />
          </div>
        ) : (
          <ul className="-mx-5 flex gap-4 overflow-x-auto px-5 scrollbar-hide md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
            {visible.map((target) => (
              <li
                key={`${target.targetType}-${target.targetId}`}
                className="w-[160px] shrink-0 md:w-auto"
              >
                {kind === 'mentoring' ? (
                  <MentorTargetCard target={target} />
                ) : kind === 'blog' ? (
                  <BlogTargetCard target={target} />
                ) : (
                  <ProgramTargetCard target={target} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default LandingSection;
