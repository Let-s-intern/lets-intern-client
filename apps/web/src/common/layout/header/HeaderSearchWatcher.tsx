'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { create } from 'zustand';

/**
 * 헤더가 "지금 어느 메뉴인가"를 가릴 때 쓰는 주소 쿼리 값.
 * 경로(pathname)만으로는 `/program?catalog=mentoring`(멘토 메뉴)과 `/program?type=MEMBERSHIP`(올인원패스)이
 * 일반 프로그램 목록과 구분되지 않는다.
 */
interface HeaderSearchState {
  catalog: string | null;
  type: string | null;
  set: (value: { catalog: string | null; type: string | null }) => void;
}

export const useHeaderSearchStore = create<HeaderSearchState>((set) => ({
  catalog: null,
  type: null,
  set: ({ catalog, type }) => set({ catalog, type }),
}));

/**
 * `useSearchParams` 는 정적 페이지에서 Suspense 경계가 필요해서, 이 컴포넌트만 따로 두고
 * 헤더에서 `<Suspense fallback={null}>` 로 감싸 쓴다. 화면에는 아무것도 그리지 않는다.
 */
function HeaderSearchWatcher() {
  const searchParams = useSearchParams();
  const catalog = searchParams.get('catalog');
  const type = searchParams.get('type');
  const set = useHeaderSearchStore((state) => state.set);

  useEffect(() => {
    set({ catalog, type });
  }, [catalog, type, set]);

  return null;
}

export default HeaderSearchWatcher;
