import CheckIcon from '@/assets/icons/check.svg';
import { getChallengeThemeColor } from '../utils/getChallengeThemeColor';

const PM_PRIMARY = getChallengeThemeColor('PM');
const PM_LIGHT_ACCENT = '#E8F9F2';
const PM_GRADIENT_BG = 'linear-gradient(41deg, #E8F9F2 23.05%, #A8EAD1 100%)';

// Step 1: LIVE 세미나 (HR Seminar와 동일 구조, PM 색상)
type LectureData = {
  topic: string;
  mentorImage: string;
  mentorName: string;
  schedule: string;
  companyLogo: string;
};

const InstructorCard = ({ lecture }: { lecture: LectureData }) => (
  <div
    className="relative flex h-[260px] w-full min-w-[320px] flex-col overflow-hidden rounded-xl p-0 lg:w-[340px]"
    style={{ background: PM_GRADIENT_BG }}
  >
    <div className="absolute right-0 top-0 z-0 pr-[19px] pt-8">
      <img
        src={lecture.mentorImage}
        alt={lecture.mentorName}
        className="h-32 w-auto md:h-[154px]"
      />
    </div>

    <div className="relative z-10 pl-4 pt-4 md:mb-[82px]">
      <img
        src={lecture.companyLogo}
        alt="소속로고"
        className="h-10 w-10 rounded-md md:h-12 md:w-12"
        aria-hidden="true"
      />
    </div>

    <div className="relative z-10 mt-auto flex flex-col gap-2 rounded-b-md bg-gradient-to-b from-[rgba(232,249,242,0.0)] to-[#E8F9F2] px-4 pb-4 tracking-tight blur-[0px] backdrop-blur-[1.5px]">
      <div
        className="rounded-xxs flex w-fit items-center justify-center px-[6px] py-[3px]"
        style={{ backgroundColor: PM_PRIMARY }}
      >
        <span className="text-xsmall12 md:text-xsmall14 font-medium text-neutral-100">
          {lecture.schedule}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h4 className="text-xsmall18 text-neutral-0 md:text-small20 font-bold">
          {lecture.mentorName}
        </h4>
        <p className="text-xxsmall14 text-neutral-30 md:text-small18">
          {lecture.topic}
        </p>
      </div>
    </div>
  </div>
);

type SeminarProps = { lectures?: LectureData[] };

export const PmSeminar = ({ lectures }: SeminarProps) => {
  const hasLectures = lectures && lectures.length > 0;
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 md:gap-8">
      <div className="mx-auto w-full max-w-[900px]">
        <img
          src="/images/live-seminar.gif"
          alt="PM LIVE 세미나"
          className="w-full rounded-xl"
        />
      </div>
      {hasLectures && (
        <div className="mx-auto grid w-full max-w-[1060px] grid-cols-1 place-items-center justify-center gap-5 lg:grid-cols-3">
          {lectures.map((lecture, index) => (
            <InstructorCard key={index} lecture={lecture} />
          ))}
        </div>
      )}
    </div>
  );
};

// Step 2: 6회차 학습콘텐츠 그리드
const SESSION_ITEMS = [
  {
    title: '1회차 PM직무 이해',
    items: [
      'PM/PO/서비스 기획자의 차이 이해하기',
      '지원동기 작성을 돕는 직무 분석 꿀팁 제공',
    ],
    image: '/images/pm-step2-1.png',
  },
  {
    title: '2회차 경험정리',
    items: ['분석한 직무 바탕으로 모든 서류의 기초가 되는 경험정리 하기'],
    image: '/images/pm-step2-2.png',
  },
  {
    title: '3회차 경험과 역량 연결',
    items: ['정리한 경험 기반 PM 필수 역량과 연결하기'],
    image: '/images/pm-step2-3.png',
  },
  {
    title: '4회차 PM 이력서·자소서 초안 작성',
    items: ['이력서·자소서 필수 구성요소 알아보기', 'PM 합격 자소서 예시 제공'],
    image: '/images/pm-step2-4.png',
  },
  {
    title: '5회차 PM 포트폴리오 초안 작성',
    items: ['PM 포트폴리오에 반드시 들어가야 하는 5가지 핵심요소 알아보기'],
    image: '/images/pm-step2-5.png',
  },
  {
    title: '6회차 미션 서류 완성하기',
    items: [
      '체크리스트 기반 서류 검토 및 완성하기',
      '채용공고 분석 및 지원 일정 관리 꿀팁 제공',
    ],
    image: '/images/pm-step2-6.png',
  },
];

