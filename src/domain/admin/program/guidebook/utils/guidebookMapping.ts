import type {
  CreateGuidebookReq,
  GuidebookIdSchema,
  GuidebookPriceType,
  UpdateGuidebookReq,
} from '@/schema';

import type { ContentProgramFormInput } from '../../programContentTypes';

// 가이드북 폼 초기값
export const initialGuidebookInput: ContentProgramFormInput = {
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
  price: 0,
  discount: 0,
  priceType: 'CHARGE',
  programTypeInfo: [],
  adminProgramTypeInfo: [],
};

// 가이드북 데이터로 폼 입력값 변환
export const guidebookToFormInput = (
  guidebook: GuidebookIdSchema,
): ContentProgramFormInput => ({
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
  price: guidebook.price ?? 0,
  discount: guidebook.discount ?? 0,
  priceType: guidebook.guideBookPriceType ?? 'CHARGE',
  programTypeInfo:
    guidebook.programTypeInfo?.map((value) => ({
      classificationInfo: {
        programClassification: value.programClassification ?? 'PASS',
      },
    })) ?? [],
  // GET 응답은 adminClassificationInfo이지만 폼 상태는 adminProgramTypeInfo로 통일
  adminProgramTypeInfo:
    guidebook.adminClassificationInfo?.map((value) => ({
      classificationInfo: {
        programAdminClassification: value.programAdminClassification,
      },
    })) ?? [],
});

// 생성 요청 바디 빌더
export const buildCreateGuidebookReq = (
  input: ContentProgramFormInput,
): CreateGuidebookReq => ({
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
      price: input.price,
      discount: input.discount,
      accountNumber: '',
      deadline: undefined,
      accountType: 'KB',
    },
    guideBookPriceType: input.priceType as GuidebookPriceType,
  },
  programTypeInfo: input.programTypeInfo,
  adminProgramTypeInfo: input.adminProgramTypeInfo,
});

// 수정 요청 바디 빌더
export const buildUpdateGuidebookReq = (
  guidebookId: number,
  input: ContentProgramFormInput,
): UpdateGuidebookReq & { guidebookId: number } => ({
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
      price: input.price,
      discount: input.discount,
      accountNumber: '',
      deadline: undefined,
      accountType: 'KB',
    },
    guideBookPriceType: input.priceType as GuidebookPriceType,
  },
  programTypeInfo: input.programTypeInfo,
  adminProgramTypeInfo: input.adminProgramTypeInfo,
});
