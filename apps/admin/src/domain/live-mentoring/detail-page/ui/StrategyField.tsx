import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';

import type {
  AdminLiveMentoringDetailPageUpdate,
  DetailPageStrategyPoint,
} from '@/api/live-mentoring/liveMentoringDetailPageSchema';

import ImageField from './ImageField';

type Strategy = AdminLiveMentoringDetailPageUpdate['strategy'];

const EMPTY_POINT: DetailPageStrategyPoint = {
  image: null,
  title: '',
  description: '',
};

interface Props {
  value: Strategy;
  onChange: (next: Strategy) => void;
}

/** 취업 성공 전략 — 노출 토글과 Point. 제목·설명이 빈 Point 는 저장할 때 빠진다 */
export default function StrategyField({ value, onChange }: Props) {
  const setPoints = (points: DetailPageStrategyPoint[]) =>
    onChange({ ...value, points });

  const updatePoint = (
    index: number,
    patch: Partial<DetailPageStrategyPoint>,
  ) =>
    setPoints(
      value.points.map((point, i) =>
        i === index ? { ...point, ...patch } : point,
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
      <TextField
        size="small"
        label="섹션 설명"
        value={value.subtitle}
        onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
      />

      {value.points.map((point, index) => (
        <div
          key={index}
          className="border-neutral-80 flex flex-col gap-3 rounded border p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xsmall14 font-medium">Point {index + 1}</span>
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                setPoints(value.points.filter((_, i) => i !== index))
              }
            >
              삭제
            </Button>
          </div>
          <ImageField
            label={`Point ${index + 1} 이미지`}
            value={point.image}
            onChange={(image) => updatePoint(index, { image })}
          />
          <TextField
            size="small"
            label="Point 제목"
            value={point.title}
            inputProps={{ maxLength: 255 }}
            onChange={(e) => updatePoint(index, { title: e.target.value })}
          />
          <TextField
            size="small"
            multiline
            minRows={2}
            label="Point 설명"
            value={point.description}
            onChange={(e) =>
              updatePoint(index, { description: e.target.value })
            }
          />
        </div>
      ))}
      <Button
        variant="outlined"
        className="self-start"
        onClick={() => setPoints([...value.points, EMPTY_POINT])}
      >
        Point 추가 +
      </Button>
    </div>
  );
}
