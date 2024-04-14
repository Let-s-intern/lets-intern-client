import Input from '../../../ui/input/Input';
import DateTimePicker from '../../program/ui/form/DateTimePicker';
import ImageUploader from '../../program/ui/form/ImageUploader';

const ProgramBannerInputContent = () => {
  return (
    <>
      <Input label="제목" name="title" />
      <ImageUploader
        label="배너 이미지"
        imageFormat={{ width: 500, height: 230 }}
      />
      <Input label="링크" name="link" />
      <DateTimePicker label="시작 일자" id="startDate" name="startDate" />
      <DateTimePicker label="종료 일자" id="endDate" name="endDate" />
    </>
  );
};

export default ProgramBannerInputContent;
