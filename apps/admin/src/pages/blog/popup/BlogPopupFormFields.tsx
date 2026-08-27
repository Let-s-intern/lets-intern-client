import { fileType, uploadFile } from '@/api/file';
import { YYYY_MMDD_THHmmss } from '@/data/dayjsFormat';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import dayjs from '@/lib/dayjs';
import type { Dayjs } from 'dayjs';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import BlogPopupPreview, { BlogPopupImageNotice } from './BlogPopupPreview';
import { BlogPopupFormValue } from './blogPopupForm';
import BlogTargetSelector from './BlogTargetSelector';

interface BlogPopupFormFieldsProps {
  value: BlogPopupFormValue;
  onChange: (patch: Partial<BlogPopupFormValue>) => void;
}

/** 등록과 수정이 같은 필드를 쓴다. 한쪽만 고쳐 두 화면이 어긋나는 것을 막는다. */
export default function BlogPopupFormFields({
  value,
  onChange,
}: BlogPopupFormFieldsProps) {
  /**
   * DateTimePicker 는 구획을 하나 채울 때마다 아직 완성되지 않은 값으로도 onChange 를 부른다.
   * 그때마다 폼 상태를 건드리면 value 가 다시 내려가 입력 중인 구획이 초기화된다.
   * 완성된 날짜와 비우기(null)만 받는다.
   */
  const handleDateChange = (
    key: 'startDate' | 'endDate',
    date: Dayjs | null,
  ) => {
    if (date && !date.isValid()) return;
    onChange({ [key]: date ? date.format(YYYY_MMDD_THHmmss) : '' });
  };

  return (
    <>
      <div className="mb-5 flex gap-3">
        <TextField
          className="w-full"
          variant="outlined"
          name="title"
          required
          label="제목"
          placeholder="어드민 식별용 제목을 입력하세요"
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <TextField
          className="w-full"
          variant="outlined"
          name="link"
          required
          label="링크"
          placeholder="링크를 입력하세요"
          value={value.link}
          onChange={(e) => onChange({ link: e.target.value })}
        />
      </div>

      <ImageUpload
        label="팝업 이미지 업로드"
        id="imageUrl"
        name="imageUrl"
        image={value.imageUrl || undefined}
        onChange={async (e) => {
          if (!e.target.files) return;

          const imgUrl = await uploadFile({
            file: e.target.files[0],
            type: fileType.enum.BLOG_BANNER,
          });

          onChange({ imageUrl: imgUrl });
        }}
      />
      <BlogPopupImageNotice />

      <div className="my-5">
        <h2 className="mb-2 text-lg font-semibold">미리보기</h2>
        <BlogPopupPreview imageUrl={value.imageUrl} />
      </div>

      <div className="my-5">
        <h2 className="mb-2 text-lg font-semibold">노출 대상</h2>
        <BlogTargetSelector
          targetType={value.targetType}
          blogIds={value.blogIds}
          onTargetTypeChange={(targetType) => onChange({ targetType })}
          onBlogIdsChange={(blogIds) => onChange({ blogIds })}
        />
      </div>

      <div className="my-5 flex items-center gap-3">
        <TextField
          className="w-full"
          variant="outlined"
          name="triggerRatio"
          type="number"
          label="트리거 비율"
          helperText="본문 읽기 진행률이 이 값에 도달하면 팝업이 열린다. 0 ~ 1"
          inputProps={{ step: 0.1, min: 0, max: 1 }}
          value={value.triggerRatio}
          onChange={(e) => onChange({ triggerRatio: Number(e.target.value) })}
        />
        <FormControlLabel
          className="w-full"
          control={
            <Checkbox
              checked={value.isVisible}
              onChange={(e) => onChange({ isVisible: e.target.checked })}
            />
          }
          label="노출 여부"
        />
      </div>

      <div className="my-5 flex gap-3">
        <DateTimePicker
          className="w-full"
          label="시작 일자"
          name="startDate"
          value={value.startDate ? dayjs(value.startDate) : null}
          onChange={(date) => handleDateChange('startDate', date)}
        />
        <DateTimePicker
          className="w-full"
          label="종료 일자"
          name="endDate"
          value={value.endDate ? dayjs(value.endDate) : null}
          onChange={(date) => handleDateChange('endDate', date)}
        />
      </div>
    </>
  );
}
