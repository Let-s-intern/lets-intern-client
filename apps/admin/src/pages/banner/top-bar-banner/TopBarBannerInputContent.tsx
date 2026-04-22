import { BannerItemType } from '@/api/banner';
import Input from '../../../../common/input/v1/Input';
import ColorPicker from '../../program/ui/form/ColorPicker';
import DateTimePicker from '../../program/ui/form/DateTimePicker';

interface TopBarBannerInputContentProps {
  value: BannerItemType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TopBarBannerInputContent = ({
  value,
  onChange,
}: TopBarBannerInputContentProps) => {
  return (
    <>
      <Input
        label="제목"
        name="title"
        value={value.title || ''}
        onChange={onChange}
      />
      <Input
        label="링크"
        name="link"
        value={value.link || ''}
        onChange={onChange}
      />
      <Input
        label="내용"
        name="contents"
        value={value.contents || ''}
        onChange={onChange}
      />
      <ColorPicker
        label="배경 색상"
        id="colorCode"
        name="colorCode"
        value={value.colorCode || ''}
        onChange={onChange}
      />
      <ColorPicker
        label="글자 색상"
        id="textColorCode"
        name="textColorCode"
        value={value.textColorCode || ''}
        onChange={onChange}
      />
      <DateTimePicker
        label="시작 일자"
        id="startDate"
        name="startDate"
        value={value.startDate || ''}
        onChange={onChange}
      />
      <DateTimePicker
        label="종료 일자"
        id="endDate"
        name="endDate"
        value={value.endDate || ''}
        onChange={onChange}
      />
    </>
  );
};

export default TopBarBannerInputContent;
