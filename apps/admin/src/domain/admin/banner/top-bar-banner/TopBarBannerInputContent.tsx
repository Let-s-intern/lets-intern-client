import { BannerItemType } from '@/api/banner';
import Input from '@/common/input/v1/Input';
import { useState } from 'react';
import ColorPicker from '../../program/ui/form/ColorPicker';
import DateTimePicker from '../../program/ui/form/DateTimePicker';
import ImageUpload from '../../program/ui/form/ImageUpload';

interface TopBarBannerInputContentProps {
  value: BannerItemType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 넘기지 않으면 이미지 영역을 그리지 않는다. 라우터에 연결되지 않은 복본 페이지가 이 경우다 */
  onImageChange?: (image: Partial<BannerItemType>) => void;
}

const TopBarBannerInputContent = ({
  value,
  onChange,
  onImageChange,
}: TopBarBannerInputContentProps) => {
  // ImageUpload 는 미리보기를 자체 상태로 들고 있어, 삭제할 때 다시 마운트해 비운다
  const [imageResetKey, setImageResetKey] = useState(0);

  const deleteImage = (image: Partial<BannerItemType>) => {
    onImageChange?.(image);
    setImageResetKey((key) => key + 1);
  };

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
      {onImageChange && (
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-1-medium">띠 배너 아래 이미지 (선택)</h3>
            <p className="text-0.875 text-neutral-40">
              PC와 모바일을 따로 올립니다. jpg, png, webp 모두 되고, webp를
              권장합니다. 파일당 1MB 이하로 올려 주세요. 한쪽만 올리면 그
              화면에서만 보입니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <ImageUpload
                key={`desktop-${imageResetKey}`}
                label="PC 이미지"
                id="file"
                name="file"
                image={value.imgUrl}
                imageFormat={{ width: 3840, height: 960 }}
                onChange={(e) =>
                  onImageChange({
                    file: e.target.files?.[0] ?? null,
                    deleteImage: false,
                  })
                }
              />
              {(value.imgUrl || value.file) && (
                <button
                  type="button"
                  className="text-0.875 text-neutral-40 self-end underline"
                  onClick={() =>
                    deleteImage({ file: null, imgUrl: null, deleteImage: true })
                  }
                >
                  PC 이미지 삭제
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <ImageUpload
                key={`mobile-${imageResetKey}`}
                label="모바일 이미지"
                id="mobileFile"
                name="mobileFile"
                image={value.mobileImgUrl}
                imageFormat={{ width: 1536, height: 768 }}
                onChange={(e) =>
                  onImageChange({
                    mobileFile: e.target.files?.[0] ?? null,
                    deleteMobileImage: false,
                  })
                }
              />
              {(value.mobileImgUrl || value.mobileFile) && (
                <button
                  type="button"
                  className="text-0.875 text-neutral-40 self-end underline"
                  onClick={() =>
                    deleteImage({
                      mobileFile: null,
                      mobileImgUrl: null,
                      deleteMobileImage: true,
                    })
                  }
                >
                  모바일 이미지 삭제
                </button>
              )}
            </div>
          </div>
          {/* 이미지 링크에 UTM 을 붙여 두면 어떤 배너로 들어왔는지 추적할 수 있다 */}
          <Input
            label="이미지 클릭 시 이동할 링크"
            name="imageLink"
            value={value.imageLink || ''}
            onChange={onChange}
          />
          <p className="text-0.875 text-neutral-40">
            비워 두면 위의 띠 배너 링크로 이동합니다. UTM을 붙이면 유입 추적에
            좋습니다. 예시
            /letscon?utm_source=letscareer&utm_medium=home_banner&utm_campaign=letscon
          </p>
        </div>
      )}
    </>
  );
};

export default TopBarBannerInputContent;
