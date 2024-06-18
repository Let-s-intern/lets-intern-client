import { IProgramGridItem } from '../../../../../interfaces/Program.interface';
import { PROGRAM_CLASSIFICATION_KEY } from '../../../../../utils/programConst';
import Description from '../ui/Description';
import Heading from '../ui/Heading';
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
    link: `/program?classification=${PROGRAM_CLASSIFICATION_KEY.CAREER_SEARCH}`,
  },
  {
    title: '서류 작성 단계',
    descriptionList: ['이력서, 포트폴리오', '준비가 어려운', '취업준비생'],
    bgColor: 'bg-primary-20',
    link: `/program?classification=${PROGRAM_CLASSIFICATION_KEY.DOCUMENT_PREPARATION}`,
  },
  {
    title: '면접 준비 단계',
    descriptionList: ['서류를 합격했지만,', '면접 준비에 어려움을 겪는 사람'],
    bgColor: 'bg-primary-xlight',
    link: `/program?classification=${PROGRAM_CLASSIFICATION_KEY.MEETING_PREPARATION}`,
  },
];

const ProgramSection = () => {
  return (
    <section>
      <div className="flex flex-col gap-1">
        <Heading>
          {PROGRAM_SECTION.TITLE.map((title) => (
            <span>{title}</span>
          ))}
        </Heading>
        <Description>{PROGRAM_SECTION.DESC}</Description>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {programList.map((program) => (
          <ProgramGridItem
            key={program.title}
            program={program}
            link={program.link}
          />
        ))}
        <ProgramPointItem />
      </ul>
    </section>
  );
};

export default ProgramSection;
