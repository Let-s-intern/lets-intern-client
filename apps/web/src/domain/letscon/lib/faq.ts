import type { Faq } from '@/schema';

// 서버 쿼리에 정렬이 없어 등록 순서인 id 로 정렬한다
export const sortFaqsById = (faqs: Faq[] = []) =>
  [...faqs].sort((a, b) => a.id - b.id);
