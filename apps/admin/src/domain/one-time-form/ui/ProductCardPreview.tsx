import type { OneTimeFormSettingsValues } from '../types/oneTimeFormSettings';
import ProductThumbnail from './ProductThumbnail';

type ProductCardPreviewProps = Pick<
  OneTimeFormSettingsValues,
  | 'thumbnailUrl'
  | 'categoryText'
  | 'title'
  | 'scheduleText'
  | 'isPaid'
  | 'basePrice'
>;

/** 신청 화면 상단 상품 카드(시안 7절). 무료 폼은 금액을 보이지 않는다 */
const ProductCardPreview = ({
  thumbnailUrl,
  categoryText,
  title,
  scheduleText,
  isPaid,
  basePrice,
}: ProductCardPreviewProps) => {
  const meta = [
    scheduleText.trim(),
    isPaid ? `${basePrice.toLocaleString()}원부터` : '',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="bg-primary-5 flex gap-3.5 rounded-md p-4">
      <ProductThumbnail url={thumbnailUrl} className="h-16 w-16 rounded-sm" />
      <div className="min-w-0">
        {categoryText.trim() ? (
          <p className="text-xxsmall12 text-primary font-semibold">
            {categoryText}
          </p>
        ) : null}
        <p className="text-xsmall16 text-neutral-0 mt-0.5 break-words font-bold">
          {title.trim() || '폼 제목'}
        </p>
        {meta ? (
          <p className="text-xxsmall12 text-neutral-40 mt-1">{meta}</p>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCardPreview;
