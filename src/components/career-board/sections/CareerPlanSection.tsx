import { useUserQuery } from '@/api/user';
import LoadingContainer from '@/components/common/ui/loading/LoadingContainer';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CareerCard from '../../common/mypage/career/card/CareerCard';
import { useCareerDataStatus } from '../contexts/CareerDataStatusContext';

const CareerPlanSection = () => {
  const router = useRouter();
  const { data: userData, isLoading } = useUserQuery();
  const { setHasCareerData } = useCareerDataStatus();

  // 서버에서 받아온 데이터
  const wishField = userData?.wishField ?? null;
  const wishJob = userData?.wishJob ?? null;
  const wishIndustry = userData?.wishIndustry ?? null;
  const wishCompany = userData?.wishCompany ?? null;

  // 데이터 존재 여부 확인 (null, 빈 문자열 체크)
  const hasData =
    (wishField && wishField.trim()) ||
    (wishJob && wishJob.trim()) ||
    (wishIndustry && wishIndustry.trim()) ||
    (wishCompany && wishCompany.trim());

  useEffect(() => {
    if (hasData) {
      setHasCareerData(true);
    }
  }, [hasData, setHasCareerData]);

  if (isLoading) {
    return (
      <CareerCard
        title="커리어 계획"
        labelOnClick={() => router.push('/mypage/career/plan')}
        body={<LoadingContainer text="커리어 계획 조회 중" />}
      />
    );
  }

  return (
    <CareerCard
      title="커리어 계획"
      labelOnClick={() => router.push('/mypage/career/plan')}
      body={
        hasData ? (
          <CareerPlanBody
            wishField={wishField}
            wishJob={wishJob}
            wishIndustry={wishIndustry}
            wishCompany={wishCompany}
          />
        ) : (
          <CareerCard.Empty
            description="아직 커리어 방향을 설정하지 않았어요."
            buttonText="커리어 계획하기"
            buttonHref="/mypage/career/plan"
            onClick={() => router.push('/mypage/career/plan')}
          />
        )
      }
    />
  );
};

export default CareerPlanSection;

interface CareerPlanBodyProps {
  wishField: string | null;
  wishJob: string | null;
  wishIndustry: string | null;
  wishCompany: string | null;
}

const CareerPlanBody = ({
  wishField,
  wishJob,
  wishIndustry,
  wishCompany,
}: CareerPlanBodyProps) => {
  // 희망 직군/직무 조합
  const jobRoleText = (() => {
    const parts: string[] = [];
    if (wishField && wishField.trim()) parts.push(wishField.trim());
    if (wishJob && wishJob.trim()) parts.push(wishJob.trim());
    return parts.length > 0 ? parts.join(' / ') : null;
  })();

  return (
    <div className="flex flex-col gap-2">
      <PlanFieldItem label="희망 직군 / 직무" value={jobRoleText || '미설정'} />
      <PlanFieldItem
        label="희망 산업"
        value={wishIndustry?.trim() || '미설정'}
      />
      <PlanFieldItem
        label="희망 기업"
        value={wishCompany?.trim() || '미설정'}
      />
    </div>
  );
};

interface PlanFieldItemProps {
  label: string;
  value: string;
}

const PlanFieldItem = ({ label, value }: PlanFieldItemProps) => {
  return (
    <>
      <div className="flex flex-col gap-1">
        <span className="font-regular text-xxsmall12 text-[#4138A3]">
          {label}
        </span>
        <span className="truncate text-sm text-neutral-0">{value}</span>
      </div>
      <div className="border-b border-[#EFEFEF]" />
    </>
  );
};
