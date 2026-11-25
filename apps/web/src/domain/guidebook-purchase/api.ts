import type {
  PostApplicationInterface,
  PostApplicationResult,
} from '@/api/application';
import axios from '@/utils/axios';

/** 가이드북 신청. 결제 확인(토스)은 서버가 이 요청 안에서 한다 */
export const postGuidebookPurchase = (
  guidebookId: number,
  body: PostApplicationInterface,
) =>
  axios.post<{ data: PostApplicationResult }>(
    `/application/${guidebookId}?type=GUIDEBOOK`,
    body,
  );
