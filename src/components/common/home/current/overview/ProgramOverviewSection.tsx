import ProgramOverviewListItem from './ProgramOverviewListItem';

const ProgramOverviewSection = () => {
  return (
    <section>
      <h1 className="lg:text-md-1.375-semibold text-sm-1.125-bold text-neutral-0">
        일정 한눈에 보기
      </h1>
      <nav>
        <ul className="mt-6 flex items-start gap-4">
          <li className="text-xs-1-semibold text-primary-dark underline underline-offset-[6px]">
            프로그램별
          </li>
          <li>일정별</li>
        </ul>
      </nav>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <ProgramOverviewListItem
          title="인턴 지원 2주 챌린지"
          description="2주동안 ~을 통해 경험정리 및 지원까지 한번에"
          imageColor="blue"
          programList={[
            { status: 'IN_PROGRESS', title: '17기' },
            {
              status: 'BEFORE',
              title: '18기',
              openDate: '2024-05-01T00:00Z',
            },
          ]}
        />
        <ProgramOverviewListItem
          title="부트캠프"
          description="2주동안 ~을 통해 경험정리 및 지원까지 한번에"
          imageColor="green"
          programList={[
            { status: 'IN_PROGRESS', title: '17기' },
            {
              status: 'BEFORE',
              title: '18기',
              openDate: '2024-05-01T00:00Z',
            },
          ]}
        />
        <ProgramOverviewListItem
          title="렛츠챗 세션"
          description="2주동안 ~을 통해 경험정리 및 지원까지 한번에"
          imageColor="purple"
          programList={[
            { status: 'IN_PROGRESS', title: '대학내일' },
            {
              status: 'BEFORE',
              title: '렛츠챗 세션최대',
              openDate: '2024-05-01T00:00Z',
            },
          ]}
        />
        <ProgramOverviewListItem
          title="상시콘텐츠"
          description="2주동안 ~을 통해 경험정리 및 지원까지 한번에"
          imageColor="yellow"
          programList={[
            { status: 'IN_PROGRESS', title: '17기' },
            {
              status: 'BEFORE',
              title: '18기',
              openDate: '2024-05-01T00:00Z',
            },
          ]}
        />
      </div>
    </section>
  );
};

export default ProgramOverviewSection;
