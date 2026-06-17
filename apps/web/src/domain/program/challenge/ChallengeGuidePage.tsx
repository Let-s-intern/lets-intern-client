import { useChallengeHome } from '@/api/challenge/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { useReadGuides, useReadNotices } from '@/hooks/useReadItems';
import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
      'text-xsmall14 md:text-xsmall16 rounded-full px-3 py-1.5 font-medium md:px-4',
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
    <li className="border-neutral-80 border-b py-4">
      <Link href={link} target="_blank" onClick={onClick}>
        <h3 className="text-xsmall16 text-neutral-10 md:text-small18 flex-1 font-medium leading-[26px]">
          {children}{' '}
          {isNew && (
            <span
              aria-label="새 글"
              className="bg-system-error inline-flex h-3 w-3 items-center justify-center rounded-full align-middle text-[0.5rem] font-bold leading-none text-white"
            >
              N
            </span>
          )}
        </h3>
      </Link>
    </li>
  );
};

type HomeNoticeItem = {
  id: number;
  title: string | null;
  url: string | null;
  createdAt: string | null;
};

const NoticeList = ({ items }: { items: HomeNoticeItem[] }) => {
  const { isNewItem, markAsRead } = useReadNotices();

  if (items.length === 0) {
    return (
      <p className="text-xsmall14 text-neutral-40 mt-6">
        등록된 공지사항이 없습니다.
      </p>
    );
  }

  return items.map((notice) => (
    <NoticeItem
      key={'notice-' + notice.id}
      isNew={isNewItem(notice.createdAt, notice.id)}
      link={notice.url ?? '#'}
      onClick={() => markAsRead(notice.id)}
    >
      {notice.title}
    </NoticeItem>
  ));
};

const GuideList = ({ items }: { items: HomeNoticeItem[] }) => {
  const { isNewItem, markAsRead } = useReadGuides();

  if (items.length === 0) {
    return (
      <p className="text-xsmall14 text-neutral-40 mt-6">
        등록된 가이드가 없습니다.
      </p>
    );
  }

  return items.map((guide) => (
    <NoticeItem
      key={'guide-' + guide.id}
      isNew={isNewItem(guide.createdAt, guide.id)}
      link={guide.url ?? '#'}
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
  const { currentChallenge } = useCurrentChallenge();

  const { data: homeData } = useChallengeHome(currentChallenge?.id);

  const notices = (homeData?.noticeList ?? []).filter(
    (item) => item.type === 'NOTICE',
  );
  const guides = (homeData?.noticeList ?? []).filter(
    (item) => item.type === 'GUIDE',
  );

  const handleTabClick = (tab: TabMenu) => {
    const newParams = new URLSearchParams(searchParams);
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
          className="text-medium22 text-neutral-0 mt-8 font-semibold md:mt-0"
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
            {activeTab === TabMenu.GUIDE ? (
              <GuideList items={guides} />
            ) : (
              <NoticeList items={notices} />
            )}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default ChallengeGuidePage;
