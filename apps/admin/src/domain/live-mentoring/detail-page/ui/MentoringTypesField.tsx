import { Button, TextField } from '@mui/material';

import type {
  AdminLiveMentoringDetailPageUpdate,
  DetailPageMentoringType,
} from '@/api/live-mentoring/liveMentoringDetailPageSchema';

type MentoringTypes = AdminLiveMentoringDetailPageUpdate['mentoringTypes'];

const EMPTY_ITEM: DetailPageMentoringType = {
  typeName: '',
  title: '',
  description: '',
  tags: [],
};

interface Props {
  value: MentoringTypes;
  onChange: (next: MentoringTypes) => void;
}

/** 멘토링 유형 — 섹션 제목·부제와 유형 카드. 반쯤 채운 카드는 저장할 때 빠진다 */
export default function MentoringTypesField({ value, onChange }: Props) {
  const setItems = (items: DetailPageMentoringType[]) =>
    onChange({ ...value, items });

  const updateItem = (index: number, patch: Partial<DetailPageMentoringType>) =>
    setItems(
      value.items.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    );

  return (
    <div className="flex flex-col gap-3">
      <TextField
        size="small"
        label="섹션 제목"
        value={value.title}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
      />
      <TextField
        size="small"
        label="섹션 설명"
        value={value.subtitle}
        onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
      />

      {value.items.map((item, index) => (
        <div
          key={index}
          className="border-neutral-80 flex flex-col gap-3 rounded border p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xsmall14 font-medium">유형 {index + 1}</span>
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                setItems(value.items.filter((_, i) => i !== index))
              }
            >
              삭제
            </Button>
          </div>
          <TextField
            size="small"
            label="유형 이름"
            value={item.typeName}
            inputProps={{ maxLength: 100 }}
            onChange={(e) => updateItem(index, { typeName: e.target.value })}
          />
          <TextField
            size="small"
            label="유형 제목"
            value={item.title}
            onChange={(e) => updateItem(index, { title: e.target.value })}
          />
          <TextField
            size="small"
            multiline
            minRows={2}
            label="부가 설명"
            value={item.description}
            onChange={(e) => updateItem(index, { description: e.target.value })}
          />
          <TextField
            size="small"
            label="관련 태그 (쉼표로 구분)"
            value={item.tags.join(',')}
            onChange={(e) =>
              updateItem(index, { tags: e.target.value.split(',') })
            }
          />
        </div>
      ))}
      <Button
        variant="outlined"
        className="self-start"
        onClick={() => setItems([...value.items, EMPTY_ITEM])}
      >
        유형 추가 +
      </Button>
    </div>
  );
}
