import { useGetFaq } from '@/api/faq';
import { ChallengeContent } from '@/types/interface';
import { Heading2 } from '@components/admin/ui/heading/Heading2';
import Input from '@components/ui/input/Input';

interface ChallengeFaqCategoryProps {
  faqCategory: ChallengeContent['faqCategory'];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ChallengeFaqCategory({
  faqCategory,
  onChange,
}: ChallengeFaqCategoryProps) {
  const { data } = useGetFaq('CHALLENGE');

  const categoryList = [...new Set(data?.faqList.map((faq) => faq.category))];

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
          faqCategory
            ? faqCategory.join(', ')
            : categoryList
              ? categoryList.join(', ')
              : ''
        }
        onChange={onChange}
      />
    </>
  );
}

export default ChallengeFaqCategory;
