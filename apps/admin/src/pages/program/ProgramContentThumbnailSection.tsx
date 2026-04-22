import { uploadFile, type FileType } from '@/api/file';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import type React from 'react';

import type { ContentProgramFormInput } from './programContentTypes';

interface ProgramContentThumbnailSectionProps {
  input: ContentProgramFormInput;
  setInput: React.Dispatch<React.SetStateAction<ContentProgramFormInput>>;
  uploadType: FileType;
}

const ProgramContentThumbnailSection: React.FC<
  ProgramContentThumbnailSectionProps
> = ({ input, setInput, uploadType }) => {
  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const url = await uploadFile({
      file: e.target.files[0],
      type: uploadType,
    });

    setInput((prev) => ({ ...prev, [e.target.name]: url }));
  };

  return (
    <div className="flex max-w-[1000px] gap-3">
      <div className="flex-1">
        <ImageUpload
          label="모바일 썸네일 이미지 업로드"
          id="thumbnail"
          name="thumbnail"
          image={input.thumbnail}
          onChange={onChangeImage}
        />
      </div>
      <div className="flex-1">
        <ImageUpload
          label="데스크탑 썸네일 이미지 업로드"
          id="desktopThumbnail"
          name="desktopThumbnail"
          image={input.desktopThumbnail}
          onChange={onChangeImage}
        />
      </div>
    </div>
  );
};

export default ProgramContentThumbnailSection;
