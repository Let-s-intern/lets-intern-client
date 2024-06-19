import { IProgramGridItem } from '../../../../../interfaces/Program.interface';
import { PROGRAM_CLASSIFICATION_KEY } from '../../../../../utils/programConst';
import Description from '../ui/Description';
import Heading from '../ui/Heading';
import ProgramGridItem from './ProgramGridItem';

const PROGRAM_SECTION = {
  TITLE: ['내 커리어 단계에 딱 맞는', '프로그램을 찾아보세요'],
  DESC: '원하는 키워드를 클릭해보세요!',
};

const programList: IProgramGridItem[] = [
  {
    keyword: 'Start',
    title: '커리어 탐색 단계',
    descriptionList: [
      '아직 본인만의',
      '커리어 로드맵을',
      '찾지 못한 취업준비생',
    ],
    bgColor: 'bg-gradient-start',
    borderColor: 'border-[#E7E6FF]',
    textColor: 'text-primary',
    link: `/program?classification=${PROGRAM_CLASSIFICATION_KEY.CAREER_SEARCH}`,
    imgSrc: '/images/home/keyword-search.png',
  },
  {
    keyword: 'CV',
    title: '서류 작성 단계',
    descriptionList: ['이력서, 포트폴리오', '준비가 어려운', '취업준비생'],
    bgColor: 'bg-gradient-cv',
    borderColor: 'border-[#F1F1FF]',
    textColor: 'text-primary',
    link: `/program?classification=${PROGRAM_CLASSIFICATION_KEY.DOCUMENT_PREPARATION}`,
    imgSrc: '/images/home/keyword-book.png',
  },
  {
    keyword: 'Interview',
    title: '면접 준비 단계',
    descriptionList: [
      '서류를 합격했지만,',
      '면접 준비에 어려움을 겪는',
      '취업준비생',
    ],
    bgColor: 'bg-gradient-interview',
    borderColor: 'border-[#EDF3FF]',
    textColor: 'text-white',
    link: `/program?classification=${PROGRAM_CLASSIFICATION_KEY.MEETING_PREPARATION}`,
    imgSrc: '/images/home/keyword-chat.png',
  },
  {
    keyword: 'Growth',
    title: '합격 후 성장 단계',
    descriptionList: ['취뽀후 계속해서', '성장하고 싶은 누구나'],
    bgColor: 'bg-gradient-growth',
    borderColor: 'border-[#CCD7FF]',
    textColor: 'text-white',
    link: `/program?classification=${PROGRAM_CLASSIFICATION_KEY.PASS}`,
    imgSrc: '/images/home/keyword-trophy.png',
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
      </ul>
    </section>
  );
};

export default ProgramSection;
