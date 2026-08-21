'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useOrderDraftStore } from './hooks/useOrderDraft';

interface OrderPageProps {
  /**
   * 되돌아갈 상세 페이지의 멘토 id. 쿼리스트링으로 받는다.
   *
   * 선택값은 메모리에만 있어 새로고침하면 사라지는데, 그때 어느 상세로 보낼지
   * 알아야 한다. 그래서 멘토 id 만 URL 에 남긴다 — 이것 하나로 되돌아갈 곳이 정해진다.
   */
  mentorId: string | null;
}

/**
 * 1대1 라이브 멘토링 결제 페이지 (시안 `2-0`).
 *
 * 신청 시트에서 고른 값(`useOrderDraftStore`)을 받아 질문·쿠폰을 마저 받고
 * 결제로 넘긴다. 신청 생성은 `결제하기` 를 누르는 순간 한 번에 일어난다
 * (PRD 7-4 안 A) — 그전까지 슬롯은 선점되지 않는다.
 */
const OrderPage = ({ mentorId }: OrderPageProps) => {
  const router = useRouter();
  const draft = useOrderDraftStore((state) => state.draft);

  /*
    선택값 없이 이 주소에 닿는 경로는 둘이다 — 새로고침, 그리고 주소창 직접 입력.
    어느 쪽이든 결제할 대상이 없으므로 되돌려보낸다. 빈 화면에 "결제하기" 만
    떠 있으면 눌렀을 때 무슨 일이 날지 알 수 없다.
  */
  useEffect(() => {
    if (draft) return;
    router.replace(mentorId ? `/live-mentoring/${mentorId}` : '/live-mentoring');
  }, [draft, mentorId, router]);

  if (!draft) {
    return <p className="text-neutral-40 py-20 text-center">이동 중…</p>;
  }

  return (
    <div className="mw-1180 flex flex-col gap-8 px-5 py-8 md:py-12">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="이전으로"
          className="hover:bg-neutral-90 rounded-full p-1"
        >
          <img
            src="/icons/Chevron_Left_MD.svg"
            alt=""
            aria-hidden="true"
            className="h-6 w-6"
          />
        </button>
        <h1 className="text-small20 md:text-medium24 text-neutral-0 font-bold">
          결제하기
        </h1>
      </div>

      {/*
        TODO(7-7): 시안 `2-0` 의 "마감까지 3일 23시간 58분 58초" 배너 자리.
        근거 데이터가 없어 그리지 않는다 — 개설에 모집 마감일 개념이 없고,
        10분 선점 만료는 자릿수가 맞지 않는다. 근거가 확정되면 여기에 넣는다.
      */}
    </div>
  );
};

export default OrderPage;
