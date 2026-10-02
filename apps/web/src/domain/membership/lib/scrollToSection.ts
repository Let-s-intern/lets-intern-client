'use client';

/*
 * 섹션으로 옮기는 스크롤. 진단 결과가 나올 때와 「다시 진단하기」가 쓴다.
 *
 * 화면 위에 붙어 있는 보조 네비(.mnav) 높이만큼 띄운다. 그러지 않으면 섹션 머리가
 * 네비 밑으로 숨어 "왜 여기로 왔지" 가 된다. 네비가 없으면(모바일 초기 렌더 등)
 * 기본값으로 계산한다.
 */

const FALLBACK_NAV_HEIGHT = 56;
/** 네비 아래로 더 띄우는 여백. PRD 4.6 의 offset −16px 이다 */
const GAP = 16;

export function scrollToSection(id: string) {
  if (typeof window === 'undefined') return;

  const target = document.getElementById(id);
  if (!target) return;

  const navHeight =
    document.querySelector('.mnav')?.getBoundingClientRect().height ??
    FALLBACK_NAV_HEIGHT;
  const top =
    window.scrollY + target.getBoundingClientRect().top - navHeight - GAP;

  window.scrollTo({ top, behavior: 'smooth' });
}
