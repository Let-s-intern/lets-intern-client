import { IBannerForm } from '../../../../types/interface';
import Input from '../../../ui/input/Input';
import DateTimePicker from '../../program/ui/form/DateTimePicker';
import ImageUpload from '../../program/ui/form/ImageUpload';

interface PopUpBannerInputContentProps {
  value: IBannerForm;
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
      <Input label="링크" name="link" value={value.link} onChange={onChange} />
      <ImageUpload
        label="팝업 이미지 업로드"
        id="file"
        name="file"
        image={value.imgUrl}
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

export default PopUpBannerInputContent;
