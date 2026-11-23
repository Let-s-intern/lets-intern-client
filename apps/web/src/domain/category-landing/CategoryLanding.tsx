'use client';

import {
  useCategoryLandingQuery,
  useProgramCategoryGroupBySlugQuery,
  useProgramCategoryTargetsQuery,
} from '@/api/program-category/programCategory';
import { useMembershipNavEntry } from '@/common/layout/header/useMembershipNavEntry';
import { findJourneyItem } from '@/domain/career-journey/landingMenu';
import { useJourneyGroups } from '@/domain/career-journey/useJourneyGroups';
import useScrollDirection from '@/hooks/useScrollDirection';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Fragment,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getSectionEyebrow, getSectionKind } from './landingCard';
import { LANDING_CONTENT } from './landingContent';
import { resolveLandingHero } from './landingHero';
import { landingSectionsOf } from './landingSections';
import LandingSection from './ui/LandingSection';
import PassBanner from './ui/PassBanner';
import ReviewSection from './ui/ReviewSection';

const REVIEW_ANCHOR = 'section-review';

/** 전체 헤더 높이(NavBar 의 FULL_NAVBAR_HEIGHT_OFFSET 과 같다). 데스크톱 155, 모바일 84 */
const HEADER_HEIGHT_DESKTOP = 155;
const HEADER_HEIGHT_MOBILE = 84;
const ANCHOR_GAP = 12;

/**
 * 카테고리 랜딩. 어드민 노출 분류의 랜딩용 노출 목록(slug)을 불러,
 * 그 안의 카테고리 하나를 섹션 하나로 그린다. 상품은 다중 조회 한 번으로 받는다
 */
