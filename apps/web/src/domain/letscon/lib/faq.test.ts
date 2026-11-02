import { getAnchorTabs } from './anchorTabs';
import { sortFaqsById } from './faq';

describe('sortFaqsById', () => {
  it('id 오름차순으로 정렬하고 원본은 바꾸지 않는다', () => {
    const faqs = [{ id: 3 }, { id: 1 }, { id: 2 }];

    expect(sortFaqsById(faqs).map((faq) => faq.id)).toEqual([1, 2, 3]);
    expect(faqs.map((faq) => faq.id)).toEqual([3, 1, 2]);
  });

  it('빈 FAQ 와 아직 받지 못한 FAQ 는 빈 배열이다', () => {
    expect(sortFaqsById([])).toEqual([]);
    expect(sortFaqsById(undefined)).toEqual([]);
  });
});

describe('getAnchorTabs', () => {
  it('FAQ 가 있으면 다섯 탭을 모두 보여준다', () => {
    expect(getAnchorTabs(true).map((tab) => tab.label)).toEqual([
      '소개',
      '라인업',
      '신청',
      '오프라인 혜택',
      'FAQ',
    ]);
  });

  it('FAQ 가 비면 FAQ 탭을 뺀다', () => {
    expect(getAnchorTabs(false).map((tab) => tab.label)).toEqual([
      '소개',
      '라인업',
      '신청',
      '오프라인 혜택',
    ]);
  });
});
