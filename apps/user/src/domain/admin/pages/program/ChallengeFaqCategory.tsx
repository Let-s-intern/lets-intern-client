'use client';

import Input from '@/common/input/v1/Input';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { ChallengeContent } from '@/types/interface';

interface ChallengeFaqCategoryProps {
  faqCategory: ChallengeContent['faqCategory'];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ChallengeFaqCategory({
  faqCategory,
  onChange,
}: ChallengeFaqCategoryProps) {
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
            : undefined
        }
        onChange={onChange}
      />
    </>
  );
}

export default ChallengeFaqCategory;
