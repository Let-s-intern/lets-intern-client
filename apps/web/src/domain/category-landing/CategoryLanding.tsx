'use client';

import {
  useProgramCategoryGroupBySlugQuery,
  useProgramCategoryTargetsQuery,
} from '@/api/program-category/programCategory';
import { useMembershipNavEntry } from '@/common/layout/header/useMembershipNavEntry';
import { JOURNEY_GROUPS } from '@/domain/career-journey/journeyNav';
import clsx from 'clsx';
import Link from 'next/link';
import { Fragment, useMemo, useState } from 'react';
import { getSectionEyebrow } from './landingCard';
import { LANDING_CONTENT } from './landingContent';
import LandingSection from './ui/LandingSection';
import PassBanner from './ui/PassBanner';

/** 메뉴 slug → [브레드크럼 묶음, 이름] */
const findMenuItem = (slug: string) => {
  for (const group of JOURNEY_GROUPS) {
    const item = group.items.find((i) => i.slug === slug);
    if (item) return { groupLabel: group.label, label: item.label };
  }
  return null;
};

/**
 * 카테고리 랜딩. 어드민 노출 분류의 랜딩용 노출 목록(slug)을 불러,
 * 그 안의 카테고리 하나를 섹션 하나로 그린다. 상품은 다중 조회 한 번으로 받는다
 */
const CategoryLanding = ({ slug }: { slug: string }) => {
  const {
    data: group,
    isLoading,
    isError,
  } = useProgramCategoryGroupBySlugQuery(slug);
  const categoryIds = useMemo(
    () => group?.categoryList.map((c) => c.id) ?? [],
    [group],
  );
  const { data: targets = [] } = useProgramCategoryTargetsQuery(categoryIds);
  const { href: passHref } = useMembershipNavEntry();
  // 누른 탭을 선택 표시한다. 누르기 전에는 첫 탭
  const [activeTabId, setActiveTabId] = useState<number | null>(null);

  const menu = findMenuItem(slug);
  const content = LANDING_CONTENT[slug];

  // 상품이 없는 섹션은 탭과 함께 숨긴다
  const sections = (group?.categoryList ?? [])
    .map((category) => ({
      category,
      targets: targets.filter((t) => t.categoryIds.includes(category.id)),
    }))
    .filter((section) => section.targets.length > 0);

  if (isError || (!isLoading && !group)) {
    return (
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-4 px-5 py-32 text-center">
        <p className="text-small18 font-semibold text-neutral-0">
          준비 중인 페이지예요.
        </p>
        <Link href="/program" className="text-xsmall16 text-primary">
          전체 프로그램 보기 ›
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 pb-20 xl:px-0">
      <nav
        className="mt-6 text-xxsmall12 text-neutral-40"
        aria-label="breadcrumb"
      >
        <Link href="/">홈</Link>
        {menu?.groupLabel && <span> › {menu.groupLabel}</span>}
        <span className="font-semibold text-neutral-10">
          {' '}
          › {menu?.label ?? group?.title}
        </span>
      </nav>

      <header className="mt-10 md:mt-14">
        <h1 className="whitespace-pre-line text-medium24 font-bold text-neutral-0 md:text-xxlarge32">
          {content?.heroTitle ?? group?.title}
        </h1>
        {content?.heroDescription && (
          <p className="mt-3 text-xsmall14 text-neutral-30 md:text-xsmall16">
            {content.heroDescription}
          </p>
        )}
      </header>

      {sections.length > 0 && (
        <nav className="sticky top-0 z-10 -mx-5 mt-10 flex overflow-x-auto border-b border-neutral-80 bg-white px-5 scrollbar-hide md:mx-0 md:px-0">
          {/* 탭은 짧게 상품 유형으로 쓴다 (시안: 챌린지 / LIVE · VOD 클래스 / 무료 자료집 …) */}
          {sections.map(({ category, targets: sectionTargets }) => (
            <a
              key={category.id}
              href={`#section-${category.id}`}
              onClick={() => setActiveTabId(category.id)}
              className={clsx(
                'category_landing_tab -mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-xsmall14 hover:text-neutral-0 md:flex-1 md:text-center md:text-xsmall16',
                (activeTabId ?? sections[0].category.id) === category.id
                  ? 'border-neutral-0 font-semibold text-neutral-0'
                  : 'border-transparent text-neutral-30',
              )}
              data-text={category.title}
            >
              {getSectionEyebrow(sectionTargets)}
            </a>
          ))}
        </nav>
      )}

      {isLoading ? (
        <p className="py-20 text-center text-xsmall14 text-neutral-40">
          불러오는 중…
        </p>
      ) : sections.length === 0 ? (
        <p className="py-20 text-center text-xsmall14 text-neutral-40">
          준비 중인 프로그램이에요.
        </p>
      ) : (
        sections.map(({ category, targets: sectionTargets }, index) => (
          <Fragment key={category.id}>
            <LandingSection
              anchorId={`section-${category.id}`}
              title={category.title}
              description={
                category.slug
                  ? content?.sectionDescriptions?.[category.slug]
                  : undefined
              }
              targets={sectionTargets}
              passHref={passHref}
            />
            {/* 첫 섹션 다음에 패스 배너 (시안) */}
            {index === 0 && <PassBanner href={passHref} />}
          </Fragment>
        ))
      )}
    </div>
  );
};

export default CategoryLanding;
