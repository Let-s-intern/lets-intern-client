'use client';

import { getPresignedUrl, uploadToS3 } from '@/domain/challenge/api/presignedUrl';
import { useToast } from '@letscareer/ui';
import { useState } from 'react';

import { useCreatePassCertificationMutation } from './api/passCertification';
import { PassCertificationFormValues } from './passCertificationForm';

/**
 * 합격 인증 제출 부수효과 담당 훅.
 * 증빙 이미지 presigned 업로드 → certificationImageUrl 확보 → 등록 API 호출.
 * 폼 컴포넌트는 UI·스텝 흐름만 갖고, 업로드/등록/토스트/로딩은 여기서 처리한다.
 */
export function usePassCertificationSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const createPassCertification = useCreatePassCertificationMutation();
  const toast = useToast();

  /** 성공하면 true (호출부에서 완료 화면 전환), 실패하면 false */
  const submit = async (
    values: PassCertificationFormValues,
  ): Promise<boolean> => {
    const file = values.certificationImage;
    if (!file) return false; // 검증에서 걸러지지만 방어

    setSubmitting(true);
    try {
      // 1. 증빙 이미지 presigned 업로드 → 저장용 URL (쿼리스트링 제거)
      const objectKey = `pass-certification/${Date.now()}-${file.name}`;
      const presignedUrl = await getPresignedUrl(
        'pass-certification',
        objectKey,
      );
      await uploadToS3(presignedUrl, file);
      const certificationImageUrl = presignedUrl.split('?')[0];

      // 2. 등록 (ETC 아닐 땐 Etc 필드, 후기 비면 미전송)
      await createPassCertification.mutateAsync({
        name: values.name,
        phoneNum: values.phoneNum,
        email: values.email,
        companyName: values.companyName,
        jobName: values.jobName,
        passType: values.passType,
        passTypeEtc:
          values.passType === 'ETC' ? values.passTypeEtc : undefined,
        certificationImageUrl,
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        programTypeList: values.programTypeList,
        programTypeEtc: values.programTypeList.includes('ETC')
          ? values.programTypeEtc
          : undefined,
        programFeedback: values.programFeedback || undefined,
        privacyAgree: values.privacyAgree,
        virtuousCycleAgree: values.virtuousCycleAgree,
      });

      return true;
    } catch {
      toast.error('제출에 실패했어요. 잠시 후 다시 시도해 주세요.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submitting };
}
