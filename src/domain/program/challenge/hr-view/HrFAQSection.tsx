'use client';

import { useGetChallengeFaq } from '@/api/challenge/challenge';
import ChallengeFaq from '@/domain/program/challenge/challenge-view/ChallengeFaq';
import { ChallengeIdPrimitive } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { useParams } from 'next/navigation';

interface Props {
  challenge: ChallengeIdPrimitive;
  content: ChallengeContent | null;
}

const HrFAQSection = ({ challenge, content }: Props) => {
  const { id } = useParams<{ id: string }>();
  const { data: faqData } = useGetChallengeFaq(id ?? '');

  // 빈 문자열이나 undefined를 필터링하여 빈 카테고리 버튼이 나타나지 않도록 함
  const faqCategory =
    content?.faqCategory?.filter(
      (category): category is string =>
        typeof category === 'string' && category.trim() !== '',
    ) ?? [];

  // faqData가 없어도 UI는 표시되도록 빈 객체 전달
  const safeFaqData = faqData ?? { faqList: [] };

  return (
    <div className="flex w-full flex-col items-center">
      <ChallengeFaq
        faqData={safeFaqData}
        faqCategory={faqCategory}
        challengeType={challenge.challengeType}
        headerColorOverride="#606060"
      />
    </div>
  );
};

export default HrFAQSection;
