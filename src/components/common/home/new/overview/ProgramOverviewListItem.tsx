import { IProgram } from '../../../../../interfaces/interface';
import ProgramListItem from './ProgramListItem';

export interface ProgramOverviewListItemProps {
  title: string;
  description: string;
  imageColor?: 'blue' | 'green' | 'purple' | 'yellow';
}

const programOverviewList: IProgram[] = [
  {
    programInfo: {
      id: 0,
      programType: 'LIVE',
      programStatusType: 'PROCEEDING',
      title: 'AI 개발자의 커리어 세션',
      thumbnail: '/images/home/home-program-default.png',
      shortDesc: '29CM 백엔드 개발자',
      createDate: '2024-06-13T13:50:16.388Z',
      startDate: '2024-06-13T13:50:16.388Z',
      endDate: '2024-06-13T13:50:16.388Z',
      beginning: '2024-06-13T13:50:16.388Z',
      deadline: '2024-06-13T13:50:16.388Z',
    },
    classificationList: [{ programClassification: 'CAREER_SEARCH' }],
  },
  {
    programInfo: {
      id: 1,
      programType: 'CHALLENGE',
      programStatusType: 'PROCEEDING',
      title: '면접 완성 1주 챌린지',
      thumbnail: '/images/home/home-program-default.png',
      shortDesc: '1주만에 면접을 끝내보자',
      createDate: '2024-06-13T13:50:16.388Z',
      startDate: '2024-06-13T13:50:16.388Z',
      endDate: '2024-06-13T13:50:16.388Z',
      beginning: '2024-06-13T13:50:16.388Z',
      deadline: '2024-06-13T13:50:16.388Z',
    },
    classificationList: [{ programClassification: 'DOCUMENT_PREPARATION' }],
  },
  {
    programInfo: {
      id: 2,
      programType: 'VOD',
      programStatusType: 'PROCEEDING',
      title: 'VOD 클래스',
      thumbnail: '/images/home/home-program-default.png',
      shortDesc: 'VOD 클래스로 Skill up 하기',
      createDate: '2024-06-13T13:50:16.388Z',
      startDate: '2024-06-13T13:50:16.388Z',
      endDate: '2024-06-13T13:50:16.388Z',
      beginning: '2024-06-13T13:50:16.388Z',
      deadline: '2024-06-13T13:50:16.388Z',
    },
    classificationList: [{ programClassification: 'MEETING_PREPARATION' }],
  },
];

const ProgramOverviewListItem = () => {
  return (
    <div className="mt-6 overflow-hidden rounded-xs">
      <div className="flex items-center justify-center gap-1 bg-primary-10 py-3.5">
        <img className="w-5" src="/icons/Chevron_Left_MD.svg" alt="이전 달" />
        <span className="text-1">2024년 6월</span>
        <img className="w-5" src="/icons/Chevron_Right_MD.svg" alt="다음 달" />
      </div>
      <ul className=" grid grid-cols-1 gap-4 md:grid-cols-2">
        {programOverviewList.map((program) => (
          <ProgramListItem
            key={program.programInfo.programType + program.programInfo.id}
            program={program}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProgramOverviewListItem;