const CategoryLanding = ({ slug }: { slug: string }) => {
  // 새 분류 랜딩을 먼저 본다. 없으면(null) 예전 랜딩(노출 목록)을 부른다
  const { data: landing, isLoading: isLandingLoading } =
    useCategoryLandingQuery(slug);
  const useLegacy = landing === null;
  const {
    data: group,
    isLoading: isGroupLoading,
    isError,
  } = useProgramCategoryGroupBySlugQuery(slug, useLegacy);
  const isLoading = isLandingLoading || (useLegacy && isGroupLoading);
  const categoryIds = useMemo(
    () => (useLegacy ? (group?.categoryList.map((c) => c.id) ?? []) : []),
    [group, useLegacy],
  );
  // 이 랜딩 노출 위치. 챌린지 기수·버전 합치기와 상단 문구를 여기서 읽는다
  const placement = group?.placements?.find(
    (p) => p.placementType === 'LANDING' && p.slug === slug,
  );
  const mergeChallenges = placement?.mergeChallenges ?? true;
  const { data: targets = [] } = useProgramCategoryTargetsQuery(
    categoryIds,
    'ANY',
    mergeChallenges,
  );
  const { href: passHref } = useMembershipNavEntry();
  // 누른 탭을 선택 표시한다. 누르기 전에는 첫 탭
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const pathname = usePathname();
  // 아래로 내리면 헤더가 숨으니 앵커 바는 맨 위로 올라붙고, 위로 올리면 헤더 아래에 붙는다
  const scrollDirection = useScrollDirection(pathname);
  const anchorRef = useRef<HTMLElement>(null);
  // 탭을 눌러 이동하는 동안은 스크롤 위치로 선택 탭을 바꾸지 않는다 (밑줄이 오가며 깜빡였다)
  const isAnchorScrollingRef = useRef(false);
  const anchorCleanupRef = useRef<(() => void) | null>(null);

  const journeyGroups = useJourneyGroups();
  const menu = findJourneyItem(journeyGroups, slug);
  const content = LANDING_CONTENT[slug];
  const pageTitle = landing?.page.title ?? group?.title;
  const hero = resolveLandingHero(
    landing?.page ?? placement,
    content,
    pageTitle,
  );

  // 상품이 없는 섹션은 탭과 함께 숨긴다
  const sections = landingSectionsOf({
    landing,
    group,
    groupTargets: targets,
    content,
  });

  // 수강생 후기는 블로그 섹션 바로 앞, 블로그가 없으면 맨 끝 (시안)
  const blogIndex = sections.findIndex(
    (section) =>
      getSectionKind(section.targets, section.displayType) === 'blog',
  );
  const reviewIndex = blogIndex === -1 ? sections.length : blogIndex;
  const reviewSection = content?.review && (
    <ReviewSection anchorId={REVIEW_ANCHOR} {...content.review} />
  );
  const tabs = sections.map((section) => ({
    key: `section-${section.id}`,
    label: getSectionEyebrow(
      section.targets,
      getSectionKind(section.targets, section.displayType),
    ),
  }));
  if (content?.review && tabs.length > 0)
    tabs.splice(reviewIndex, 0, { key: REVIEW_ANCHOR, label: '수강생 후기' });
  const tabKeys = tabs.map((tab) => tab.key).join('|');

  const headerHeight = () =>
    window.matchMedia('(min-width: 1024px)').matches
      ? HEADER_HEIGHT_DESKTOP
      : HEADER_HEIGHT_MOBILE;

  /** 앵커 바에 가리지 않는 위치. 올라갈 때는 헤더가 다시 나오니 그만큼도 비운다 */
  const anchorOffset = (goingUp: boolean) =>
    (anchorRef.current?.offsetHeight ?? 48) +
    ANCHOR_GAP +
    (goingUp ? headerHeight() : 0);

  // 탭을 누르면 해당 섹션으로 부드럽게 이동한다
  const handleTabClick = (
    event: MouseEvent<HTMLAnchorElement>,
    key: string,
  ) => {
    const target = document.getElementById(key);
    if (!target) return;
    event.preventDefault();
    anchorCleanupRef.current?.();
    setActiveTab(key);
    isAnchorScrollingRef.current = true;

    const targetTop = () => target.getBoundingClientRect().top + window.scrollY;
    const goingUp = targetTop() < window.scrollY;
    const destination = () => Math.max(0, targetTop() - anchorOffset(goingUp));
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({
      top: destination(),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
    window.history.replaceState(null, '', `#${key}`);

    // 스크롤이 잠깐 멈추면 도착한 것으로 보고 잠금을 푼다
    let timer = 0;
    const finish = () => {
      window.removeEventListener('scroll', onScroll);
      isAnchorScrollingRef.current = false;
      anchorCleanupRef.current = null;
      if (Math.abs(window.scrollY - destination()) > 4) {
        window.scrollTo({ top: destination(), behavior: 'auto' });
      }
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(finish, 140);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    anchorCleanupRef.current = () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      isAnchorScrollingRef.current = false;
    };
    onScroll();
  };

  // 스크롤 위치에 따라 지금 보는 섹션 탭을 표시한다
  const updateActiveTab = useCallback(() => {
    if (isAnchorScrollingRef.current) return;
    const keys = tabKeys ? tabKeys.split('|') : [];
    if (keys.length === 0) return;
    const line = (anchorRef.current?.getBoundingClientRect().bottom ?? 0) + 24;
    let current = keys[0];
    for (const key of keys) {
      const el = document.getElementById(key);
      if (el && el.getBoundingClientRect().top <= line) current = key;
    }
    setActiveTab(current);
  }, [tabKeys]);

  useEffect(() => () => anchorCleanupRef.current?.(), []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveTab);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [updateActiveTab]);

  if (!isLoading && useLegacy && (isError || !group)) {
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

  // break-keep: 모바일에서 단어 중간("하나로", "솔직", "무료")이 끊기지 않게 랜딩 전체에 건다
  return (
    <div className="mx-auto w-full max-w-[1120px] break-keep px-5 pb-20 xl:px-0">
      <nav
        className="mt-6 text-xxsmall12 text-neutral-40"
        aria-label="breadcrumb"
      >
        <Link href="/">홈</Link>
        {menu?.groupLabel && <span> › {menu.groupLabel}</span>}
        <span className="font-semibold text-neutral-10">
          {' '}
          › {menu?.label ?? pageTitle}
        </span>
      </nav>

      <header className="mt-10 md:mt-14">
        <h1 className="whitespace-pre-line text-medium24 font-bold text-neutral-0 md:text-xxlarge32">
          {hero.title}
        </h1>
        {hero.description && (
          <p className="mt-3 whitespace-pre-line text-xsmall14 text-neutral-30 md:text-xsmall16">
            {hero.description}
          </p>
        )}
      </header>

      {sections.length > 0 && (
        <nav
          ref={anchorRef}
          className={clsx(
            'sticky z-20 -mx-5 mt-10 flex overflow-x-auto border-b border-neutral-80 bg-white px-5 transition-[top] duration-300 scrollbar-hide md:mx-0 md:px-0',
            scrollDirection === 'DOWN' ? 'top-0' : 'top-[84px] lg:top-[155px]',
          )}
        >
          {/* 탭은 짧게 상품 유형으로 쓴다 (시안: 챌린지 / LIVE · VOD 클래스 / 무료 자료집 / … / 수강생 후기 / 블로그) */}
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={`#${tab.key}`}
              onClick={(event) => handleTabClick(event, tab.key)}
              className={clsx(
                'category_landing_tab -mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-xsmall14 hover:text-neutral-0 md:flex-1 md:text-center md:text-xsmall16',
                (activeTab ?? tabs[0].key) === tab.key
                  ? 'border-neutral-0 font-semibold text-neutral-0'
                  : 'border-transparent text-neutral-30',
              )}
              data-text={tab.label}
            >
              {tab.label}
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
        sections.map((section, index) => (
          <Fragment key={section.id}>
            {index === reviewIndex && reviewSection}
            <LandingSection
              anchorId={`section-${section.id}`}
              title={section.title}
              description={section.description}
              targets={section.targets}
              passHref={passHref}
              displayType={section.displayType}
            />
            {/* 첫 섹션 다음에 패스 배너 (시안) */}
            {index === 0 && <PassBanner href={passHref} />}
            {index === sections.length - 1 &&
              reviewIndex === sections.length &&
              reviewSection}
          </Fragment>
        ))
      )}
    </div>
  );
};

export default CategoryLanding;
