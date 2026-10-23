import { uploadFile } from '@/api/file';
import { twMerge } from '@/lib/twMerge';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

interface Props {
  value: string | null;
  onChange: (url: string) => void;
  /** 크기 등 오버라이드 (기본 aspect-[4/3] w-40) */
  className?: string;
  /** 업로드 문구·alt 라벨 (기본 '썸네일'). 예) '후기 이미지' */
  label?: string;
}

/**
 * 썸네일/이미지 업로드. 파일을 S3 로 업로드하고 반환된 URL 을 onChange 로 넘긴다.
 */
export default function ThumbnailUpload({
  value,
  onChange,
  className,
  label = '썸네일',
}: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadFile({ file, type: 'MEMBERSHIP' });
      onChange(url);
    } catch (err) {
      console.error(err);
      alert('썸네일 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <label
      className={twMerge(
        'border-neutral-80 bg-neutral-95 group relative flex aspect-[4/3] w-52 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border',
        isUploading && 'cursor-progress',
        className,
      )}
    >
      {isUploading ? (
        <span className="text-neutral-40 text-xxsmall12">업로드 중...</span>
      ) : value ? (
        <>
          <img
            src={value}
            alt={label}
            className="max-h-full max-w-full object-contain"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Pencil size={18} />
          </div>
        </>
      ) : (
        <div className="text-neutral-40 flex flex-col items-center gap-2">
          <FiUpload className="text-2xl" />
          <span className="text-xxsmall12">{label} 업로드</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={isUploading}
        onChange={handleChange}
      />
    </label>
  );
}
