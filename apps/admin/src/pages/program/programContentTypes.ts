import type {
  ProgramAdminClassification,
  ProgramClassification,
} from '@/schema';

/** VOD, 가이드북 어드민 폼에서 공유하는 내부 상태 타입 */
export type ContentProgramFormInput = {
  title: string;
  shortDesc: string;
  thumbnail: string;
  desktopThumbnail: string;
  contentComposition: string;
  accessMethod: string;
  recommendedFor: string;
  description: string;
  job: string;
  contentUrl?: string;
  contentFileUrl?: string;
  price: number;
  discount: number;
  priceType: 'CHARGE' | 'FREE';
  programTypeInfo: {
    classificationInfo: {
      programClassification: ProgramClassification;
    };
  }[];
  adminProgramTypeInfo: {
    classificationInfo: {
      programAdminClassification: ProgramAdminClassification;
    };
  }[];
};
