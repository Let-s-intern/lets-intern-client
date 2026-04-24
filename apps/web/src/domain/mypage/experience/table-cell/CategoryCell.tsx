import {
  CategoryType,
  EXPERIENCE_CATEGORY_KR,
} from '@/api/experience/experienceSchema';

const CategoryCell = ({ value }: { value: string }) => {
  return (
    <span className="rounded-xxs bg-primary-5 px-2 py-1 text-xs font-normal text-primary">
      {EXPERIENCE_CATEGORY_KR[value as CategoryType]}
    </span>
  );
};

export default CategoryCell;
