import Description from '../ui/Description';
import Heading from '../ui/Heading';
import ProgramOverviewListItem from './ProgramOverviewListItem';

const PROGRAM_OVERVIEW_SECTION = {
  title: ['한 눈에 확인하는', '렛츠커리어 프로그램 일정'],
  description: '나에게 맞는 일정에 프로그램을 신청해보세요!',
};

const ProgramOverviewSection = () => {
  return (
    <section>
      <div className="px-4 sm:px-0">
        <Heading>
          {PROGRAM_OVERVIEW_SECTION.title.map((title) => (
            <span key={title}>{title}</span>
          ))}
        </Heading>
      </div>
      <Description>{PROGRAM_OVERVIEW_SECTION.description}</Description>
      <ProgramOverviewListItem />
    </section>
  );
};

export default ProgramOverviewSection;
