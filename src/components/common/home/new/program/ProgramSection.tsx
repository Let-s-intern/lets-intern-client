import { IProgramGridItem } from '../../../../../interfaces/Program.interface';
import { PROGRAM_CLASSIFICATION } from '../../../../../utils/programConst';
import ProgramGridItem from './ProgramGridItem';
import ProgramPointItem from './ProgramPointItem';

const PROGRAM_SECTION = {
  TITLE: ['내 커리어 단계에 딱 맞는', '프로그램을 찾아보세요'],
  DESC: '원하는 키워드를 클릭해보세요!',
};

const programList: IProgramGridItem[] = [
  {
    title: '커리어 탐색 단계',
    descriptionList: [
      '아직 본인만의',
      '커리어 로드맵을',
      '찾지 못한 취업준비생',
    ],
    bgColor: 'bg-primary-10',
    link: `/program?classification=${PROGRAM_CLASSIFICATION.CAREER_SEARCH}`,
  },
  {
    title: '서류 작성 단계',
    descriptionList: ['이력서, 포트폴리오', '준비가 어려운', '취업준비생'],
    bgColor: 'bg-primary-20',
    link: `/program?classification=${PROGRAM_CLASSIFICATION.DOCUMENT_PREPARATION}`,
  },
  {
    title: '면접 준비 단계',
    descriptionList: ['서류를 합격했지만,', '면접 준비에 어려움을 겪는 사람'],
    bgColor: 'bg-primary-xlight',
    link: `/program?classification=${PROGRAM_CLASSIFICATION.MEETING_PREPARATION}`,
  },
];

const ProgramSection = () => {
  return (
    <section>
      <div className="flex flex-col gap-1">
        <h1 className="text-1.125-bold lg:text-1.375-bold xl:text-1.5-semibold flex flex-col gap-1 text-neutral-0 md:flex-row">
          {PROGRAM_SECTION.TITLE.map((title) => (
            <span>{title}</span>
          ))}
        </h1>
        <span className="text-0.75 text-neutral-20">
          {PROGRAM_SECTION.DESC}
        </span>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {programList.map((program) => (
          <ProgramGridItem key={program.title} program={program} />
        ))}
        <ProgramPointItem />
      </ul>
    </section>
  );
};

export default ProgramSection;
