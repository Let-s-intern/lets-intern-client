import { fileType, uploadFile } from '@/api/file';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import type { CreateGuidebookReq } from '@/schema';
import type React from 'react';

interface GuidebookThumbnailSectionProps {
  input: CreateGuidebookReq;
  setInput: React.Dispatch<React.SetStateAction<CreateGuidebookReq>>;
}

const GuidebookThumbnailSection: React.FC<GuidebookThumbnailSectionProps> = ({
  input,
  setInput,
}) => {
  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const url = await uploadFile({
      file: e.target.files[0],
      type: fileType.enum.LIVE, // TODO: 백엔드 타입 추가 후 수정 예정
    });

    setInput((prev) => ({
      ...prev,
      [e.target.name]: url,
    }));
  };

  return (
    <>
      <div className="flex gap-3">
        <ImageUpload
          label="모바일 썸네일 이미지 업로드"
          id="thumbnail"
          name="thumbnail"
          image={input.thumbnail}
          onChange={onChangeImage}
        />
        <ImageUpload
          label="데스크탑 썸네일 이미지 업로드"
          id="desktopThumbnail"
          name="desktopThumbnail"
          image={input.desktopThumbnail}
          onChange={onChangeImage}
        />
      </div>
    </>
  );
};

export default GuidebookThumbnailSection;
