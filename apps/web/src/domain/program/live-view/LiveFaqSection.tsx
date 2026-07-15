'use client';

import { liveFaqQueryOptions } from '@/api/program';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import LiveFaq from './ui/LiveFaq';

/** 로드/에러가 정착된 시점을 부모에 한 번 알린다 (스크롤 네비 옵저버 활성화용). */
function SettleSignal({ onSettle }: { onSettle: () => void }) {
  useEffect(() => {
    onSettle();
  }, [onSettle]);
  return null;
}

function LiveFaqInner({
  liveId,
  onSettle,
}: {
  liveId: string | number;
  onSettle: () => void;
}) {
  const { data } = useSuspenseQuery(liveFaqQueryOptions(liveId));
  return (
    <>
      <SettleSignal onSettle={onSettle} />
      <LiveFaq faqData={data} />
    </>
  );
}

/**
 * FAQ 영역만 개별 AsyncBoundary 로 격리한다.
 * - 주 콘텐츠(live)는 즉시 렌더되고 FAQ 로딩/에러가 페이지 전체를 막지 않는다.
 * - 로드 성공·실패가 정착되면 onSettle 로 부모에 알려, 부모가 스크롤 네비
 *   IntersectionObserver 를 그때 활성화하도록 한다(기존 isReady 타이밍 보존).
 */
export default function LiveFaqSection({
  liveId,
  onSettle,
}: {
  liveId: string | number;
  onSettle: () => void;
}) {
  return (
    <AsyncBoundary
      pendingFallback={null}
      rejectedFallback={() => <SettleSignal onSettle={onSettle} />}
    >
      <LiveFaqInner liveId={liveId} onSettle={onSettle} />
    </AsyncBoundary>
  );
}
