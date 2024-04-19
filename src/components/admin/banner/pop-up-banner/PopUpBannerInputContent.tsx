import Input from '../../../ui/input/Input';
import DateTimePicker from '../../program/ui/form/DateTimePicker';
import ImageUploader from '../../program/ui/form/ImageUploader';

export interface PopUpBannerInputContentProps {
  value: {
    title: string;
    link: string;
    startDate: string;
    endDate: string;
    image: FileList | undefined;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PopUpBannerInputContent = ({
  value,
  onChange,
}: PopUpBannerInputContentProps) => {
  return (
    <>
      <Input
        label="제목"
        name="title"
        value={value.title}
        onChange={onChange}
      />
      <ImageUploader
        label="배너 이미지"
        imageFormat={{ width: 500, height: 230 }}
        onChange={onChange}
      />
      <Input label="링크" name="link" value={value.link} onChange={onChange} />
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

export default PopUpBannerInputContent;
