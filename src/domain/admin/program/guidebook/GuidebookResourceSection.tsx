import Input from '@/common/input/v1/Input';
import type { CreateGuidebookReq } from '@/schema';
import { Checkbox, FormControlLabel } from '@mui/material';
import type React from 'react';
import { useCallback } from 'react';

interface GuidebookResourceSectionProps {
  input: CreateGuidebookReq;
  setInput: React.Dispatch<React.SetStateAction<CreateGuidebookReq>>;
  source: 'url' | 'file';
  onChangeSource: (source: 'url' | 'file') => void;
}

const GuidebookResourceSection: React.FC<GuidebookResourceSectionProps> = ({
  input,
  setInput,
  source,
  onChangeSource,
}) => {
  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [setInput],
  );

  const handleSourceChange = useCallback(
    (nextSource: 'url' | 'file') => () => {
      onChangeSource(nextSource);
      setInput((prev) => ({
        ...prev,
        ...(nextSource === 'url'
          ? { contentFileUrl: undefined }
          : { contentUrl: undefined }),
      }));
    },
    [onChangeSource, setInput],
  );

  const isUrl = source === 'url';

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <FormControlLabel
            control={
              <Checkbox checked={isUrl} onChange={handleSourceChange('url')} />
            }
            label="URL 링크"
          />
          <Input
            label="URL을 추가해주세요."
            type="text"
            name="contentUrl"
            size="small"
            disabled={!isUrl}
            value={input.contentUrl ?? ''}
            onChange={onChangeText}
          />
        </div>

        <div className="flex flex-col gap-2">
          <FormControlLabel
            control={
              <Checkbox
                checked={!isUrl}
                onChange={handleSourceChange('file')}
              />
            }
            label="파일 첨부"
          />
          <Input
            label="파일을 추가해주세요."
            type="text"
            name="contentFileUrl"
            size="small"
            disabled={isUrl}
            value={input.contentFileUrl ?? ''}
            onChange={onChangeText}
            placeholder="(추후 업로드 컴포넌트로 교체 예정)"
          />
        </div>
      </div>
    </section>
  );
};

export default GuidebookResourceSection;
