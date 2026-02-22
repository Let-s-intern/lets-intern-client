import Heading2 from '@/domain/blog/ui/BlogHeading2';
import useBlogMenuItems from '@/hooks/useBlogMenuItems';
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface BlogRecommendSectionProps {
  blogRecommend: (number | null)[];
  onChangeBlogRecommend: (items: (number | null)[]) => void;
}

const BlogRecommendSection = ({
  blogRecommend,
  onChangeBlogRecommend,
}: BlogRecommendSectionProps) => {
  const blogMenuItems = useBlogMenuItems();

  const handleChange = (
    e: SelectChangeEvent<number | 'null'>,
    index: number,
  ) => {
    const list = [...blogRecommend];
    list[index] = Number(e.target.value);
    onChangeBlogRecommend(list);
  };

  return (
    <div className="flex-1">
      <Heading2 className="mb-3">블로그 추천</Heading2>
      <div className="flex flex-col gap-3">
        {blogRecommend.map((id, index) => (
          <FormControl key={index} size="small">
            <InputLabel>블로그 ID {index + 1}</InputLabel>
            <Select
              value={id ?? 'null'}
              fullWidth
              size="small"
              label={'블로그 ID' + (index + 1)}
              onChange={(e) => handleChange(e, index)}
            >
              {blogMenuItems}
            </Select>
          </FormControl>
        ))}
      </div>
    </div>
  );
};

export default BlogRecommendSection;
