import Heading2 from '@/domain/blog/ui/BlogHeading2';
import { FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import { ReactNode } from 'react';

interface BlogRecommendSectionProps {
  blogRecommend: (number | null)[];
  blogMenuItems: ReactNode;
  onChange: (e: SelectChangeEvent<number | 'null'>, index: number) => void;
}

const BlogRecommendSection = ({
  blogRecommend,
  blogMenuItems,
  onChange,
}: BlogRecommendSectionProps) => {
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
              onChange={(e) => onChange(e, index)}
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
