import { twMerge } from '@/lib/twMerge';
import { FiUpload } from 'react-icons/fi';

interface Props {
  value: string | null;
  onChange: (dataUrl: string) => void;
  /** 크기 등 오버라이드 (기본 aspect-[4/3] w-40) */
  className?: string;
}

/**
 * 썸네일 업로드. 백엔드 부재로 실제 업로드 대신 로컬 미리보기(data URL)를 넘긴다.
 * 스펙 준비 시 onChange 를 실제 업로드 URL 로 교체.
 */
export default function ThumbnailUpload({ value, onChange, className }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <label
      className={twMerge(
        'flex aspect-[4/3] w-40 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-neutral-80 bg-neutral-95',
        className,
      )}
    >
      {value ? (
        <img
          src={value}
          alt="썸네일"
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-neutral-40">
          <FiUpload className="text-2xl" />
          <span className="text-xxsmall12">썸네일 업로드</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </label>
  );
}
