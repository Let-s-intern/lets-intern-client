import Input from '@components/ui/input/Input';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';

interface MoreButtonSectionProps {
  defaultChecked?: boolean;
  defaultUrl?: string;
  onChangeUrl?: (url: string) => void;
  onChangeCheckbox?: (value: boolean) => void;
}

function MoreButtonSection({
  onChangeUrl,
  onChangeCheckbox,
  defaultChecked = false,
  defaultUrl,
}: MoreButtonSectionProps) {
  const [showMoreButton, setShowMoreButton] = useState(defaultChecked);
  const [url, setUrl] = useState(defaultUrl);

  const handleChangeCheckbox = () => {
    setShowMoreButton(!showMoreButton);
    onChangeCheckbox?.(!showMoreButton);
  };

  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    onChangeUrl?.(value);
  };

  useEffect(() => {
    // init value
    setShowMoreButton(defaultChecked);
    setUrl(defaultUrl);
  }, [defaultChecked, defaultUrl]);

  return (
    <div>
      <FormControlLabel
        control={<Checkbox checked={showMoreButton} />}
        label="더보기 버튼 노출 여부"
        onChange={handleChangeCheckbox}
      />
      <Input
        label="더보기 URL"
        type="text"
        name="url"
        placeholder="더보기 버튼 URL을 입력하세요"
        size="small"
        disabled={!showMoreButton}
        value={url}
        onChange={handleChangeUrl}
      />
    </div>
  );
}

export default MoreButtonSection;
