import axios from '@/utils/axios';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * POST /api/v1/pass-certification 요청 바디 (비로그인 합격 인증 등록)
 * - passTypeEtc: passType === 'ETC' 일 때만 사용
 * - programTypeEtc: programTypeList 에 'ETC' 포함 시에만 사용
 */
export const passCertificationRequestSchema = z.object({
  name: z.string(),
  phoneNum: z.string(),
  email: z.string(),
  companyName: z.string(),
  jobName: z.string(),
  passType: z.string(),
  passTypeEtc: z.string().optional(),
  certificationImageUrl: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  programTypeList: z.array(z.string()),
  programTypeEtc: z.string().optional(),
  programFeedback: z.string().optional(),
  privacyAgree: z.boolean(),
  virtuousCycleAgree: z.boolean(),
});

export type PassCertificationRequest = z.infer<
  typeof passCertificationRequestSchema
>;

/** 합격 인증 등록 (비로그인) */
export const useCreatePassCertificationMutation = () =>
  useMutation({
    mutationFn: (body: PassCertificationRequest) =>
      axios.post('/pass-certification', body),
  });
