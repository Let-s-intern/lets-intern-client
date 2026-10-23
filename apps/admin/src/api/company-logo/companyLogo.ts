import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  companyLogoCreatedSchema,
  companyLogoFaviconCandidatesSchema,
  companyLogoFaviconSchema,
  companyLogoListSchema,
  type CompanyLogoReq,
} from './companyLogoSchema';

const PATH = '/admin/company-logo';

export const AdminCompanyLogoQueryKey = 'adminCompanyLogoListQuery';

/**
 * GET /admin/company-logo — 회사 로고 라이브러리 전체.
 * 검색은 화면에서 이름으로 거른다. 라이브러리가 작아 한 번에 받아 두는 편이 입력마다 요청하는 것보다 낫다.
 */
export const useAdminCompanyLogoListQuery = () =>
  useQuery({
    queryKey: [AdminCompanyLogoQueryKey],
    queryFn: async () => {
      const res = await axios.get(PATH);
      return companyLogoListSchema.parse(res.data.data).companyLogoList;
    },
    refetchOnWindowFocus: false,
  });

const useCompanyLogoMutation = <TVariables, TData = unknown>(
  request: (variables: TVariables) => Promise<TData>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [AdminCompanyLogoQueryKey] }),
  });
};

/** POST /admin/company-logo — 만든 로고의 id 를 돌려준다 */
export const usePostAdminCompanyLogoMutation = () =>
  useCompanyLogoMutation(async (body: CompanyLogoReq) => {
    const res = await axios.post(PATH, body);
    return companyLogoCreatedSchema.parse(res.data.data).id;
  });

/** PATCH /admin/company-logo/{id} */
export const usePatchAdminCompanyLogoMutation = () =>
  useCompanyLogoMutation(
    ({ id, ...body }: Partial<CompanyLogoReq> & { id: number }) =>
      axios.patch(`${PATH}/${id}`, body),
  );

/*
 * 파비콘 두 단계. 실패하면 둘 다 400 과 code
 * (COMPANY_LOGO_FAVICON_INVALID_URL · FETCH_FAILED(후보 0개 포함) · TOO_LARGE)
 */

/** POST /admin/company-logo/favicon/candidates — 회사 사이트의 아이콘 후보를 찾는다. 올리지는 않는다 */
export const usePostAdminCompanyLogoFaviconCandidatesMutation = () =>
  useMutation({
    mutationFn: async (siteUrl: string) => {
      const res = await axios.post(`${PATH}/favicon/candidates`, { siteUrl });
      return companyLogoFaviconCandidatesSchema.parse(res.data.data);
    },
  });

/** POST /admin/company-logo/favicon — 고른 후보를 서버가 올리고 주소를 돌려준다 */
export const usePostAdminCompanyLogoFaviconMutation = () =>
  useMutation({
    mutationFn: async (body: { siteUrl: string; candidateUrl: string }) => {
      const res = await axios.post(`${PATH}/favicon`, body);
      return companyLogoFaviconSchema.parse(res.data.data).imageUrl;
    },
  });

/** DELETE /admin/company-logo/{id}. 이미 지정된 로고는 주소를 복사해 둔 것이라 그대로 남는다 */
export const useDeleteAdminCompanyLogoMutation = () =>
  useCompanyLogoMutation((id: number) => axios.delete(`${PATH}/${id}`));
