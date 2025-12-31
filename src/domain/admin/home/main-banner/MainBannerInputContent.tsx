import { BannerItemType, bannerType } from '@/api/banner';
import CheckBox from '@/common/ui/CheckBox';
import Input from '../../../../common/input/Input';
import DateTimePicker from '../../program/ui/form/DateTimePicker';
import ImageUpload from '../../program/ui/form/ImageUpload';

interface MainBannerInputContentProps {
  value: BannerItemType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (types: bannerType) => void;
}

const MainBannerInputContent = ({
  value,
  onChange,
  onTypeChange,
}: MainBannerInputContentProps) => {
  const options = [
    { value: 'MAIN', label: '홈 상단' },
    { value: 'MAIN_BOTTOM', label: '홈 하단' },
    { value: 'PROGRAM', label: '프로그램 페이지' },
    { value: 'MYPAGE', label: '마이페이지' },
  ];

  return (
    <>
      <Input
        label="제목"
        name="title"
        value={value.title || ''}
        onChange={onChange}
        placeholder="관리자 확인용 배너 제목을 입력해 주세요."
      />
      <Input
        label="랜딩 URL"
        name="link"
        value={value.link || undefined}
        onChange={onChange}
        placeholder="배너 클릭 시 이동할 랜딩 URL을 입력해 주세요."
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
      {/* 노출 위치 */}
      <fieldset className="flex items-center gap-6">
        {options.map((option) => {
          const currentTypes = Array.isArray(value.type) ? value.type : [];

          const isSelected = currentTypes.includes(option.value as bannerType);

          return (
            <div
              key={option.value}
              className="flex items-center gap-2 text-xs text-neutral-20"
            >
              <CheckBox
                checked={isSelected}
                width="16"
                onClick={() => onTypeChange(option.value as bannerType)}
              />
              {option.label}
            </div>
          );
        })}
      </fieldset>

      <fieldset className="grid grid-cols-2 gap-4">
        <ImageUpload
          label="홈 배너 (PC)"
          id="file"
          name="file"
          image={value.imgUrl || undefined}
          onChange={onChange}
        />
        <ImageUpload
          label="홈 배너 (모바일)"
          id="mobileFile"
          name="mobileFile"
          image={value.mobileImgUrl || undefined}
          onChange={onChange}
        />
        <ImageUpload
          label="프로그램 배너 (PC)"
          id="programFile"
          name="programFile"
          image={value.programImgUrl || undefined}
          onChange={onChange}
        />
        <ImageUpload
          label="프로그램 배너 (모바일)"
          id="programMobileFile"
          name="programMobileFile"
          image={value.programMobileImgUrl || undefined}
          onChange={onChange}
        />
      </fieldset>

      <div className="text-sm">
        <p>※ 마이페이지 배너는 별도 이미지를 사용하지 않습니다.</p>
        <p>- 마이페이지 PC: 프로그램 배너 (모바일) 이미지가 노출됩니다.</p>
        <p>- 마이페이지 모바일: 홈 배너 (모바일) 이미지가 노출됩니다.</p>
      </div>
    </>
  );
};

export default MainBannerInputContent;
