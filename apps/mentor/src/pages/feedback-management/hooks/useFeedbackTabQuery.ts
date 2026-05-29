import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { FeedbackTabKey } from '../ui/FeedbackTabs';

const VALID_TABS: FeedbackTabKey[] = ['all', 'written', 'live'];
const QUERY_KEY = 'tab';

function parseTab(raw: string | null): FeedbackTabKey {
  return (VALID_TABS as string[]).includes(raw ?? '')
    ? (raw as FeedbackTabKey)
    : 'all';
}

/**
 * `?tab=all|written|live` URL query와 동기화되는 피드백 탭 상태.
 *
 * - 잘못된 값(또는 누락)이면 'all'로 폴백한다.
 * - 탭 전환 시 `replace`로 history pollution 방지.
 */
export function useFeedbackTabQuery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = parseTab(searchParams.get(QUERY_KEY));

  const setActiveTab = useCallback(
    (tab: FeedbackTabKey) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (tab === 'all') {
            next.delete(QUERY_KEY);
          } else {
            next.set(QUERY_KEY, tab);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [activeTab, setActiveTab] as const;
}
