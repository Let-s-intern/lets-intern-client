import { useRef, useState } from 'react';

interface ImageUploaderProps {
  label: string;
  id?: string;
  name?: string;
  imageFormat?: {
    width?: number;
    height?: number;
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploader = ({
  label,
  imageFormat,
  id,
  name,
  onChange,
}: ImageUploaderProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<string>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e);
    if (imageInputRef.current && imageInputRef.current.files) {
      const file = imageInputRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xxs bg-neutral-90 px-6 py-4">
      <div>
        <label htmlFor={id} className="text-1-medium block">
          {label}
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
      {imageFile && <img src={imageFile} alt="업로드 이미지" />}
      <input
        type="file"
        id={id}
        name={name}
        accept="image/*"
        className="text-0.875"
        onChange={handleChange}
        ref={imageInputRef}
      />
    </div>
  );
};

export default ImageUploader;
