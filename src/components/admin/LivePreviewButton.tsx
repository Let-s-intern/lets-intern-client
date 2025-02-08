import { useGetFaq } from '@/api/faq';
import dayjs from '@/lib/dayjs';
import { CreateLiveReq, LiveIdSchema, UpdateLiveReq } from '@/schema';
import { LiveContent } from '@/types/interface';
import { Button } from '@mui/material';
import { useMemo, useState } from 'react';
import { FaDesktop } from 'react-icons/fa6';

// TODO: 검증 필요. 필요 시 CREATE / UPDATE 분리.
const LivePreviewButton: React.FC<{
  existing?: LiveIdSchema | null; // 편집할 때 쓰임.
  input: Omit<UpdateLiveReq | CreateLiveReq, 'desc'>;
  content: LiveContent;
}> = ({ input, existing, content }) => {
  const { data: faq } = useGetFaq('LIVE');
  const inputFaqIdSet = useMemo(() => {
    return new Set(input.faqInfo?.map((faq) => faq.faqId));
  }, [input.faqInfo]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const live = useMemo((): LiveIdSchema => {
    // 편집 시
    if (existing) {
      return {
        beginning: dayjs(input.beginning) ?? existing.beginning,
        job: input.job ?? existing.job,
        mentorCareer: input.mentorCareer ?? existing.mentorCareer,
        mentorCompany: input.mentorCompany ?? existing.mentorCompany,
        mentorName: input.mentorName ?? existing.mentorName,
        mentorImg: input.mentorImg ?? existing.mentorImg,
        mentorIntroduction:
          input.mentorIntroduction ?? existing.mentorIntroduction,
        mentorJob: input.mentorJob ?? existing.mentorJob,
        place: input.place ?? existing.place,
        progressType: input.progressType ?? existing.progressType,
        classificationInfo: existing.classificationInfo, // TODO: 수정 필요
        adminClassificationInfo: existing.adminClassificationInfo, // TODO: 수정 필요
        deadline: input.deadline ? dayjs(input.deadline) : existing.deadline,
        endDate: input.endDate ? dayjs(input.endDate) : existing.endDate,
        faqInfo:
          faq?.faqList.filter((faq) => inputFaqIdSet.has(faq.id)) ??
          existing.faqInfo,
        priceInfo: {
          deadline: input.priceInfo?.priceInfo.deadline
            ? dayjs(input.priceInfo?.priceInfo.deadline)
            : existing.priceInfo.deadline,
          price: input.priceInfo?.priceInfo.price ?? existing.priceInfo.price,
          discount:
            input.priceInfo?.priceInfo.discount ?? existing.priceInfo.discount,
          accountNumber:
            input.priceInfo?.priceInfo.accountNumber ??
            existing.priceInfo.accountNumber,
          priceId: existing.priceInfo.priceId,
          accountType:
            input.priceInfo?.priceInfo.accountType ??
            existing.priceInfo.accountType,
          livePriceType:
            input.priceInfo?.livePriceType ?? existing.priceInfo.livePriceType,
        },
        startDate: input.startDate
          ? dayjs(input.startDate)
          : existing.startDate,
        title: input.title ?? existing.title,
        criticalNotice: input.criticalNotice ?? existing.criticalNotice,
        desc: JSON.stringify(content) ?? existing.desc,
        participationCount:
          input.participationCount ?? existing.participationCount,
        shortDesc: input.shortDesc ?? existing.shortDesc,
        thumbnail: input.thumbnail ?? existing.thumbnail,
      };
    }

    // 생성 시
    return {
      beginning: dayjs(input.beginning),
      job: input.job,
      mentorCareer: input.mentorCareer,
      mentorCompany: input.mentorCompany,
      mentorName: input.mentorName,
      mentorImg: input.mentorImg,
      mentorIntroduction: input.mentorIntroduction,
      mentorJob: input.mentorJob,
      classificationInfo: [{ programClassification: 'CAREER_SEARCH' }], // TODO: 수정 필요
      adminClassificationInfo: [{ programAdminClassification: 'B2C' }], // TODO: 수정 필요
      deadline: input.deadline ? dayjs(input.deadline) : null,
      endDate: input.endDate ? dayjs(input.endDate) : null,
      faqInfo: faq?.faqList.filter((faq) => inputFaqIdSet.has(faq.id)) ?? [],
      priceInfo: {
        deadline: input.priceInfo?.priceInfo.deadline
          ? dayjs(input.priceInfo?.priceInfo.deadline)
          : null,
        price: input.priceInfo?.priceInfo.price,
        discount: input.priceInfo?.priceInfo.discount,
        accountNumber: input.priceInfo?.priceInfo.accountNumber,
        priceId: 0,
        accountType: input.priceInfo?.priceInfo.accountType,
        livePriceType: input.priceInfo?.livePriceType,
      },
      startDate: input.startDate ? dayjs(input.startDate) : null,
      title: input.title,
      criticalNotice: input.criticalNotice,
      desc: JSON.stringify(content),
      participationCount: input.participationCount,
      shortDesc: input.shortDesc,
      thumbnail: input.thumbnail,
    };
  }, [input, content, faq, inputFaqIdSet, existing]);

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<FaDesktop size={12} />}
        onClick={handleOpen}
      >
        미리보기 (작업중)
      </Button>
      {/* <PreviewModal open={open} onClose={handleClose}> */}
      {/* <LiveView live={live} isPreview /> */}
      {/* </PreviewModal> */}
    </>
  );
};

export default LivePreviewButton;
