import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';

import type {
  AdminLiveMentoringDetailPageUpdate,
  DetailPageResultCase,
} from '@/api/live-mentoring/liveMentoringDetailPageSchema';

import ImageField from './ImageField';

type Results = AdminLiveMentoringDetailPageUpdate['results'];

const EMPTY_CASE: DetailPageResultCase = {
  beforeImage: null,
  afterImage: null,
  beforeCaption: '',
  afterCaption: '',
};

interface Props {
  value: Results;
  onChange: (next: Results) => void;
}

/**
 * 결과 사례 — 노출 토글과 전후 사례. 전·후 문구가 다 찬 사례만 저장된다.
 * 섹션 설명 입력은 멘토 앱처럼 두지 않는다(서버가 제목을 설명으로도 쓴다).
 */
export default function ResultsField({ value, onChange }: Props) {
  const setCases = (cases: DetailPageResultCase[]) =>
    onChange({ ...value, cases });

  const updateCase = (index: number, patch: Partial<DetailPageResultCase>) =>
    setCases(
      value.cases.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    );

  return (
    <div className="flex flex-col gap-3">
      <FormControlLabel
        control={
          <Checkbox
            checked={value.visible}
            onChange={(e) => onChange({ ...value, visible: e.target.checked })}
          />
        }
        label="상세페이지에 표시"
      />
      <TextField
        size="small"
        label="섹션 제목"
        value={value.title}
        inputProps={{ maxLength: 255 }}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
      />

      {value.cases.map((item, index) => (
        <div
          key={index}
          className="border-neutral-80 flex flex-col gap-3 rounded border p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xsmall14 font-medium">사례 {index + 1}</span>
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                setCases(value.cases.filter((_, i) => i !== index))
              }
            >
              삭제
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <ImageField
                label={`사례 ${index + 1} 멘토링 전 이미지`}
                value={item.beforeImage}
                onChange={(beforeImage) => updateCase(index, { beforeImage })}
              />
              <TextField
                size="small"
                multiline
                minRows={2}
                label="멘토링 전 상황"
                value={item.beforeCaption}
                onChange={(e) =>
                  updateCase(index, { beforeCaption: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <ImageField
                label={`사례 ${index + 1} 멘토링 후 이미지`}
                value={item.afterImage}
                onChange={(afterImage) => updateCase(index, { afterImage })}
              />
              <TextField
                size="small"
                multiline
                minRows={2}
                label="멘토링 후 변화"
                value={item.afterCaption}
                onChange={(e) =>
                  updateCase(index, { afterCaption: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="outlined"
        className="self-start"
        onClick={() => setCases([...value.cases, EMPTY_CASE])}
      >
        사례 추가 +
      </Button>
    </div>
  );
}
