import { useGetChallengeGuides, useGetChallengeNotices } from '@/api/challenge';
import { useReadGuides, useReadNotices } from '@/hooks/useReadItems';
import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { type ReactNode } from 'react';

export const enum TabMenu {
  NOTICE,
  GUIDE,
}

const TabButton = ({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  children?: ReactNode;
  onClick?: () => void;
}) => {
  const getTabStyle = () => {
    return twMerge(
      'rounded-full px-3 py-1.5 text-xsmall14 font-medium md:px-4 md:text-xsmall16',
      isActive ? 'bg-neutral-10 text-white' : 'bg-neutral-90 text-neutral-40',
    );
  };

  return (
    <li>
      <button type="button" className={getTabStyle()} onClick={onClick}>
        {children}
      </button>
    </li>
  );
};

const NoticeItem = ({
  link,
  children,
  isNew,
  onClick,
}: {
  link: string;
  children: ReactNode;
  isNew?: boolean;
  onClick?: () => void;
}) => {
  return (
    <li className="border-b border-neutral-80 py-4">
      <Link href={link} target="_blank" onClick={onClick}>
        <h3 className="flex-1 text-xsmall16 font-medium leading-[26px] text-neutral-10 md:text-small18">
          {children}{' '}
          {isNew && (
            <span
              aria-label="새 글"
              className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-system-error align-middle text-[0.5rem] font-bold leading-none text-white"
            >
              N
            </span>
          )}
        </h3>
      </Link>
    </li>
  );
};

const NoticeList = () => {
  const params = useParams<{ programId: string }>();

  const { data: noticeData } = useGetChallengeNotices(params.programId, {
    page: 1,
    size: 99,
  });

  const noticeList = noticeData?.challengeNoticeList;
  const isEmpty = noticeList?.length === 0;

  const { isNewItem, markAsRead } = useReadNotices();

  if (isEmpty) {
    return (
      <p className="mt-6 text-xsmall14 text-neutral-40">
        등록된 공지사항이 없습니다.
      </p>
    );
  }

  return noticeList?.map((notice) => (
    <NoticeItem
      key={'notice-' + notice.id}
      isNew={isNewItem(notice.createDate, notice.id)}
      link={notice.link ?? '#'}
      onClick={() => markAsRead(notice.id)}
    >
      {notice.title}
    </NoticeItem>
  ));
};

const GuideList = () => {
  const params = useParams<{ programId: string }>();

  const { data: guideData } = useGetChallengeGuides(params.programId);

  const guideList = guideData?.challengeGuideList;
  const isEmpty = guideList?.length === 0;

  const { isNewItem, markAsRead } = useReadGuides();

  if (isEmpty) {
    return (
      <p className="mt-6 text-xsmall14 text-neutral-40">
        등록된 가이드가 없습니다.
      </p>
    );
  }

  return guideList?.map((guide) => (
    <NoticeItem
      key={'guide-' + guide.id}
      isNew={isNewItem(guide.createDate, guide.id)}
      link={guide.link ?? '#'}
      onClick={() => markAsRead(guide.id)}
    >
      {guide.title}
    </NoticeItem>
  ));
};

const ChallengeGuidePage = () => {
  const searchParams = useSearchParams();
  const activeTab = Number(searchParams.get('tab'));
  const router = useRouter();

  const handleTabClick = (tab: TabMenu) => {
    const newParams = new URLSearchParams(searchParams); // 기존 쿼리 유지
    newParams.set('tab', String(tab));
    router.push(`?${newParams.toString()}`);
  };

  return (
    <main
      aria-labelledby="guide-heading"
      className="w-full px-5 pb-16 md:ml-12 md:px-0"
    >
      <section className="mb-2 md:mb-6">
        <h2
          id="guide-heading"
          className="mt-8 text-medium22 font-semibold text-neutral-0 md:mt-0"
        >
          공지사항 / 챌린지 가이드
        </h2>
        <nav aria-label="공지/가이드 탭" className="mt-6">
          <ul className="flex items-center gap-2">
            <TabButton
              isActive={activeTab ? activeTab === TabMenu.NOTICE : true}
              onClick={() => handleTabClick(TabMenu.NOTICE)}
            >
              공지사항
            </TabButton>
            <TabButton
              isActive={activeTab === TabMenu.GUIDE}
              onClick={() => handleTabClick(TabMenu.GUIDE)}
            >
              챌린지 가이드
            </TabButton>
          </ul>
        </nav>
      </section>

      <section aria-label="공지 목록" className="w-full">
        <div className="w-full max-w-[852px]">
          <ul role="list">
            {activeTab === TabMenu.GUIDE ? <GuideList /> : <NoticeList />}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default ChallengeGuidePage;
