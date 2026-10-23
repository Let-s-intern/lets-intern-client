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

/** POST /admin/company-logo — 만든 로고의 id. 일괄 등록이 여러 건을 직접 부르므로 함수로도 둔다 */
export const createCompanyLogo = async (body: CompanyLogoReq) => {
  const res = await axios.post(PATH, body);
  return companyLogoCreatedSchema.parse(res.data.data).id;
};

export const usePostAdminCompanyLogoMutation = () =>
  useCompanyLogoMutation(createCompanyLogo);

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

/** POST /admin/company-logo/favicon/candidates — 회사 사이트의 아이콘 후보와 사이트 이름을 찾는다. 올리지는 않는다 */
export const fetchCompanyLogoFaviconCandidates = async (
  siteUrl: string,
  signal?: AbortSignal,
) => {
  const res = await axios.post(
    `${PATH}/favicon/candidates`,
    { siteUrl },
    { signal },
  );
  return companyLogoFaviconCandidatesSchema.parse(res.data.data);
};

export const usePostAdminCompanyLogoFaviconCandidatesMutation = () =>
  useMutation({
    mutationFn: (siteUrl: string) => fetchCompanyLogoFaviconCandidates(siteUrl),
  });

/** POST /admin/company-logo/favicon — 고른 후보를 서버가 올리고 주소를 돌려준다 */
export const uploadCompanyLogoFavicon = async (body: {
  siteUrl: string;
  candidateUrl: string;
}) => {
  const res = await axios.post(`${PATH}/favicon`, body);
  return companyLogoFaviconSchema.parse(res.data.data).imageUrl;
};

export const usePostAdminCompanyLogoFaviconMutation = () =>
  useMutation({ mutationFn: uploadCompanyLogoFavicon });

/** DELETE /admin/company-logo/{id}. 멘토에 연결돼 있으면 서버가 409(COMPANY_LOGO_IN_USE)로 막는다 */
export const useDeleteAdminCompanyLogoMutation = () =>
  useCompanyLogoMutation((id: number) => axios.delete(`${PATH}/${id}`));
