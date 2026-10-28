import type { OneTimeFormInfo } from '@/api/one-time-form/oneTimeFormSchema';

interface ProductCardProps {
  form: Pick<
    OneTimeFormInfo,
    | 'title'
    | 'categoryText'
    | 'scheduleText'
    | 'thumbnailUrl'
    | 'isPaid'
    | 'basePrice'
  >;
}

/** 폼 상단 상품 요약. 유료면 일정 뒤에 "N원부터"를 붙인다 */
const ProductCard = ({ form }: ProductCardProps) => {
  const meta = form.isPaid
    ? `${form.scheduleText} · ${form.basePrice.toLocaleString('ko-KR')}원부터`
    : form.scheduleText;

  return (
    <section className="bg-primary-5 flex gap-3.5 rounded-md p-4">
      {form.thumbnailUrl ? (
        // 썸네일 호스트가 S3 이므로 next/image 원격 설정 없이 img 를 쓴다
        <img
          src={form.thumbnailUrl}
          alt={form.title}
          className="h-16 w-16 flex-none rounded-sm object-cover"
        />
      ) : (
        <div
          data-testid="product-thumbnail-placeholder"
          aria-hidden
          className="bg-gradient-start h-16 w-16 flex-none rounded-sm"
        />
      )}
      <div className="min-w-0">
        <p className="text-xxsmall12 text-primary font-semibold">
          {form.categoryText}
        </p>
        <h2 className="text-xsmall16 mt-0.5 font-bold">{form.title}</h2>
        <p className="text-xxsmall12 text-neutral-40 mt-1">{meta}</p>
      </div>
    </section>
  );
};

export default ProductCard;
