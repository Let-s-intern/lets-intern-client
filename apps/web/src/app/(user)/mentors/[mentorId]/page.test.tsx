const mockFetchDetail = jest.fn();
jest.mock('@/api/live-mentoring/fetchLiveMentorDetail', () => ({
  fetchLiveMentorDetail: (...args: unknown[]) => mockFetchDetail(...args),
}));
jest.mock('@/domain/mentors/mentor-detail/MentorDetailPage', () => () => null);

import { generateMetadata } from './page';

const params = (mentorId: string) => ({
  params: Promise.resolve({ mentorId }),
});

beforeEach(() => {
  mockFetchDetail.mockReset();
  process.env.NEXT_PUBLIC_SITE_URL = 'https://www.letscareer.co.kr';
});

describe('/mentors/[mentorId] 메타데이터', () => {
  it('라이브 멘토링이 있으면 canonical 이 /live-mentoring/{id} 다', async () => {
    mockFetchDetail.mockResolvedValue({ mentorId: 19962 });
    const metadata = await generateMetadata(params('19962'));
    expect(metadata.alternates?.canonical).toBe(
      'https://www.letscareer.co.kr/live-mentoring/19962',
    );
  });

  it('라이브 멘토링이 없으면 자기 주소가 canonical 이다', async () => {
    mockFetchDetail.mockResolvedValue(null);
    const metadata = await generateMetadata(params('7'));
    expect(metadata.alternates?.canonical).toBe(
      'https://www.letscareer.co.kr/mentors/7',
    );
  });
});
