/** 헤더 높이만큼 오프셋 두고 섹션 id 로 부드럽게 스크롤 (챌린지 상세와 동일 오프셋) */
export function scrollToSection(id: string, offset = 70) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top - offset;
  window.scrollBy({ top, behavior: 'smooth' });
}
