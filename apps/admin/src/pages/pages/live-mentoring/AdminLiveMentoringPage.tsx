import { useSearchParams } from 'react-router-dom';

import Heading from '@/domain/admin/ui/heading/Heading';
import AdminLiveMentoringParticipantTable from '@/domain/live-mentoring/AdminLiveMentoringParticipantTable';
import AdminLiveMentoringTable from '@/domain/live-mentoring/AdminLiveMentoringTable';
import MentorReviewExposureSection from '@/domain/mentor/review-exposure/ui/MentorReviewExposureSection';
import { twMerge } from '@/lib/twMerge';

type Tab = 'products' | 'participants' | 'reviews';

const tabs: { id: Tab; label: string }[] = [
  { id: 'products', label: '상품 관리' },
  { id: 'participants', label: '참여자' },
  { id: 'reviews', label: '후기' },
];

const TAB_DESCRIPTION: Record<Tab, string> = {
  products:
    '멘토가 만든 1:1 LIVE 멘토링 상품과 현재 개설을 조회합니다. 개설은 멘토가 직접 열고 닫으며, 필요하면 여기서 강제 종료할 수 있습니다.',
  participants:
    '1:1 LIVE 멘토링을 결제한 참여자를 조회합니다. 여기서 하는 조작은 환불뿐입니다.',
  reviews:
    '멘토 프로필과 1:1 LIVE 멘토링 상세에 뜨는 후기를 멘토별로 관리합니다. 노출을 끄거나 별점·내용을 고칠 수 있으며, 원본 후기는 바뀌지 않습니다.',
};

function isTab(value: string | null): value is Tab {
  return tabs.some((tab) => tab.id === value);
}

export default function AdminLiveMentoringPage() {
  // 탭 상태를 URL(?tab=)에 둔다. 새로고침해도 보던 탭이 유지된다.
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: Tab = isTab(tabParam) ? tabParam : 'products';

  // 멘토별 보기도 URL 에 둔다. 새로고침하면 전체로 돌아가 어느 멘토를 보던 중인지 잃는다.
  const mentorIdParam = Number(searchParams.get('mentorId'));
  const mentorId =
    Number.isInteger(mentorIdParam) && mentorIdParam > 0
      ? mentorIdParam
      : undefined;

  const setActiveTab = (tab: Tab) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  /** 상품 표에서 고른 멘토의 참여자나 후기를 보러 간다. */
  const showMentorTab = (tab: Tab, nextMentorId: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    next.set('mentorId', String(nextMentorId));
    setSearchParams(next, { replace: true });
  };

  const clearMentorFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('mentorId');
    setSearchParams(next, { replace: true });
  };

  return (
    <section className="p-5">
      <Heading className="mb-1">1:1 LIVE 멘토링 관리</Heading>
      <p className="text-xsmall14 text-neutral-40 mb-4">
        {TAB_DESCRIPTION[activeTab]}
      </p>

      <nav className="border-neutral-80 mb-4 flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={twMerge(
              'text-xsmall14 -mb-px border-b-2 px-4 py-2',
              activeTab === tab.id
                ? 'border-neutral-0 text-neutral-0 font-semibold'
                : 'text-neutral-40 border-transparent',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'products' ? (
        <AdminLiveMentoringTable
          onSelectMentor={(id) => showMentorTab('participants', id)}
          onSelectMentorReviews={(id) => showMentorTab('reviews', id)}
        />
      ) : activeTab === 'reviews' ? (
        mentorId ? (
          <MentorReviewExposureSection key={mentorId} mentorId={mentorId} />
        ) : (
          <p className="text-xsmall14 text-neutral-40 py-16 text-center">
            상품 관리 탭에서 멘토의 후기 관리 버튼을 눌러 주세요.
          </p>
        )
      ) : (
        // 멘토가 바뀌면 다시 마운트해 페이지 번호를 1로 되돌린다.
        <AdminLiveMentoringParticipantTable
          key={mentorId ?? 'all'}
          mentorId={mentorId}
          onClearMentor={clearMentorFilter}
        />
      )}
    </section>
  );
}
