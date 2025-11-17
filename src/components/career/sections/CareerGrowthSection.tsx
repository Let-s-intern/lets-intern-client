import { useRouter } from 'next/navigation';
import CareerCard from '../../common/mypage/career/card/CareerCard';

const CareerGrowthSection = () => {
  const router = useRouter();

  // TODO: 서버에서 받아올 데이터 (임시 하드코딩)
  const programs = [
    {
      id: 1,
      thumbnail: '',
      status: '참여중',
      programType: '프로그램 종류',
      startDate: '24.04.04',
      endDate: '24.04.04',
      title: '인턴 지원 2주 챌린지 인턴 지원',
      description:
        '마케팅 현직자 4명과 함께 하는 서류 끝장 4주 패키지 마케팅 현직자 마케팅 현직자 4명 과 함께 하는 서류 끝장 4주 패키지 마케팅 현직자',
      purchasePlan: '스탠다드',
    },
    {
      id: 2,
      thumbnail: '',
      status: '참여중',
      programType: '프로그램 종류',
      startDate: '24.04.04',
      endDate: '24.04.04',
      title: '인턴 지원 2주 챌린지 인턴 지원',
      description:
        '마케팅 현직자 4명과 함께 하는 서류 끝장 4주 패키지 마케팅 현직자 마케팅 현직자 4명 과 함께 하는 서류 끝장 4주 패키지 마케팅 현직자',
      purchasePlan: '스탠다드',
    },
    {
      id: 3,
      thumbnail: '',
      status: '참여중',
      programType: '프로그램 종류',
      startDate: '24.04.04',
      endDate: '24.04.04',
      title: '인턴 지원 2주 챌린지 인턴 지원',
      description:
        '마케팅 현직자 4명과 함께 하는 서류 끝장 4주 패키지마케팅 현직자 4명과 함께 하는 서류 끝장 4주 패키지마케팅 현직자 4명과 함께 하는 서류 끝장 4주 패키지마케팅 현직자 4명과 함께 하는 서류 끝장 4주 패키지마케팅 현직자 4명과 함께 하는 서류 끝장 4주 패키지 마케팅 현직자 마케팅 현직자 4명 과 함께 하는 서류 끝장 4주 패키지 마케팅 현직자',
      purchasePlan: '스탠다드',
    },
  ];

  // 데이터 존재 여부 확인
  const hasData = programs.length > 0;

  return (
    <CareerCard
      title="커리어 성장"
      labelOnClick={() => router.push('/mypage/application')}
      body={
        hasData ? (
          <CareerGrowthBody programs={programs} />
        ) : (
          <CareerCard.Empty
            description="참여 중인 프로그램이 없어요."
            buttonText="프로그램 둘러보기"
            buttonHref="/program"
            onClick={() => router.push('/program')}
          />
        )
      }
    />
  );
};

export default CareerGrowthSection;

interface Program {
  id: number;
  thumbnail: string;
  status: string;
  programType: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  purchasePlan: string;
}

interface CareerGrowthBodyProps {
  programs: Program[];
}

const CareerGrowthBody = ({ programs }: CareerGrowthBodyProps) => {
  return (
    <div className="flex flex-col gap-4">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
};

interface ProgramCardProps {
  program: Program;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  const router = useRouter();
  const period = `${program.startDate} ~ ${program.endDate}`;

  return (
    <div className="flex gap-4">
      {/* 썸네일 */}
      <div className="h-[119px] w-[158px] shrink-0 rounded-xs bg-neutral-80" />

      {/* 내용 */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* 상단: 태그, 프로그램 종류, 진행기간, 버튼 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="rounded-xxs bg-primary-10 px-2 py-0.5 text-xxsmall12 font-normal text-primary">
              {program.status}
            </span>
            <span className="text-xxsmall12 font-normal text-neutral-40">
              {program.programType}
            </span>
            <div className="h-4 w-px bg-neutral-80" />
            <span className="text-xxsmall12 font-normal text-neutral-40">
              진행기간 {period}
            </span>
          </div>
        </div>

        {/* 중간: 제목, 설명 */}
        <div className="flex flex-col gap-1">
          <h3 className="text-xsmall16 font-semibold text-neutral-0">
            {program.title}
          </h3>
          <p className="line-clamp-2 text-xsmall14 text-neutral-20">
            {program.description}
          </p>
        </div>

        {/* 하단: 구매플랜 */}
        <span className="flex flex-row gap-1 text-xxsmall12 text-neutral-0">
          구매플랜
          <p className="text-xxsmall12 text-primary">{program.purchasePlan}</p>
        </span>
      </div>
      <div>
        <button
          type="button"
          onClick={() => router.push(`/program/challenge/${program.id}`)}
          className="ml-8 h-auto w-auto rounded-xxs border border-primary px-3 py-1.5 text-xxsmall12 font-normal text-primary hover:bg-neutral-100"
        >
          대시보드 입장
        </button>
      </div>
    </div>
  );
};
