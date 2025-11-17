import { useRouter } from 'next/navigation';
import CareerCard from '../../common/mypage/career/card/CareerCard';

const CareerRecordSection = () => {
  const router = useRouter();

  // TODO: 서버에서 받아올 데이터 (임시 하드코딩)
  const category = '경력';
  const jobTitle = '서비스 기획자';
  const companyName =
    '회사 이름 회사 이름 회사 이름 회사 이름 회사 이름 회사 이름 회사 이름 회사 이름 ';
  const employmentType = '정규직';
  const startDate = '2025.01.01';
  const endDate = '2025.02.02';

  // 데이터 존재 여부 확인
  const hasData = category || jobTitle || companyName;

  return (
    <CareerCard
      title="커리어 기록"
      labelOnClick={() => router.push('/mypage/career/record')}
      body={
        hasData ? (
          <CareerRecordBody
            category={category}
            jobTitle={jobTitle}
            companyName={companyName}
            employmentType={employmentType}
            startDate={startDate}
            endDate={endDate}
          />
        ) : (
          <CareerCard.Empty
            description="아직 등록된 커리어가 없어요"
            buttonText="커리어 기록하기"
            buttonHref="/mypage/career/record"
            onClick={() => router.push('/mypage/career/record')}
          />
        )
      }
    />
  );
};

export default CareerRecordSection;

interface CareerRecordBodyProps {
  category: string;
  jobTitle: string;
  companyName: string;
  employmentType: string;
  startDate: string;
  endDate: string;
}

const CareerRecordBody = ({
  category,
  jobTitle,
  companyName,
  employmentType,
  startDate,
  endDate,
}: CareerRecordBodyProps) => {
  const workPeriod = `${startDate} - ${endDate}`;

  return (
    <div className="flex flex-col gap-4">
      {/* 경력 카테고리 */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xxsmall12 font-normal text-[#4138A3]">
          {category}
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-xsmall14 font-normal text-neutral-0">
            {jobTitle}
          </span>
          <span className="truncate text-xsmall16 font-medium text-neutral-0">
            {companyName}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xsmall14 font-normal text-neutral-0">
              {employmentType}
            </span>
            <span className="text-xsmall14 font-normal text-neutral-40">
              {workPeriod}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
