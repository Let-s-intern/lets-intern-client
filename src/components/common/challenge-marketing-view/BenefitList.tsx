import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import { ChallengeType, challengeTypeSchema } from '@/schema';

const { PERSONAL_STATEMENT } = challengeTypeSchema.enum;

interface Props {
  challengeType: ChallengeType;
}

function BenefitList({ challengeType }: Props) {
  const benefits = (() => {
    switch (challengeType) {
      // 자기소개서
      case PERSONAL_STATEMENT:
        return [
          `자기소개서 최다 빈출 문항 작성 가이드\n(무제한 업데이트)`,
          `기업별 합격 자기소개서 예시 및 패턴 분석`,
          `PDF 총 30페이지 분량 추가 자료`,
          `렛츠커리어 공식 커뮤니티 참여`,
        ];

      // 그 외
      default:
        return [
          `단계별 취업 준비 교육 자료 및 템플릿\n(무제한 업데이트)`,
          `마스터 이력서 작성 가이드`,
          `PDF 총 30페이지 분량 추가 자료`,
          `렛츠커리어 공식 커뮤니티 참여`,
        ];
    }
  })();

  return (
    <>
      <span className="text-xsmall14 font-semibold text-[#4A76FF]">
        이번 챌린지로 모든걸 얻어갈 수 있어요!
      </span>
      <div className="mt-1.5 flex flex-col gap-1.5">
        {benefits.map((item, index) => (
          <div key={`benefit-${index}`} className="flex gap-1 text-neutral-0">
            <ChevronDown className="-mt-0.5 h-5 w-5 shrink-0" />
            <p className="whitespace-pre-line text-nowrap text-xsmall14 font-medium">
              {item}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default BenefitList;
