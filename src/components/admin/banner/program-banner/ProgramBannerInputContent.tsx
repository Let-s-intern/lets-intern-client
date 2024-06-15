import Input from '../../../ui/input/Input';
import ColorPicker from '../../program/ui/form/ColorPicker';
import DateTimePicker from '../../program/ui/form/DateTimePicker';
import ImageUploader from '../../program/ui/form/ImageUploader';

export interface ProgramBannerInputContentProps {
  value: {
    title: string;
    link: string;
    startDate: string;
    endDate: string;
    imgUrl: string;
    contents: string;
    colorCode: string;
    textColorCode: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProgramBannerInputContent = ({
  value,
  onChange,
}: ProgramBannerInputContentProps) => {
  return (
    <>
      <Input
        label="제목"
        name="title"
        value={value.title}
        onChange={onChange}
      />
      <Input label="링크" name="link" value={value.link} onChange={onChange} />
      <Input
        label="썸네일 링크"
        name="imgUrl"
        value={value.imgUrl}
        onChange={onChange}
      />
      <Input
        label="내용"
        name="contents"
        value={value.contents}
        onChange={onChange}
      />
      <ColorPicker
        label="배경 색상"
        id="colorCode"
        name="colorCode"
        value={value.colorCode}
        onChange={onChange}
      />
      <ColorPicker
        label="글자 색상"
        id="textColorCode"
        name="textColorCode"
        value={value.textColorCode}
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

export default ProgramBannerInputContent;
