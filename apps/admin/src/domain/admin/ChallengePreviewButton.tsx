/**
 * @incomplete 중단된 작업
 * @deprecated
 */

import { useGetFaq } from '@/api/faq';
import {
  ChallengeIdSchema,
  CreateChallengeReq,
  UpdateChallengeReq,
} from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { useMemo, useState } from 'react';

// TODO: 검증 필요. 필요 시 CREATE / UPDATE 분리.
const ChallengePreviewButton: React.FC<{
  existing?: ChallengeIdSchema | null; // 편집할 때 쓰임.
  input: Omit<UpdateChallengeReq | CreateChallengeReq, 'desc'>;
  content: ChallengeContent;
}> = ({ input, existing, content }) => {
  const { data: faq } = useGetFaq('CHALLENGE');
  const inputFaqIdSet = useMemo(() => {
    return new Set(input.faqInfo?.map((faq) => faq.faqId));
  }, [input.faqInfo]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const challenge = useMemo((): ChallengeIdSchema => {
  //   // 편집 시
  //   if (existing) {
  //     return {
  //       beginning: dayjs(input.beginning) ?? existing.beginning,
  //       challengeType: input.challengeType ?? existing.challengeType,
  //       classificationInfo: existing.classificationInfo, // TODO: 수정 필요
  //       adminClassificationInfo: existing.adminClassificationInfo, // TODO: 수정 필요
  //       deadline: input.deadline ? dayjs(input.deadline) : existing.deadline,
  //       endDate: input.endDate ? dayjs(input.endDate) : existing.endDate,
  //       faqInfo:
  //         faq?.faqList.filter((faq) => inputFaqIdSet.has(faq.id)) ??
  //         existing.faqInfo,
  //       priceInfo:
  //         input.priceInfo?.map((price, index) => ({
  //           priceId: index,
  //           accountType: price.priceInfo.accountType,
  //           challengeParticipationType: price.challengeParticipationType,
  //           challengePriceType: price.challengePriceType,
  //           challengePricePlanType: price.challengePricePlanType,
  //           refund: price.refund,
  //           deadline: price.priceInfo.deadline
  //             ? dayjs(price.priceInfo.deadline)
  //             : null,
  //           discount: price.priceInfo.discount,
  //           price: price.priceInfo.price,
  //         })) ?? existing.priceInfo,
  //       startDate: input.startDate
  //         ? dayjs(input.startDate)
  //         : existing.startDate,
  //       title: input.title ?? existing.title,
  //       chatLink: input.chatLink ?? existing.chatLink,
  //       chatPassword: input.chatPassword ?? existing.chatPassword,
  //       criticalNotice: input.criticalNotice ?? existing.criticalNotice,
  //       desc: JSON.stringify(content) ?? existing.desc,
  //       participationCount:
  //         input.participationCount ?? existing.participationCount,
  //       shortDesc: input.shortDesc ?? existing.shortDesc,
  //       thumbnail: input.thumbnail ?? existing.thumbnail,
  //     };
  //   }

  //   // 생성 시

  //   return {
  //     beginning: dayjs(input.beginning),
  //     challengeType: input.challengeType ?? 'CAREER_START', // TODO: 수정 필요
  //     classificationInfo: [{ programClassification: 'CAREER_SEARCH' }], // TODO: 수정 필요
  //     adminClassificationInfo: [{ programAdminClassification: 'B2C' }], // TODO: 수정 필요
  //     deadline: input.deadline ? dayjs(input.deadline) : null,
  //     endDate: input.endDate ? dayjs(input.endDate) : null,
  //     faqInfo: faq?.faqList.filter((faq) => inputFaqIdSet.has(faq.id)) ?? [],
  //     priceInfo:
  //       input.priceInfo?.map((price, index) => ({
  //         priceId: index,
  //         accountType: price.priceInfo.accountType,
  //         challengeParticipationType: price.challengeParticipationType,
  //         challengePriceType: price.challengePriceType,
  //         challengeUserType: price.challengeUserType,
  //         refund: price.refund,
  //         deadline: price.priceInfo.deadline
  //           ? dayjs(price.priceInfo.deadline)
  //           : null,
  //         discount: price.priceInfo.discount,
  //         price: price.priceInfo.price,
  //       })) ?? [],
  //     startDate: input.startDate ? dayjs(input.startDate) : null,
  //     title: input.title,
  //     chatLink: input.chatLink,
  //     chatPassword: input.chatPassword,
  //     criticalNotice: input.criticalNotice,
  //     desc: JSON.stringify(content),
  //     participationCount: input.participationCount,
  //     shortDesc: input.shortDesc,
  //     thumbnail: input.thumbnail,
  //   };
  // }, [input, content, faq, inputFaqIdSet, existing]);

  return (
    <>
      {/* <Button
        variant="outlined"
        color="primary"
        startIcon={<FaDesktop size={12} />}
        onClick={handleOpen}
      >
        미리보기 (작업중)
      </Button>
      <PreviewModal open={open} onClose={handleClose}>
      <ChallengeView challenge={challenge} isPreview />
      </PreviewModal> */}
    </>
  );
};

export default ChallengePreviewButton;
