import Input from '../../../ui/input/Input';
import ColorPicker from '../../program/ui/form/ColorPicker';
import DateTimePicker from '../../program/ui/form/DateTimePicker';

export interface TopBarBannerInputContentProps {
  value: {
    title: string;
    description: string;
    link: string;
    startDate: string;
    endDate: string;
    bgColorCode: string;
    textColorCode: string;
  };
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
        value={value.title}
        onChange={onChange}
      />
      <Input
        label="노출 문구"
        name="description"
        value={value.description}
        onChange={onChange}
      />
      <Input label="링크" name="link" value={value.link} onChange={onChange} />
      <ColorPicker
        label="텍스트 색상"
        id="textColorCode"
        name="textColorCode"
        value={value.textColorCode}
        onChange={onChange}
      />
      <ColorPicker
        label="배경 색상"
        id="bgColorCode"
        name="bgColorCode"
        value={value.bgColorCode}
        onChange={onChange}
      />
      <DateTimePicker
        label="시작 일자"
        id="startDate"
        name="startDate"
        value={value.startDate}
        onChange={onChange}
      />
      <DateTimePicker
        label="종료 일자"
        id="endDate"
        name="endDate"
        value={value.endDate}
        onChange={onChange}
      />
    </>
  );
};

export default TopBarBannerInputContent;
