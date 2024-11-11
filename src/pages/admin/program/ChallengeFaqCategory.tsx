import { useEffect } from 'react';

import { useGetFaq } from '@/api/faq';
import { ChallengeContent } from '@/types/interface';
import { Heading2 } from '@components/admin/ui/heading/Heading2';
import Input from '@components/ui/input/Input';

interface ChallengeFaqCategoryProps {
  faqCategory: ChallengeContent['faqCategory'];
  setContent: React.Dispatch<React.SetStateAction<ChallengeContent>>;
}

function ChallengeFaqCategory({
  faqCategory,
  setContent,
}: ChallengeFaqCategoryProps) {
  const { data } = useGetFaq('CHALLENGE');

  const categoryList = [...new Set(data?.faqList.map((faq) => faq.category))];

  useEffect(() => {
    if (!data || (faqCategory && faqCategory.length > 0)) return;

    // [Default] 입력값이 없으면 모든 카테고리를 포함하도록 초기화
    setContent((prev) => ({
      ...prev,
      faqCategory: categoryList as string[],
    }));
  }, [data, faqCategory, categoryList]);

  return (
    <>
      <Heading2 className="mb-3">FAQ 카테고리 순서</Heading2>
      <Input
        label="FAQ 카테고리"
        type="text"
        name="faqCategory"
        placeholder="카테고리를 순서대로 입력해주세요 (예: 참여 중, 참여 전, 미션)"
        size="small"
        defaultValue={
          faqCategory && faqCategory.length > 0
            ? faqCategory.join(', ')
            : categoryList && categoryList.length > 0
              ? categoryList.join(', ')
              : undefined
        }
        onChange={(e) => {
          setContent((prev) => ({
            ...prev,
            faqCategory: e.target.value.split(',').map((item) => item.trim()),
          }));
        }}
      />
    </>
  );
}

export default ChallengeFaqCategory;
