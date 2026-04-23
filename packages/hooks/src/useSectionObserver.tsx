import { useEffect, useRef } from 'react';

export default function useSectionObserver() {
  const intersectedEntries = useRef(new Set()); // 섹션 중복 방지
  const prevEntry = useRef<IntersectionObserverEntry>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && prevEntry.current === undefined) {
            prevEntry.current = entry;
            continue;
          }

          if (entry.isIntersecting) {
            // 중복된 섹션이 아니고, 이전 섹션이 보인 시간과 1초 이상 차이나면
            if (
              !intersectedEntries.current.has(prevEntry.current?.target) &&
              entry.time - (prevEntry.current?.time ?? 0) >= 1000
            ) {
              const pageType = (
                document.querySelector('[data-page-type]') as HTMLElement
              ).dataset.pageType;
              const section = (prevEntry.current?.target as HTMLElement).dataset
                .section;

              intersectedEntries.current.add(prevEntry.current?.target);

              // GA 데이터 전송
              window.dataLayer?.push({
                event: 'page_section_visibility',
                section,
                pageType,
              });
            }
            // 이전 섹션 변경
            prevEntry.current = entry;
          }
        }
      },
      // section 위 또는 아래의 50%가 뷰 안에 진입하면 데이터 전송
      { threshold: 0.5 },
    );

    // data-section을 가진 모든 element 관찰
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);
}
