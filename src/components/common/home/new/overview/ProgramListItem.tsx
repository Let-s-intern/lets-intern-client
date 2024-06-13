import { PROGRAM_STATUS } from '../../../../../utils/programConst';
import ProgramStatusTag from '../../../program/programs/card/ProgramStatusTag';

const programOverviewList = [
  {
    programInfo: {
      id: 0,
      programType: 'LIVE',
      programStatusType: 'PROCEEDING',
      title: 'AI 개발자의 커리어 세션',
      thumbnail: '/images/home/home-program-default.png',
      shortDesc: '29CM 백엔드 개발자',
      startDate: '2024-06-13T13:50:16.388Z',
      endDate: '2024-06-13T13:50:16.388Z',
      beginning: '2024-06-13T13:50:16.388Z',
      deadline: '2024-06-13T13:50:16.388Z',
    },
    classificationList: { programClassification: 'CAREER_SEARCH' },
  },
  {
    programInfo: {
      id: 1,
      programType: 'CHALLENGE',
      programStatusType: 'PROCEEDING',
      title: '면접 완성 1주 챌린지',
      thumbnail: '/images/home/home-program-default.png',
      shortDesc: '1주만에 면접을 끝내보자',
      startDate: '2024-06-13T13:50:16.388Z',
      endDate: '2024-06-13T13:50:16.388Z',
      beginning: '2024-06-13T13:50:16.388Z',
      deadline: '2024-06-13T13:50:16.388Z',
    },
    classificationList: { programClassification: 'DOCUMENT_PREPARATION' },
  },
  {
    programInfo: {
      id: 2,
      programType: 'VOD',
      programStatusType: 'PROCEEDING',
      title: 'VOD 클래스',
      thumbnail: '/images/home/home-program-default.png',
      shortDesc: 'VOD 클래스로 Skill up 하기',
      startDate: '2024-06-13T13:50:16.388Z',
      endDate: '2024-06-13T13:50:16.388Z',
      beginning: '2024-06-13T13:50:16.388Z',
      deadline: '2024-06-13T13:50:16.388Z',
    },
    classificationList: { programClassification: 'MEETING_PREPARATION' },
  },
];

const ProgramListItem = () => {
  const formatDateString = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    return `${year}년 ${month}월`;
  };

  return (
    <li className="flex items-center rounded-xs border border-neutral-85">
      <img
        className="h-[7.5rem] w-[7.5rem] rounded-xs"
        src="/images/home/home-program-default.png"
        alt="프로그램 썸네일"
      />
      <div className="w-full px-3">
        <div className="mb-2 flex flex-col items-start gap-1">
          <ProgramStatusTag status={PROGRAM_STATUS.PROCEEDING} />
          <h2 className="text-1-medium">VOD 클래스</h2>
          <span className="text-0.75">29CM 백엔드 개발자</span>
        </div>
        <div className="text-0.75-medium flex w-full justify-end gap-1.5">
          <span>진행기간</span>
          <span className="text-primary-dark">24.04.04 ~ 24.04.04</span>
        </div>
      </div>
    </li>
  );
};

export default ProgramListItem;