const CheckItem = ({ children }: { children: string }) => (
  <div className="flex items-start gap-1.5">
    <CheckIcon
      style={{ color: PM_PRIMARY }}
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    />
    <p className="text-xsmall14 md:text-small18">{children}</p>
  </div>
);

const SessionCard = ({
  title,
  items,
  image,
}: {
  title: string;
  items: string[];
  image: string;
}) => (
  <div
    className="flex h-[281px] flex-col gap-5 rounded-lg p-4 md:h-[374px] md:gap-8"
    style={{ backgroundColor: PM_LIGHT_ACCENT }}
  >
    <img src={image} alt={title} className="w-full rounded-md" />
    <div>
      <h3 className="text-small18 text-neutral-0 md:text-medium24 mb-2.5 font-semibold">
        {title}
      </h3>
      <div className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <CheckItem key={i}>{item}</CheckItem>
        ))}
      </div>
    </div>
  </div>
);

export const PmContentGrid = () => (
  <div className="grid w-full max-w-[1324px] grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3 md:gap-y-[30px]">
    {SESSION_ITEMS.map((session, i) => (
      <SessionCard key={i} {...session} />
    ))}
  </div>
);

// Step 3: 1:1 맞춤 멘토링 (HrFeedbackSection과 동일한 UI)
const PM_MENTORING_BENEFITS = [
  {
    title: 'PM 현직자의 1:1 멘토',
    description: (
      <span>
        PM 현직자에게 나의 서류와 커리어 고민을 <br className="md:hidden" />
        직접 공유하고, 직무 관점에서 구체적인 개선
        <br className="md:hidden" />
        방향을 피드백받을 수 있어요!
        <br />
        (스탠다드 및 프리미엄 구매 시)
      </span>
    ),
  },
  {
    title: 'PM 현직자의 LIVE 서류 및 커리어 피드백',
    description: (
      <span>
        라이브 세미나를 통해 실제 채용 기준과 사례를 바탕으로, 많은 지원자들이
        놓치는 <br className="md:hidden" />
        서류 포인트와 커리어 방향을 함께 점검해요!
        <br />
        (스탠다드 및 프리미엄 구매 시)
      </span>
    ),
  },
];

export const PmMentoring = () => (
  <div className="flex w-full min-w-[320px] flex-col gap-3.5 md:max-w-[1000px]">
    <div className="mx-auto w-full min-w-[320px] max-w-[500px] overflow-hidden rounded-md md:h-[300px] md:w-[500px] md:flex-shrink-0">
      <img
        src="/images/portfolio-feedback.gif"
        alt="현직자 1:1 맞춤 멘토링"
        className="h-full w-full object-cover object-center"
      />
    </div>
    {PM_MENTORING_BENEFITS.map((benefit, index) => (
      <div
        key={index}
        className="bg-neutral-95 flex flex-1 flex-col gap-4 rounded-md px-5 py-10 md:min-h-[186px] md:min-w-[532px] md:gap-6 md:px-[30px] md:py-10"
      >
        <h4 className="text-small18 text-neutral-0 md:text-medium22 font-bold">
          {benefit.title}
        </h4>
        <div className="flex items-start">
          <CheckIcon
            style={{ color: PM_PRIMARY }}
            className="h-6 w-6 shrink-0"
            aria-hidden="true"
          />
          <span className="text-xsmall14 text-neutral-30 md:text-small18">
            {benefit.description}
          </span>
        </div>
      </div>
    ))}
  </div>
);
