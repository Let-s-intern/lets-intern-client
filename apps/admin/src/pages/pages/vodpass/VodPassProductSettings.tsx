import { ApiError } from '@letscareer/api';
import { useState } from 'react';

import {
  useUpdateVodPassProductMutation,
  useVodPassProductQuery,
  VOD_PASS_PRODUCT_NOT_FOUND,
  type VodPassProduct,
} from '@/api/vodPassProduct';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

const LABEL_CLASS = 'text-xsmall14 font-medium';
const INPUT_CLASS =
  'rounded-xxs border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary';

const CONFIRM_MESSAGE =
  '변경은 이후 구매에만 적용됩니다. 결제를 진행 중인 사용자는 이용권을 다시 선택하게 됩니다.';

const isPositiveInteger = (value: string) => {
  const n = Number(value);
  return value.trim() !== '' && Number.isInteger(n) && n > 0;
};

const VodPassProductForm = ({ product }: { product: VodPassProduct }) => {
  const { snackbar } = useAdminSnackbar();
  const [price, setPrice] = useState(String(product.price));
  const [durationDays, setDurationDays] = useState(
    String(product.durationDays),
  );
  const [error, setError] = useState<string | null>(null);

  const { mutate: save, isPending } = useUpdateVodPassProductMutation({
    onSuccess: () => snackbar('VOD 이용권 설정을 저장했습니다.'),
    onError: (message) => snackbar(message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    if (!isPositiveInteger(price)) {
      setError('가격은 1원 이상의 정수로 입력해 주세요.');
      return;
    }
    if (!isPositiveInteger(durationDays)) {
      setError('이용일수는 1일 이상의 정수로 입력해 주세요.');
      return;
    }

    setError(null);
    if (!window.confirm(CONFIRM_MESSAGE)) return;

    save({ price: Number(price), durationDays: Number(durationDays) });
  };

  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <span className={LABEL_CLASS}>이용권 이름</span>
        <span className="text-sm">{product.title}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className={LABEL_CLASS}>판매 상태</span>
        <span className="text-sm">
          {product.isActive ? '판매 중' : '판매 중지'}
        </span>
        <span className="text-neutral-40 text-xs">
          판매 상태는 여기서 바꿀 수 없습니다.
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS} htmlFor="vod-pass-price">
          가격(원)
        </label>
        <input
          id="vod-pass-price"
          type="number"
          inputMode="numeric"
          className={INPUT_CLASS}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS} htmlFor="vod-pass-duration-days">
          이용일수(일)
        </label>
        <input
          id="vod-pass-duration-days"
          type="number"
          inputMode="numeric"
          className={INPUT_CLASS}
          value={durationDays}
          onChange={(e) => setDurationDays(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-neutral-0 text-xsmall14 rounded-md px-4 py-2 text-white disabled:opacity-50"
        >
          저장
        </button>
      </div>
    </form>
  );
};

/**
 * VOD 이용권 상품 설정 (LC-3438, PRD 4.3 A-2).
 *
 * 가격과 이용일수만 바꾼다. 판매 상태(isActive)는 BE 에 변경 API 가 없어 읽기 전용이다.
 */
const VodPassProductSettings = () => {
  const { data, isLoading, error } = useVodPassProductQuery();

  const renderBody = () => {
    if (isLoading) return <p className="text-sm">불러오는 중입니다.</p>;

    if (error) {
      // 상품 행이 아직 없으면 빈 화면 대신 원인과 확인할 설정을 알려준다.
      let message = '이용권 정보를 불러오지 못했습니다.';
      if (error instanceof ApiError) {
        message =
          error.code === VOD_PASS_PRODUCT_NOT_FOUND
            ? '상품이 아직 생성되지 않았습니다. BE 배포 설정(vod-pass.initial-price)을 확인하세요'
            : error.message;
      }
      return (
        <p role="alert" className="text-sm text-red-500">
          {message}
        </p>
      );
    }

    if (!data) return null;
    return <VodPassProductForm product={data} />;
  };

  return (
    <div className="p-8">
      <h1 className="text-1.5-bold mb-6">VOD 이용권 설정</h1>
      {renderBody()}
    </div>
  );
};

export default VodPassProductSettings;
