import type {
  CreateVodReq,
  UpdateVodReq,
  VodIdSchema,
  VodPriceType,
} from '@/schema';

import type { ContentProgramFormInput } from '../../programContentTypes';

export const initialVodInput: ContentProgramFormInput = {
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

export const vodToFormInput = (vod: VodIdSchema): ContentProgramFormInput => ({
  title: vod.vodInfo.title ?? '',
  shortDesc: vod.vodInfo.shortDesc ?? '',
  thumbnail: vod.vodInfo.thumbnail ?? '',
  desktopThumbnail: vod.vodInfo.desktopThumbnail ?? '',
  contentComposition: vod.vodInfo.contentComposition ?? '',
  accessMethod: vod.vodInfo.accessMethod ?? '',
  recommendedFor: vod.vodInfo.recommendedFor ?? '',
  description: vod.vodInfo.description ?? '',
  job: vod.vodInfo.job ?? '',
  contentUrl: vod.vodInfo.contentUrl ?? undefined,
  contentFileUrl: vod.vodInfo.contentFileUrl ?? undefined,
  price: vod.price ?? 0,
  discount: vod.discount ?? 0,
  priceType: (vod.vodPriceType ?? 'CHARGE') as 'CHARGE' | 'FREE',
  programTypeInfo:
    vod.programTypeInfo?.map((value) => ({
      classificationInfo: {
        programClassification: value.programClassification ?? 'PASS',
      },
    })) ?? [],
  adminProgramTypeInfo:
    vod.adminProgramTypeInfo?.map((value) => ({
      classificationInfo: {
        programAdminClassification: value.programAdminClassification,
      },
    })) ?? [],
});

export const buildCreateVodReq = (
  input: ContentProgramFormInput,
): CreateVodReq => ({
  title: input.title,
  shortDesc: input.shortDesc,
  thumbnail: input.thumbnail,
  desktopThumbnail: input.desktopThumbnail,
  contentComposition: input.contentComposition,
  accessMethod: input.accessMethod,
  recommendedFor: input.recommendedFor,
  description: input.description,
  job: input.job,
  link: '', // 내재화 후 사용하지않음
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
    vodPriceType: input.priceType as VodPriceType,
  },
  programTypeInfo: input.programTypeInfo,
  adminProgramTypeInfo: input.adminProgramTypeInfo,
});

export const buildUpdateVodReq = (
  vodId: number,
  input: ContentProgramFormInput,
): UpdateVodReq & { vodId: number } => ({
  vodId,
  title: input.title,
  shortDesc: input.shortDesc,
  thumbnail: input.thumbnail,
  desktopThumbnail: input.desktopThumbnail,
  contentComposition: input.contentComposition,
  accessMethod: input.accessMethod,
  recommendedFor: input.recommendedFor,
  description: input.description,
  job: input.job,
  link: '', // 사용하지 않지만 백엔드가 null을 허용하지 않음
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
    vodPriceType: input.priceType as VodPriceType,
  },
  programTypeInfo: input.programTypeInfo,
  adminProgramTypeInfo: input.adminProgramTypeInfo,
});
