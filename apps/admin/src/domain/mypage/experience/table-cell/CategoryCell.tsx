import {
  CategoryType,
  EXPERIENCE_CATEGORY_KR,
} from '@/api/experience/experienceSchema';

const CategoryCell = ({ value }: { value: string }) => {
  return (
    <span className="rounded-xxs bg-primary-5 text-primary px-2 py-1 text-xs font-normal">
      {EXPERIENCE_CATEGORY_KR[value as CategoryType]}
    </span>
  );
};

export default CategoryCell;
