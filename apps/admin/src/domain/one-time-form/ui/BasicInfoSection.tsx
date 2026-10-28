import {
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
} from '@mui/material';

import type { SetOneTimeFormSettingsField } from '../hooks/useOneTimeFormSettings';
import type {
  OneTimeFormSettingsErrors,
  OneTimeFormSettingsValues,
} from '../types/oneTimeFormSettings';
import SettingsDateTimeField from './SettingsDateTimeField';
import ThumbnailField from './ThumbnailField';

interface BasicInfoSectionProps {
  values: OneTimeFormSettingsValues;
  errors: OneTimeFormSettingsErrors;
  setField: SetOneTimeFormSettingsField;
  /** 공개 중이거나 신청이 있으면 서버가 slug 변경을 거절한다 */
  isSlugLocked: boolean;
  isUploadingThumbnail: boolean;
  onUploadThumbnail: (file: File) => void;
}

const SLUG_LOCKED_HELPER =
  '공개 중이거나 신청이 있는 폼은 주소를 바꿀 수 없습니다. 비공개로 저장하고 신청이 없을 때만 바꿀 수 있습니다.';

const BasicInfoSection = ({
  values,
  errors,
  setField,
  isSlugLocked,
  isUploadingThumbnail,
  onUploadThumbnail,
}: BasicInfoSectionProps) => (
  <section className="flex flex-col gap-5">
    <div>
      <h3 className="text-small18 text-neutral-0 font-bold">기본 정보</h3>
      <p className="text-xxsmall12 text-neutral-40 mt-1">/form/{values.slug}</p>
    </div>

    <div className="flex gap-3">
      <TextField
        className="flex-[2]"
        label="폼 제목"
        required
        value={values.title}
        onChange={(e) => setField('title', e.target.value)}
        error={!!errors.title}
        helperText={errors.title}
      />
      <TextField
        className="flex-1"
        label="분류 문구"
        placeholder="일회성 클래스"
        value={values.categoryText}
        onChange={(e) => setField('categoryText', e.target.value)}
        error={!!errors.categoryText}
        helperText={errors.categoryText}
      />
      <TextField
        className="flex-1"
        label="일정·부가 문구"
        placeholder="11.15(토) 14:00"
        value={values.scheduleText}
        onChange={(e) => setField('scheduleText', e.target.value)}
        error={!!errors.scheduleText}
        helperText={errors.scheduleText}
      />
    </div>

    <TextField
      label="주소(slug)"
      required
      value={values.slug}
      disabled={isSlugLocked}
      onChange={(e) => setField('slug', e.target.value)}
      error={!!errors.slug}
      helperText={
        errors.slug ??
        (isSlugLocked
          ? SLUG_LOCKED_HELPER
          : '영문 소문자, 숫자, 하이픈(-) 3~50자. 공개하거나 신청이 생기면 바꿀 수 없습니다.')
      }
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">/form/</InputAdornment>
          ),
        },
      }}
    />

    <ThumbnailField
      url={values.thumbnailUrl}
      error={errors.thumbnailUrl}
      isUploading={isUploadingThumbnail}
      onUpload={onUploadThumbnail}
      onDelete={() => setField('thumbnailUrl', null)}
    />

    <div className="flex gap-3">
      <SettingsDateTimeField
        label="신청 시작 일시"
        value={values.startDate}
        onChange={(value) => setField('startDate', value)}
        error={errors.startDate}
      />
      <SettingsDateTimeField
        label="신청 마감 일시"
        value={values.endDate}
        onChange={(value) => setField('endDate', value)}
        error={errors.endDate}
      />
      <SettingsDateTimeField
        label="취소 마감 일시"
        value={values.cancelDeadline}
        onChange={(value) => setField('cancelDeadline', value)}
        error={errors.cancelDeadline}
        helperText="비우면 신청 마감까지 취소할 수 있습니다."
        clearable
      />
    </div>

    <TextField
      label="완료 안내 문구"
      multiline
      minRows={3}
      placeholder="신청 완료 화면에 보일 안내를 입력하세요."
      value={values.completionMessage}
      onChange={(e) => setField('completionMessage', e.target.value)}
      error={!!errors.completionMessage}
      helperText={errors.completionMessage}
    />

    <FormControlLabel
      label="신청 페이지 공개"
      control={
        <Switch
          checked={values.isVisible}
          onChange={(e) => setField('isVisible', e.target.checked)}
        />
      }
    />
  </section>
);

export default BasicInfoSection;
