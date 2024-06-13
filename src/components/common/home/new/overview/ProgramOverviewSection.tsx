import ProgramOverviewListItem from './ProgramOverviewListItem';

const PROGRAM_OVERVIEW_SECTION = {
  TITLE: ['한 눈에 확인하는', '렛츠커리어 프로그램 일정'],
  DESC: '나에게 맞는 일정에 프로그램을 신청해보세요!',
};

const ProgramOverviewSection = () => {
  return (
    <section>
      <h1 className="text-1.125-bold lg:text-1.375-bold xl:text-1.5-semibold flex flex-col gap-1 text-neutral-0 md:flex-row">
        {PROGRAM_OVERVIEW_SECTION.TITLE.map((title) => (
          <span>{title}</span>
        ))}
      </h1>
      <span className="text-0.75 text-neutral-20">
        {PROGRAM_OVERVIEW_SECTION.DESC}
      </span>
      <ProgramOverviewListItem />
    </section>
  );
};

export default ProgramOverviewSection;
