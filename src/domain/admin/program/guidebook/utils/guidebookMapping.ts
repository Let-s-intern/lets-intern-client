import type {
  CreateGuidebookReq,
  GuidebookIdSchema,
  GuidebookPriceType,
  UpdateGuidebookReq,
} from '@/schema';

// 가이드북 폼 초기값
export const initialGuidebookInput: CreateGuidebookReq = {
  title: '',
  shortDesc: '',
  thumbnail: '',
  desktopThumbnail: '',
  contentComposition: '',
  accessMethod: '',
  recommendedFor: '',
  description: '',
  job: '',
  contentUrl: undefined,
  contentFileUrl: undefined,
  priceInfo: {
    priceInfo: {
      price: 0,
      discount: 0,
      accountNumber: '',
      deadline: undefined,
      accountType: 'KB',
    },
    guideBookPriceType: 'CHARGE',
  },
  programTypeInfo: [],
  adminProgramTypeInfo: [],
};

// 가이드북 데이터로 폼 입력값 변환
export const guidebookToFormInput = (
  guidebook: GuidebookIdSchema,
): CreateGuidebookReq => ({
  title: guidebook.title ?? '',
  shortDesc: guidebook.shortDesc ?? '',
  thumbnail: guidebook.thumbnail ?? '',
  desktopThumbnail: guidebook.desktopThumbnail ?? '',
  contentComposition: guidebook.contentComposition ?? '',
  accessMethod: guidebook.accessMethod ?? '',
  recommendedFor: guidebook.recommendedFor ?? '',
  description: guidebook.description ?? '',
  job: guidebook.job ?? '',
  contentUrl: guidebook.contentUrl ?? undefined,
  contentFileUrl: guidebook.contentFileUrl ?? undefined,
  priceInfo: {
    priceInfo: {
      price: guidebook.price ?? 0,
      discount: guidebook.discount ?? 0,
      accountNumber: '',
      deadline: undefined,
      accountType: 'KB',
    },
    guideBookPriceType: guidebook.guideBookPriceType ?? 'CHARGE',
  },
  programTypeInfo:
    guidebook.programTypeInfo?.map((value) => ({
      classificationInfo: {
        programClassification: value.programClassification ?? 'PASS',
      },
    })) ?? [],
  adminProgramTypeInfo:
    guidebook.adminClassificationInfo?.map((value) => ({
      classificationInfo: {
        programAdminClassification: value.programAdminClassification,
      },
    })) ?? [],
});

// 생성 요청 바디 빌더
export const buildCreateGuidebookReq = (
  input: CreateGuidebookReq,
): CreateGuidebookReq => input;

// 수정 요청 바디 빌더
export const buildUpdateGuidebookReq = (
  guidebookId: number,
  input: CreateGuidebookReq,
): UpdateGuidebookReq & { guidebookId: number } => {
  const req: UpdateGuidebookReq & { guidebookId: number } = {
    guidebookId,
    title: input.title,
    shortDesc: input.shortDesc,
    thumbnail: input.thumbnail,
    desktopThumbnail: input.desktopThumbnail,
    contentComposition: input.contentComposition,
    accessMethod: input.accessMethod,
    recommendedFor: input.recommendedFor,
    description: input.description,
    job: input.job,
    contentUrl: input.contentUrl,
    contentFileUrl: input.contentFileUrl,
    priceInfo: {
      priceInfo: {
        price: input.priceInfo.priceInfo.price,
        discount: input.priceInfo.priceInfo.discount,
        accountNumber: input.priceInfo.priceInfo.accountNumber,
        deadline: input.priceInfo.priceInfo.deadline,
        accountType: input.priceInfo.priceInfo.accountType,
      },
      guideBookPriceType: input.priceInfo
        .guideBookPriceType as GuidebookPriceType,
    },
    programTypeInfo: input.programTypeInfo,
    adminProgramTypeInfo: input.adminProgramTypeInfo,
  };

  return req;
};
