import axios from '@/utils/axios';

import {
  adminOneTimeFormDetailSchema,
  adminOneTimeFormListSchema,
  adminOneTimeFormOptionGroupsSchema,
  adminOneTimeFormQuestionsSchema,
  createOneTimeFormResponseSchema,
  type SaveOneTimeFormOptionGroupsRequest,
  type SaveOneTimeFormQuestionsRequest,
  type SaveOneTimeFormRequest,
} from './oneTimeFormSchema';

/** 일회성 폼 어드민 API(계약 9절 A1~A7). 응답 봉투는 `res.data.data` 다. */

const BASE = '/admin/one-time-form';

/** A1 삭제 안 된 폼 전체, 생성일 내림차순 */
export const getOneTimeForms = async () => {
  const res = await axios.get(BASE);
  return adminOneTimeFormListSchema.parse(res.data.data);
};

/** A3 기본 정보, 질문, 옵션 그룹 */
export const getOneTimeForm = async (formId: number) => {
  const res = await axios.get(`${BASE}/${formId}`);
  return adminOneTimeFormDetailSchema.parse(res.data.data);
};

/** A2 생성. 201 `{ formId }` */
export const createOneTimeForm = async (body: SaveOneTimeFormRequest) => {
  const res = await axios.post(BASE, body);
  return createOneTimeFormResponseSchema.parse(res.data.data);
};

/** A4 기본 정보·결제 설정·기간·공개 저장. 응답 `data` 는 null */
export const updateOneTimeForm = async (
  formId: number,
  body: SaveOneTimeFormRequest,
) => {
  await axios.put(`${BASE}/${formId}`, body);
};

/** A5 신청이 0건일 때만 지워진다. 아니면 409 `ONE_TIME_FORM_HAS_APPLICATIONS` */
export const deleteOneTimeForm = async (formId: number) => {
  await axios.delete(`${BASE}/${formId}`);
};

/** A6 질문 일괄 저장. 응답은 저장 후 질문 목록(새 ID 포함) */
export const saveOneTimeFormQuestions = async (
  formId: number,
  body: SaveOneTimeFormQuestionsRequest,
) => {
  const res = await axios.put(`${BASE}/${formId}/questions`, body);
  return adminOneTimeFormQuestionsSchema.parse(res.data.data);
};

/** A7 옵션 그룹·옵션 일괄 저장. 결제된 적 있는 옵션은 빠져도 숨김으로 돌아온다 */
export const saveOneTimeFormOptionGroups = async (
  formId: number,
  body: SaveOneTimeFormOptionGroupsRequest,
) => {
  const res = await axios.put(`${BASE}/${formId}/option-groups`, body);
  return adminOneTimeFormOptionGroupsSchema.parse(res.data.data);
};
