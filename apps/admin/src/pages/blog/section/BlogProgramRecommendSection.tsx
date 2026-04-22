import { ProgramRecommendItem } from '@/api/blog/blogSchema';
import Heading2 from '@/domain/blog/ui/BlogHeading2';
import useProgramMenuItems from '@/hooks/useProgramMenuItems';
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ChangeEvent } from 'react';

interface BlogProgramRecommendSectionProps {
  programRecommend: ProgramRecommendItem[];
  onChangeProgramRecommend: (items: ProgramRecommendItem[]) => void;
}

const BlogProgramRecommendSection = ({
  programRecommend,
  onChangeProgramRecommend,
}: BlogProgramRecommendSectionProps) => {
  const programMenuItems = useProgramMenuItems();

  const handleChange = (
    e:
      | SelectChangeEvent<string | null>
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const list = [...programRecommend];
    const item = {
      ...list[index],
      [e.target.name]: e.target.value,
    };
    const notSelectProgram = e.target.value === 'null';

    // 프로그램이 '선택 안 함'이면 CTA 초기화
    if (e.target.name === 'id' && notSelectProgram) {
      item.id = null;
      delete item.ctaLink;
      delete item.ctaTitle;
    }

    onChangeProgramRecommend([
      ...list.slice(0, index),
      item,
      ...list.slice(index + 1),
    ]);
  };

  return (
    <div className="flex-1">
      <div className="mb-3 flex items-center gap-2">
        <Heading2>프로그램 추천</Heading2>
        <span className="text-xsmall14 text-neutral-40">
          *노출된 프로그램 중 모집중, 모집예정인 프로그램만 불러옵니다.
        </span>
      </div>
      <div className="flex flex-col gap-5">
        {programRecommend.map((item, index) => (
          <div key={index} className="flex flex-col gap-3">
            <FormControl size="small">
              <InputLabel>프로그램 선택</InputLabel>
              <Select
                name="id"
                value={item.id ?? 'null'}
                fullWidth
                size="small"
                label="프로그램 선택"
                onChange={(e) => handleChange(e, index)}
              >
                {programMenuItems}
              </Select>
            </FormControl>
            <TextField
              size="small"
              value={item.ctaTitle ?? ''}
              label={'CTA 소제목' + (index + 1)}
              placeholder={'CTA 소제목' + (index + 1)}
              name="ctaTitle"
              fullWidth
              onChange={(e) => handleChange(e, index)}
            />
            {!item.id && (
              <TextField
                size="small"
                value={item.ctaLink ?? ''}
                label={'CTA 링크' + (index + 1)}
                placeholder={'CTA 링크' + (index + 1)}
                name="ctaLink"
                fullWidth
                onChange={(e) => handleChange(e, index)}
              />
            )}
          </div>
        ))}
        <span className="text-0.875 text-neutral-35">
          {
            "*CTA링크: 'latest:{text}'으로 설정하면, text를 제목에 포함하는 챌린지 상세페이지로 이동합니다. (예시) latest:인턴"
          }
        </span>
      </div>
    </div>
  );
};

export default BlogProgramRecommendSection;
