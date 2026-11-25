/** 구매 창 쿼리로 끝까지 들고 다니는 복귀 주소. 사용하기 직전에 검증한다 */
export const RETURN_URL_PARAM = 'returnUrl';

type PurchaseStep = 'result' | 'fail';

/**
 * 구매 창의 경로. step 이 없으면 구매 화면이다.
 * returnUrl 이 있으면 결과·실패 화면까지 쿼리로 이어 붙인다.
 */
export const buildPurchasePath = ({
  guidebookId,
  step,
  returnUrl,
  params,
}: {
  guidebookId: number | string;
  step?: PurchaseStep;
  returnUrl?: string | null;
  params?: Record<string, string>;
}) => {
  const query = new URLSearchParams(params);
  if (returnUrl) query.set(RETURN_URL_PARAM, returnUrl);
  const path = `/guidebook/purchase/${guidebookId}${step ? `/${step}` : ''}`;
  const search = query.toString();
  return search ? `${path}?${search}` : path;
};
