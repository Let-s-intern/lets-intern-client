import { twMerge } from '@/lib/twMerge';

interface ProductThumbnailProps {
  url: string | null;
  /** 크기와 라운드 */
  className: string;
}

/** 정사각형 썸네일. 가운데 기준으로 잘라 채우고, 없으면 기본 그라데이션을 보인다 */
const ProductThumbnail = ({ url, className }: ProductThumbnailProps) =>
  url ? (
    <img
      src={url}
      alt="썸네일"
      className={twMerge('flex-none object-cover', className)}
    />
  ) : (
    <div
      aria-label="기본 썸네일"
      className={twMerge('bg-gradient-start flex-none', className)}
    />
  );

export default ProductThumbnail;
