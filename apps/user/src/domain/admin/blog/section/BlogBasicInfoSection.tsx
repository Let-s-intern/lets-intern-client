import { uploadFile } from '@/api/file';
import TextFieldLimit from '@/domain/admin/blog/TextFieldLimit';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { blogCategory } from '@/utils/convert';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { ChangeEvent } from 'react';

const MAX_TITLE_LENGTH = 49;
const MAX_DESCRIPTION_LENGTH = 100;

interface BlogBasicInfoSectionProps {
  category: string;
  title: string;
  description: string;
  thumbnail: string;
  onChangeCategory: (category: string) => void;
  onChangeField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeThumbnail: (url: string) => void;
}

const BlogBasicInfoSection = ({
  category,
  title,
  description,
  thumbnail,
  onChangeCategory,
  onChangeField,
  onChangeThumbnail,
}: BlogBasicInfoSectionProps) => {
  const { snackbar: setSnackbar } = useAdminSnackbar();

  const handleChangeThumbnail = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) {
      setSnackbar('파일이 없습니다.');
      return;
    }
    const url = await uploadFile({ file, type: 'BLOG' });
    onChangeThumbnail(url);
  };

  return (
    <>
      <div className="flex-no-wrap flex items-center gap-4">
        <FormControl size="small" required>
          <InputLabel id="category-label">카테고리</InputLabel>
          <Select
            className="w-60"
            id="category"
            size="small"
            label="카테고리"
            name="category"
            value={category}
            onChange={(e) => onChangeCategory(e.target.value)}
          >
            {Object.entries(blogCategory).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            카테고리는 하나만 설정할 수 있습니다.
          </FormHelperText>
        </FormControl>
      </div>

      <TextFieldLimit
        type="text"
        label="제목"
        placeholder="제목"
        name="title"
        required
        value={title}
        onChange={onChangeField}
        autoComplete="off"
        fullWidth
        maxLength={MAX_TITLE_LENGTH}
        autoFocus={true}
      />
      <TextFieldLimit
        type="text"
        label="메타 디스크립션"
        placeholder="설명"
        name="description"
        value={description}
        onChange={onChangeField}
        multiline
        minRows={3}
        autoComplete="off"
        fullWidth
        maxLength={MAX_DESCRIPTION_LENGTH}
      />

      <div className="flex gap-4">
        <div className="w-72">
          <ImageUpload
            label="블로그 썸네일"
            id="file"
            image={thumbnail}
            onChange={handleChangeThumbnail}
          />
        </div>
        {/* [삭제하지 마세요] CTA 임시로 사용 중지 */}
        {/* <div className="flex-1">
          <div className="mb-5">
            <TextField
              type="text"
              label="CTA 링크"
              placeholder="CTA 링크"
              size="small"
              name="ctaLink"
              value={editingValue.ctaLink}
              onChange={onChange}
              fullWidth
              autoComplete="off"
            />
            <span className="text-0.875 text-neutral-35">
              {
                '*latest:{text}으로 설정하면, 텍스트를 제목에 포함하는 챌린지 상세페이지로 이동합니다. (예시) latest:인턴'
              }
            </span>
          </div>
          <TextFieldLimit
            type="text"
            label="CTA 텍스트"
            placeholder="CTA 텍스트"
            size="small"
            name="ctaText"
            value={editingValue.ctaText}
            onChange={onChange}
            autoComplete="off"
            fullWidth
            maxLength={maxCtaTextLength}
          />
        </div> */}
      </div>
    </>
  );
};

export default BlogBasicInfoSection;
