import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
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

const useCompanyLogoMutation = <TVariables>(
  request: (variables: TVariables) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [AdminCompanyLogoQueryKey] }),
  });
};

/** POST /admin/company-logo */
export const usePostAdminCompanyLogoMutation = () =>
  useCompanyLogoMutation((body: CompanyLogoReq) => axios.post(PATH, body));

/** PATCH /admin/company-logo/{id} */
export const usePatchAdminCompanyLogoMutation = () =>
  useCompanyLogoMutation(
    ({ id, ...body }: Partial<CompanyLogoReq> & { id: number }) =>
      axios.patch(`${PATH}/${id}`, body),
  );

/**
 * POST /admin/company-logo/favicon — 회사 사이트의 파비콘을 서버가 가져와 올리고 주소를 돌려준다.
 * 실패하면 400 과 code(COMPANY_LOGO_FAVICON_INVALID_URL·FETCH_FAILED·TOO_LARGE)
 */
export const usePostAdminCompanyLogoFaviconMutation = () =>
  useMutation({
    mutationFn: async (siteUrl: string) => {
      const res = await axios.post(`${PATH}/favicon`, { siteUrl });
      return companyLogoFaviconSchema.parse(res.data.data).imageUrl;
    },
  });

/** DELETE /admin/company-logo/{id}. 이미 지정된 로고는 주소를 복사해 둔 것이라 그대로 남는다 */
export const useDeleteAdminCompanyLogoMutation = () =>
  useCompanyLogoMutation((id: number) => axios.delete(`${PATH}/${id}`));
