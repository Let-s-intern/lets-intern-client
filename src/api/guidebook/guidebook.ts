import type { GuidebookData } from '@/schema';

// UI 개발용
export async function fetchGuidebookData(id: string): Promise<GuidebookData> {
  void id;
  return {
    title: '가이드북 제목',
    description: '가이드북 설명',
    thumbnailDesktop: null,
    thumbnailMobile: null,
    contentStructure: '자료 구성 내용',
    accessMethod: '가이드북 열람 방식',
    recommendedFor: '가이드북 추천 대상',
    isVisible: null,
    priceInfo: {
      priceId: 1,
      priceType: null,
      price: 10000,
      discount: 1000,
    },
  };
}
