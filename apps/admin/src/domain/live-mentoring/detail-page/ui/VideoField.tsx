import { Checkbox, FormControlLabel, TextField } from '@mui/material';

import type { AdminLiveMentoringDetailPageUpdate } from '@/api/live-mentoring/liveMentoringDetailPageSchema';

import { toYoutubeEmbedUrl } from '../utils/toDetailPageUpdatePayload';

type Video = AdminLiveMentoringDetailPageUpdate['video'];

interface Props {
  value: Video;
  onChange: (next: Video) => void;
}

/** 소개 영상 — 노출 토글과 YouTube 주소. 일반 주소는 저장할 때 embed 로 바뀐다 */
export default function VideoField({ value, onChange }: Props) {
  const videoUrl = value.videoUrl ?? '';
  const isInvalidUrl = videoUrl.trim() !== '' && !toYoutubeEmbedUrl(videoUrl);

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
      <TextField
        size="small"
        label="YouTube 주소"
        placeholder="https://www.youtube.com/watch?v=..."
        value={videoUrl}
        error={isInvalidUrl}
        helperText={
          isInvalidUrl
            ? 'YouTube 주소만 넣을 수 있습니다.'
            : '공유 링크를 붙여 넣으면 저장할 때 embed 주소로 바뀝니다.'
        }
        onChange={(e) =>
          onChange({ ...value, videoUrl: e.target.value || null })
        }
      />
      <TextField
        size="small"
        label="영상 안내 문구"
        value={value.caption}
        onChange={(e) => onChange({ ...value, caption: e.target.value })}
      />
    </div>
  );
}
