import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// VOD 제외: 외부 허브 접근권이라 0원 신청 대상 아님
export type PrivilegeProgramType = 'CHALLENGE' | 'LIVE' | 'GUIDEBOOK';

const membershipPrivilegeSchema = z.object({
  hasPrivilege: z.boolean(),
});
export type MembershipPrivilege = z.infer<typeof membershipPrivilegeSchema>;

// 권한으로 무료 이용 가능 여부 (programType 단위 판정, 비로그인 false)
export const useGetMembershipPrivilege = (
  programType: PrivilegeProgramType,
  programId: number,
) =>
  useQuery({
    queryKey: ['membershipPrivilege', programType, programId],
    queryFn: async (): Promise<MembershipPrivilege> => {
      const res = await axios.get('/membership-application/privilege', {
        params: { programType, programId },
      });
      return membershipPrivilegeSchema.parse(res.data.data);
    },
    enabled: Number.isFinite(programId) && programId > 0,
    refetchOnWindowFocus: false,
  });

const openPrivilegeItemSchema = z.object({
  membershipPlanPrivilegeId: z.number().nullish(),
  programType: z.string(),
  privilegeType: z.string(),
  programCount: z.number().nullish(),
});

const openMembershipPrivilegeSchema = z.object({
  exists: z.boolean(),
  membershipId: z.number().nullish(),
  privilegeList: z.array(openPrivilegeItemSchema).default([]),
  openCount: z.number().nullish(),
});
export type OpenMembershipPrivilege = z.infer<
  typeof openMembershipPrivilegeSchema
>;

// 현재 열린 패스의 권한 목록 (비보유자 업셀 노출 판정)
export const useGetOpenMembershipPrivilege = (options?: {
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: ['openMembershipPrivilege'],
    queryFn: async (): Promise<OpenMembershipPrivilege> => {
      const res = await axios.get('/membership/open/privilege');
      return openMembershipPrivilegeSchema.parse(res.data.data);
    },
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
  });
