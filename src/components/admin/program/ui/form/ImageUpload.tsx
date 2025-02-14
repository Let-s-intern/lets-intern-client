import { useEffect, useRef, useState } from 'react';
import { FiUpload } from 'react-icons/fi';

interface ImageUploaderProps {
  label: string;
  id?: string;
  name?: string;
  image?: string;
  imageFormat?: {
    width?: number;
    height?: number;
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload = ({
  label,
  image,
  imageFormat,
  id,
  name,
  onChange,
}: ImageUploaderProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (imageInputRef.current && imageInputRef.current.files) {
      const file = imageInputRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
    }
  };

  const handleImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  useEffect(() => {
    if (!image) return;
    if (image === imageFile) return;
    setImageFile(image);
  }, [image, imageInputRef]);

  return (
    <div className="flex h-fit flex-col gap-4 rounded-xxs bg-neutral-90 px-6 py-4">
      <div>
        <label htmlFor={id} className="text-1-medium block">
          {label}{' '}
          <span className="text-sm font-normal">
            (사진을 눌러 이미지를 업로드하세요.)
          </span>
        </label>
        {imageFormat && (
          <span className="text-0.875 text-neutral-40">
            {imageFormat.width && imageFormat.height && (
              <>
                가로 {imageFormat.width} X 세로 {imageFormat.height} 사이즈의
              </>
            )}{' '}
            이미지 파일을 첨부해주세요.
          </span>
        )}
      </div>

      <div className="cursor-pointer" onClick={handleImageUpload}>
        {imageFile ? (
          <div className="flex cursor-pointer items-center justify-center">
            <img
              className="aspect-video h-auto w-full object-cover"
              src={imageFile}
              alt="업로드 이미지"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full cursor-pointer items-center justify-center bg-neutral-75">
            <span className="text-[2rem] text-neutral-40">
              <FiUpload />
            </span>
          </div>
        )}
      </div>

      <input
        type="file"
        id={id}
        name={name}
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        ref={imageInputRef}
      />
    </div>
  );
};

export default ImageUpload;
