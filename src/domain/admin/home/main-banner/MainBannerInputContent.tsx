import { BannerItemType } from '@/api/banner';
import Input from '../../../../common/input/Input';
import DateTimePicker from '../../program/ui/form/DateTimePicker';
import ImageUpload from '../../program/ui/form/ImageUpload';

interface MainBannerInputContentProps {
  value: BannerItemType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MainBannerInputContent = ({
  value,
  onChange,
}: MainBannerInputContentProps) => {
  return (
    <>
      <Input
        label="제목"
        name="title"
        value={value.title || undefined}
        onChange={onChange}
      />
      <Input
        label="링크"
        name="link"
        value={value.link || undefined}
        onChange={onChange}
      />
      <ImageUpload
        label="데스크탑용 배너 이미지 업로드"
        id="file"
        name="file"
        image={value.imgUrl || undefined}
        onChange={onChange}
      />
      <ImageUpload
        label="모바일용 배너 이미지 업로드"
        id="mobileFile"
        name="mobileFile"
        image={value.mobileImgUrl || undefined}
        onChange={onChange}
      />
      <DateTimePicker
        label="시작 일자"
        id="startDate"
        name="startDate"
        value={value.startDate || undefined}
        onChange={onChange}
      />
      <DateTimePicker
        label="종료 일자"
        id="endDate"
        name="endDate"
        value={value.endDate || undefined}
        onChange={onChange}
      />
    </>
  );
};

export default MainBannerInputContent;
