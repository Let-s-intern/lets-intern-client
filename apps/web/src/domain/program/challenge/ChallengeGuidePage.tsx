import { useChallengeHome } from '@/api/challenge/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { COUPON_AMOUNT_BY_CHALLENGE_TYPE } from '@/domain/challenge/hooks/useCouponRewardPopup';
import { useReadGuides, useReadNotices } from '@/hooks/useReadItems';
import dayjs from '@/lib/dayjs';
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
      <p className="mt-6 text-xsmall14 text-neutral-40">
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
      <p className="mt-6 text-xsmall14 text-neutral-40">
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

  const couponAmount = currentChallenge?.challengeType
    ? COUPON_AMOUNT_BY_CHALLENGE_TYPE[currentChallenge.challengeType]
    : undefined;
  const couponEndDate = currentChallenge?.endDate?.add(2, 'month');
  const showCouponBanner =
    couponAmount && couponEndDate && dayjs().isBefore(couponEndDate);

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
            {activeTab === TabMenu.GUIDE ? (
              <GuideList items={guides} />
            ) : (
              <NoticeList items={notices} />
            )}
          </ul>
        </div>
      </section>

      {showCouponBanner && (
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-xs bg-primary-5 p-[18px] md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <p className="text-small18 font-medium tracking-[-0.094px]">
              재구매 할인 쿠폰으로 {currentChallenge!.title}을 더 저렴하게
              들어보세요!
            </p>
            <p className="text-xsmall14 font-semibold text-primary-dark">
              유효기간 : ~ {couponEndDate!.format('YYYY년 MM월 DD일 HH시 mm분')}
            </p>
          </div>
          <Link
            href="/mypage/coupon"
            className="shrink-0 rounded-xxs bg-primary-light px-3 py-1 text-xsmall16 font-semibold text-static-100"
          >
            쿠폰함 바로가기
          </Link>
        </div>
      )}
    </main>
  );
};

export default ChallengeGuidePage;
