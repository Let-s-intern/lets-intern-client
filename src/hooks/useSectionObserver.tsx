import { useEffect } from 'react';

export default function useSectionObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 페이지 이름
        const pageType = (
          document.querySelector('[data-page-type]') as HTMLElement
        ).dataset.pageType;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 섹션 이름
            const section = (entry.target as HTMLElement).dataset.section;

            // GA 데이터 전송
            window.dataLayer?.push({
              event: 'page_section_visibility',
              section,
              pageType,
            });
          }
        });
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

  return null;
}
