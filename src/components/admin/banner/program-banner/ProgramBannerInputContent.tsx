import { BannerItemType } from '@/api/banner';
import Input from '../../../ui/input/Input';
import DateTimePicker from '../../program/ui/form/DateTimePicker';
import ImageUpload from '../../program/ui/form/ImageUpload';

interface ProgramBannerInputContentProps {
  value: BannerItemType;
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
      <ImageUpload
        label="데스크탑용 배너 이미지 업로드"
        id="file"
        name="file"
        image={value.imgUrl}
        onChange={onChange}
      />
      <ImageUpload
        label="모바일용 배너 이미지 업로드"
        id="mobileFile"
        name="mobileFile"
        image={value.mobileImgUrl}
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
