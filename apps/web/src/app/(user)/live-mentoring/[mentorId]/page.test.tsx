const mockFetchDetail = jest.fn();
jest.mock('@/api/live-mentoring/fetchLiveMentorDetail', () => ({
  fetchLiveMentorDetail: (...args: unknown[]) => mockFetchDetail(...args),
}));
const mockNotFound = jest.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});
jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}));
// 메타데이터만 본다. 화면 컴포넌트는 불러오지 않는다
jest.mock(
  '@/domain/live-mentoring/detail/LiveMentoringDetailPage',
  () => () => null,
);

import Page, { generateMetadata } from './page';

const mentor = {
  title: '현직 마케팅팀장의 1:1 피드백',
  thumbnail: 'https://example.com/t.png',
  categories: ['PERSONAL_STATEMENT'],
  durations: [30],
  durationPrices: [{ durationPriceId: 1, duration: 30, price: 39000 }],
  price: 39000,
  profile: { nickname: '올리브' },
  template: { intro: { affiliation: 'CJ 올리브영 | 온사이트마케터' } },
};

const params = (mentorId: string) => ({
  params: Promise.resolve({ mentorId }),
});

beforeEach(() => {
  mockFetchDetail.mockReset();
  mockNotFound.mockClear();
  process.env.NEXT_PUBLIC_SITE_URL = 'https://www.letscareer.co.kr';
});

describe('/live-mentoring/[mentorId] 페이지', () => {
  it('canonical 은 쿼리스트링과 끝 슬래시 없는 한 주소다', async () => {
    mockFetchDetail.mockResolvedValue(mentor);

    const metadata = await generateMetadata(params('99'));

    expect(metadata.alternates?.canonical).toBe(
      'https://www.letscareer.co.kr/live-mentoring/99',
    );
    expect(metadata.openGraph?.url).toBe(
      'https://www.letscareer.co.kr/live-mentoring/99',
    );
    expect(String(metadata.title)).toContain('CJ 올리브영 온사이트마케터');
    expect(metadata.description).toContain('자기소개서 첨삭');
  });

  it('없는 멘토는 메타를 비우고 페이지는 404 를 낸다', async () => {
    mockFetchDetail.mockResolvedValue(null);

    await expect(generateMetadata(params('99999'))).resolves.toEqual({});
    await expect(Page(params('99999'))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalled();
  });
});
