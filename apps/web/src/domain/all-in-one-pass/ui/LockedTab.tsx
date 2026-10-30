// 이용기간 만료 등으로 접근 불가한 탭 공용 표시(자물쇠 + 안내). 자료집·다른 탭 재사용.
'use client';

import type { ReactNode } from 'react';

export default function LockedTab({
  message = '패스 이용기간이 만료되어 이용 불가한 탭입니다.',
  children,
}: {
  message?: string;
  /** 안내 아래에 둘 행동 유도(구매 링크 등) */
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-40 md:py-56">
      <img src="/icons/lock-keyhole-neutral.svg" alt="" className="h-12 w-12" />
      <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 text-center">
        {message}
      </p>
      {children}
    </div>
  );
}
