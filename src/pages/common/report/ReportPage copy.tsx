import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { twMerge } from 'tailwind-merge';
import { useGetActiveReports } from '../../../api/report';
import LexicalContent from '../../../components/common/blog/LexicalContent';
import { ReportHeader } from '../../../components/common/report/ReportHeader';

type SectionId =
  | 'section_resume'
  | 'section_personal_statement'
  | 'section_portfolio';

const sections: { id: SectionId; title: string }[] = [
  { id: 'section_resume', title: '이력서' },
  { id: 'section_personal_statement', title: '자기소개서' },
  { id: 'section_portfolio', title: '포트폴리오' },
];

const ReportPage = () => {
  const title = `서류 진단 프로그램 - 렛츠커리어`;
  const url = `${window.location.origin}/report`;
  // TODO: 설명 추가
  const description = '서류 진단 프로그램입니다. ...';

  const [activeSection, setActiveSection] =
    useState<SectionId>('section_resume');
  const observerRefs = useRef<(HTMLElement | null)[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<null | SectionId>(null);

  const { data } = useGetActiveReports();

  const roots = [
    JSON.parse(data?.resumeInfo.contents || '{"root":{}}').root,
    JSON.parse(data?.personalStatementInfo.contents || '{"root":{}}').root,
    JSON.parse(data?.portfolioInfo.contents || '{"root":{}}').root,
  ];

  useEffect(() => {
    console.log('data', data);
  }, [data]);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id as SectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    });

    sections.forEach((_, index) => {
      if (observerRefs.current[index]) {
        observer.observe(observerRefs.current[index]);
      }
    });

    return () => {
      sections.forEach((_, index) => {
        if (observerRefs.current[index]) {
          observer.unobserve(observerRefs.current[index]);
        }
      });
    };
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={url} />
        {description ? <meta name="description" content={description} /> : null}
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />

        {description ? (
          <meta property="og:description" content={description} />
        ) : null}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:url" content={url} />
        {description ? (
          <meta name="twitter:description" content={description} />
        ) : null}
      </Helmet>
      <section className="mx-auto max-w-5xl px-5">
        <ReportHeader />
        <div className="flex h-[218px] justify-center rounded-xs bg-[#4138A3]">
          <img src="/images/report-banner.png" />
        </div>
        <div className="rounded my-4 flex h-80 items-center justify-center bg-slate-100">
          서류 진단 서비스 간략 소개 ...
        </div>
        <div className="rounded my-4 flex h-80 items-center justify-center bg-slate-100">
          서류 진단 서비스 간략 소개 ...
        </div>
        <div className="rounded my-4 flex h-80 items-center justify-center bg-slate-100">
          서류 진단 서비스 간략 소개 ...
        </div>
        <div className="rounded my-4 flex h-80 items-center justify-center bg-slate-100">
          서류 진단 서비스 간략 소개 ...
        </div>
        <div className="rounded my-4 flex h-80 items-center justify-center bg-slate-100">
          서류 진단 서비스 간략 소개 ...
        </div>
      </section>
      <div>
        <header className="sticky top-[60px] mb-4 flex items-center bg-neutral-10 md:top-[70px] lg:top-[76px]">
          {sections.map((section) => {
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                title={section.title}
                onClick={(e) => handleClick(e, section.id)}
                className={twMerge(
                  'flex h-14 flex-1 items-center justify-center border-b-2 border-transparent text-center text-white/30 transition hover:text-primary-light',
                  activeSection === section.id &&
                    'border-b-primary-light text-primary-light',
                )}
              >
                {section.title}
              </a>
            );
          })}
        </header>

        <div className="mx-auto max-w-5xl px-5">
          <section
            ref={(el) => (observerRefs.current[0] = el)}
            id={sections[0]?.id}
            className="pt-40"
          >
            <LexicalContent node={roots[0]} />
          </section>

          <section
            ref={(el) => (observerRefs.current[1] = el)}
            id={sections[1]?.id}
            className="pt-40"
          >
            <LexicalContent node={roots[1]} />
          </section>

          <section
            ref={(el) => (observerRefs.current[2] = el)}
            id={sections[2]?.id}
            className="pt-40"
          >
            <LexicalContent node={roots[2]} />
          </section>
        </div>
      </div>
      {/* Drawer */}
      <div className="shadow-lg rounded-t-2xl fixed bottom-0 left-0 right-0 bg-white transition">
        <div className="mx-auto max-w-5xl px-5 pb-2">
          {!isDrawerOpen ? (
            <button
              type="button"
              className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 transition hover:bg-primary-light disabled:border-neutral-70 disabled:bg-neutral-70"
              onClick={() => setIsDrawerOpen('section_personal_statement')}
            >
              {sections.find(({ id }) => id === activeSection)?.title} 서류 진단
              신청하기
            </button>
          ) : null}

          {isDrawerOpen ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark transition hover:border-primary-light disabled:border-neutral-70 disabled:bg-neutral-70 disabled:text-white"
                onClick={() => setIsDrawerOpen(null)}
                // disabled={contentIndex === 0}
                // TODO: 초기화까지 진행
              >
                이전 단계로
              </button>
              <button
                type="button"
                className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 transition hover:bg-primary-light disabled:border-neutral-70 disabled:bg-neutral-70"
                // onClick={handleNextButtonClick}
                // disabled={buttonDisabled}
              >
                결제하기
              </button>
            </div>
          ) : null}
        </div>
      </div>
      =
    </>
  );
};

export default ReportPage;
