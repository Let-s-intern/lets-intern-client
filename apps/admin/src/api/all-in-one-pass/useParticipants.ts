import {
  PassParticipant,
  UsedProgram,
  UsedProgramType,
} from '@/domain/all-in-one-pass/types';
import dayjs from '@/lib/dayjs';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * 올인원패스 참여자 조회.
 * 서버: GET /admin/membership/{id}/application (신청자 목록, 최초+연장 nested),
 *       GET .../{applicationId}/program (이용 프로그램).
 * BE는 유저 1건(최초 신청 + 연장 리스트)로 주고, FE 테이블은 건별 flat 행을 이메일로 묶으므로
 * 아래 매퍼가 base + 연장들을 flat PassParticipant[] 로 펼침.
 * 권한 회수는 PATCH .../{applicationId}/refund (돈 환불은 토스 수동, 이 API는 권한 회수+환불표시만).
 */

export const participantListQueryKey = 'allInOnePassParticipantList';
export const usedProgramsQueryKey = 'allInOnePassUsedPrograms';

// ── 스키마 (server MembershipApplicationAdminVo 등) ──────
const applicationAdminSchema = z.object({
  membershipApplicationId: z.number(),
  userName: z.string().nullish(),
  contactEmail: z.string().nullish(),
  phoneNum: z.string().nullish(),
  planTitle: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  orderId: z.string().nullish(),
  paymentDate: z.string().nullish(),
  couponName: z.string().nullish(),
  finalPrice: z.number().nullish(),
  isRefunded: z.boolean().nullish(),
});

const extensionAdminSchema = z.object({
  membershipApplicationExtensionId: z.number(),
  optionTitle: z.string().nullish(),
  extensionDays: z.number().nullish(),
  orderId: z.string().nullish(),
  paymentDate: z.string().nullish(),
  couponName: z.string().nullish(),
  finalPrice: z.number().nullish(),
  isRefunded: z.boolean().nullish(),
});

const applicationItemSchema = z.object({
  membershipApplication: applicationAdminSchema,
  extensionList: z.array(extensionAdminSchema).default([]),
});

const participantListResponseSchema = z.object({
  membershipTitle: z.string().nullish(),
  membershipApplicationList: z.array(applicationItemSchema).default([]),
});

const programSchema = z.object({
  programType: z.string().nullish(),
  programTitle: z.string().nullish(),
  usedDate: z.string().nullish(),
});
const programListResponseSchema = z.object({
  userName: z.string().nullish(),
  programList: z.array(programSchema).default([]),
});

// ── 매퍼 ────────────────────────────────────────────────
type ApplicationItem = z.infer<typeof applicationItemSchema>;

/** BE 신청 1건(최초 + 연장) → flat PassParticipant[] (최초 + 연장 각각 한 행) */
const toParticipants = (item: ApplicationItem): PassParticipant[] => {
  const a = item.membershipApplication;
  const exts = [...item.extensionList].sort((x, y) =>
    (x.paymentDate ?? '').localeCompare(y.paymentDate ?? ''),
  );
  const totalExtDays = exts.reduce((s, e) => s + (e.extensionDays ?? 0), 0);
  // 최초 신청의 원래 종료일 = 최종 종료 - 전체 연장일. 연장 행은 여기서 누적.
  const baseEnd = a.endDate
    ? dayjs(a.endDate).subtract(totalExtDays, 'day').toISOString()
    : '';
  const shared = {
    name: a.userName ?? '',
    email: a.contactEmail ?? '',
    phoneNum: a.phoneNum ?? '',
    startDate: a.startDate ?? '',
  };

  const base: PassParticipant = {
    id: a.membershipApplicationId,
    orderId: a.orderId ?? '',
    ...shared,
    couponName: a.couponName ?? null,
    couponDiscount: null,
    productName: a.planTitle ?? '',
    programPrice: a.finalPrice ?? 0,
    programDiscount: 0,
    finalPrice: a.finalPrice ?? 0,
    originalPrice: null,
    isCanceled: a.isRefunded ?? false,
    isAdminRefunded: a.isRefunded ?? false,
    createDate: a.paymentDate ?? '',
    endDate: baseEnd,
    extendedDays: null,
    usedPrograms: [],
  };

  let cumEnd = baseEnd;
  const extensionRows: PassParticipant[] = exts.map((e) => {
    cumEnd = e.extensionDays
      ? dayjs(cumEnd).add(e.extensionDays, 'day').toISOString()
      : cumEnd;
    return {
      id: e.membershipApplicationExtensionId,
      orderId: e.orderId ?? '',
      ...shared,
      couponName: e.couponName ?? null,
      couponDiscount: null,
      productName: e.optionTitle ?? '',
      programPrice: e.finalPrice ?? 0,
      programDiscount: 0,
      finalPrice: e.finalPrice ?? 0,
      originalPrice: null,
      isCanceled: e.isRefunded ?? false,
      isAdminRefunded: e.isRefunded ?? false,
      createDate: e.paymentDate ?? '',
      endDate: cumEnd,
      extendedDays: e.extensionDays ?? null,
      usedPrograms: [],
    };
  });

  return [base, ...extensionRows];
};

const toUsedProgramType = (type?: string | null): UsedProgramType => {
  if (type === 'GUIDEBOOK' || type === 'VOD' || type === 'CHALLENGE')
    return type;
  if (type === 'LIVE' || type === 'LIVE_MENTORING') return 'MENTORING';
  return 'CHALLENGE';
};

/** 특정 패스의 참여자(신청자) 목록 */
export const useGetParticipantsQuery = (passId?: number) =>
  useQuery({
    enabled: passId !== undefined,
    queryKey: [participantListQueryKey, passId],
    queryFn: async () => {
      const res = await axios.get(`/admin/membership/${passId}/application`, {
        params: { page: 0, size: 1000 },
      });
      const parsed = participantListResponseSchema.parse(res.data.data);
      return {
        membershipTitle: parsed.membershipTitle ?? '',
        participants: parsed.membershipApplicationList.flatMap(toParticipants),
      };
    },
  });

/** 특정 신청자가 이용한 프로그램 목록 (이용 프로그램 모달) */
export const useGetUsedProgramsQuery = (
  passId?: number,
  applicationId?: number,
) =>
  useQuery({
    enabled: passId != null && applicationId != null,
    queryKey: [usedProgramsQueryKey, passId, applicationId],
    queryFn: async () => {
      const res = await axios.get(
        `/admin/membership/${passId}/application/${applicationId}/program`,
      );
      return programListResponseSchema.parse(res.data.data).programList.map(
        (p, i): UsedProgram => ({
          id: i,
          type: toUsedProgramType(p.programType),
          title: p.programTitle ?? '',
          usedAt: p.usedDate ?? null,
        }),
      );
    },
  });

/** 권한 회수(수동 환불 처리) — PATCH .../{applicationId}/refund. 돈 환불은 토스 수동. */
export const useRevokeParticipantMutation = (passId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (membershipApplicationId: number) =>
      axios.patch(
        `/admin/membership/${passId}/application/${membershipApplicationId}/refund`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [participantListQueryKey, passId],
      });
    },
  });
};
