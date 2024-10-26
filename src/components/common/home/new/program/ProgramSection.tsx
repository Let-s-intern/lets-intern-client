import { IProgramGridItem } from '../../../../../types/Program.interface';
import { PROGRAM_CLASSIFICATION_KEY } from '../../../../../utils/programConst';
import Description from '../ui/Description';
import Heading from '../ui/Heading';
import ProgramGridItem from './ProgramGridItem';

const PROGRAM_SECTION = {
  title: ['내 커리어 단계에', '딱 맞는 프로그램을 찾아보세요'],
  description: '취업준비가 처음이라면, 커리어 탐색부터 시작해보세요!',
};

const programList: IProgramGridItem[] = [
  {
    keyword: 'Start',
    title: ['커리어 탐색', '단계'],
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
    className: 'career_card',
  },
  {
    keyword: 'CV',
    title: ['서류 작성', '단계'],
    descriptionList: ['이력서, 포트폴리오', '준비가 어려운', '취업준비생'],
    bgColor: 'bg-gradient-cv',
    borderColor: 'border-[#F1F1FF]',
    textColor: 'text-primary',
    link: `/program?classification=${PROGRAM_CLASSIFICATION_KEY.DOCUMENT_PREPARATION}`,
    imgSrc: '/images/home/keyword-book.png',
    className: 'document_card',
  },
  {
    keyword: 'Interview',
    title: ['면접 준비', '단계'],
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
    className: 'interview_card',
  },
  {
    keyword: 'Growth',
    title: ['합격 후', '성장 단계'],
    descriptionList: ['취뽀후 계속해서', '성장하고 싶은 누구나'],
    bgColor: 'bg-gradient-growth',
    borderColor: 'border-[#CCD7FF]',
    textColor: 'text-white',
    link: `https://letscareer.oopy.io/fb187843-f493-47cf-9d2a-f647875bb3df`,
    imgSrc: '/images/home/keyword-trophy.png',
    className: 'pass_card',
  },
];

const ProgramSection = () => {
  return (
    <section className="px-5">
      <div className="flex flex-col gap-1">
        <Heading>
          {PROGRAM_SECTION.title.map((title) => (
            <span key={title}>{title}</span>
          ))}
        </Heading>
        <Description>{PROGRAM_SECTION.description}</Description>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {programList.map((program) => (
          <ProgramGridItem
            key={program.keyword}
            program={program}
            link={program.link}
            className={program.className}
          />
        ))}
      </ul>
    </section>
  );
};

export default ProgramSection;
