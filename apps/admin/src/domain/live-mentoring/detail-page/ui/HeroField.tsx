import { Button, TextField } from '@mui/material';

import type { AdminLiveMentoringDetailPageUpdate } from '@/api/live-mentoring/liveMentoringDetailPageSchema';

type Hero = AdminLiveMentoringDetailPageUpdate['hero'];

interface Props {
  value: Hero;
  onChange: (next: Hero) => void;
}

/** 핵심 소개 — 상세페이지 제목 아래 불릿. 빈 줄은 저장할 때 빠진다 */
export default function HeroField({ value, onChange }: Props) {
  const setBullets = (bullets: string[]) => onChange({ bullets });

  return (
    <div className="flex flex-col gap-3">
      {value.bullets.map((bullet, index) => (
        <div key={index} className="flex items-start gap-2">
          <TextField
            fullWidth
            size="small"
            label={`소개 문구 ${index + 1}`}
            value={bullet}
            inputProps={{ maxLength: 500 }}
            onChange={(e) =>
              setBullets(
                value.bullets.map((v, i) => (i === index ? e.target.value : v)),
              )
            }
          />
          <Button
            color="inherit"
            onClick={() =>
              setBullets(value.bullets.filter((_, i) => i !== index))
            }
          >
            삭제
          </Button>
        </div>
      ))}
      <Button
        variant="outlined"
        className="self-start"
        onClick={() => setBullets([...value.bullets, ''])}
      >
        소개 문구 추가 +
      </Button>
    </div>
  );
}
