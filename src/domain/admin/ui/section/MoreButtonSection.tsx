import Input from '@/common/input/Input';
import { Checkbox, FormControlLabel } from '@mui/material';

interface MoreButtonSectionProps {
  checked?: boolean;
  url?: string;
  onChangeUrl?: (url: string) => void;
  onChangeCheckbox?: (value: boolean) => void;
}

function MoreButtonSection({
  onChangeUrl,
  onChangeCheckbox,
  checked = false,
  url = '',
}: MoreButtonSectionProps) {
  const handleChangeCheckbox = (_: React.SyntheticEvent, value: boolean) => {
    onChangeCheckbox?.(value);
  };

  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeUrl?.(e.target.value);
  };

  return (
    <div>
      <FormControlLabel
        control={<Checkbox checked={checked} />}
        label="더보기 버튼 노출 여부"
        onChange={handleChangeCheckbox}
      />
      <Input
        label="더보기 URL"
        type="text"
        name="url"
        placeholder="더보기 버튼 URL을 입력하세요"
        size="small"
        disabled={!checked}
        value={url}
        onChange={handleChangeUrl}
      />
    </div>
  );
}

export default MoreButtonSection;
