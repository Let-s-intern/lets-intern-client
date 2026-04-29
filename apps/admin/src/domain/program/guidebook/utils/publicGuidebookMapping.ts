import type { PublicGuidebookSchema } from '@/schema';

export interface GuidebookPublicViewModel {
  id: number;
  title: string;
  shortDesc: string | null;
  thumbnail: string | null;
  desktopThumbnail: string | null;
  contentComposition: string | null;
  accessMethod: string | null;
  recommendedFor: string | null;
  description: string | null;
  price: number;
  discount: number;
}

export const mapPublicGuidebook = (
  data: PublicGuidebookSchema,
): GuidebookPublicViewModel => {
  const originalPrice = data.priceInfo?.originalPrice ?? 0;
  const finalPrice = data.priceInfo?.finalPrice ?? 0;

  const hasValidPrice =
    originalPrice > 0 && finalPrice >= 0 && finalPrice <= originalPrice;

  const discountPrice = hasValidPrice ? originalPrice - finalPrice : 0;

  return {
    id: data.id,
    title: data.title ?? '',
    shortDesc: data.shortDesc ?? null,
    thumbnail: data.thumbnail ?? null,
    desktopThumbnail: data.desktopThumbnail ?? null,
    contentComposition: data.contentComposition ?? null,
    accessMethod: data.accessMethod ?? null,
    recommendedFor: data.recommendedFor ?? null,
    description: data.description ?? null,
    price: originalPrice,
    discount: discountPrice,
  };
};
