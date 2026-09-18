'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PassBenefitModalProps {
  open: boolean;
  /** `PASS BENEFIT 01` 형태의 주황 알약 배지 */
  badge: string;
  /** 배지 옆 영문 한 줄 (`10 CHALLENGES` 등) */
  eyebrow: string;
  title: string;
  /** 제목 아래 설명. 줄바꿈 위치가 시안에 정해져 있어 배열로 받는다 */
  subLines: readonly string[];
  onClose: () => void;
  children: ReactNode;
}

/**
 * 개편 시안 6-1 ~ 6-4 — 패스 혜택 "자세히 보기" 모달의 껍데기.
 *
 * 머리말(배지·아이브로우·제목·부제)까지만 이 컴포넌트가 그리고, 본문은 통째로 슬롯이다.
 * 혜택 4종의 본문이 카드 그리드·쿠폰 2열로 서로 달라서, 공통으로 뽑을 수 있는 것이
 * 머리말과 열림·닫힘 동작뿐이다.
 *
 * 기존 `ui/BenefitModal.tsx` 와 두 벌이 되지만 합치지 않았다. 그쪽은 본문까지 상수로
 * 들고 있고 스타일 전부가 `styles/benefit-modal.css` 클래스인데, 이 랜딩은 그 CSS 를
 * import 하지 않는다. 확장하면 안 쓰는 CSS 파일이 다시 딸려 온다.
 *
 * 오버레이는 `document.body` 로 포털한다 — 섹션 안에 두면 조상의 transform 이
 * `position: fixed` 의 기준을 바꿔 화면 밖으로 밀린다. 포털은 `.membership-root` 밖으로
 * 나가므로 스코프드 CSS 와 변수를 받도록 한 겹 감싼다 (BenefitModal 과 같은 이유).
 */
export default function PassBenefitModal({
  open,
  badge,
  eyebrow,
  title,
  subLines,
  onClose,
  children,
}: PassBenefitModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    /*
     * 배경 스크롤 잠금. 원래 값을 기억했다가 되돌린다 — 빈 문자열로 덮어쓰면 다른 곳이
     * 걸어 둔 overflow 까지 같이 풀린다.
     */
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="membership-root">
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 md:p-8"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          aria-label={title}
          aria-modal="true"
          className="rounded-xxl relative flex max-h-full w-full max-w-[1000px] flex-col overflow-hidden bg-white"
          role="dialog"
        >
          <button
            aria-label="닫기"
            className="text-neutral-40 absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-lg md:right-6 md:top-6"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>

          {/* 머리말과 본문이 한 덩어리로 스크롤한다. 시안에 고정 헤더가 없다 */}
          <div className="overflow-y-auto px-6 py-12 md:px-10 md:py-16">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full bg-[#F1642B] px-3 py-1 text-xs font-bold text-white">
                {badge}
              </span>
              <span className="text-sm font-bold tracking-wide text-[#F1642B]">
                {eyebrow}
              </span>
            </div>

            <h2 className="text-neutral-0 mt-4 text-center text-xl font-bold leading-snug md:text-[2rem]">
              {title}
            </h2>

            <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center leading-relaxed">
              {subLines.map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
            </p>

            <div className="mt-10 md:mt-14">{children}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
