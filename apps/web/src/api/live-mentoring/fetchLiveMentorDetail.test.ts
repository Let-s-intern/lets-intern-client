import { fetchLiveMentorDetail } from './fetchLiveMentorDetail';

const mockFetch = (response: Partial<Response>) => {
  global.fetch = jest.fn().mockResolvedValue(response) as jest.Mock;
};

describe('fetchLiveMentorDetail', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('없는 멘토(404)는 null 을 준다', async () => {
    mockFetch({ ok: false, status: 404 });
    await expect(fetchLiveMentorDetail('99999')).resolves.toBeNull();
  });

  it('5xx 는 던진다', async () => {
    mockFetch({ ok: false, status: 500 });
    await expect(fetchLiveMentorDetail('1')).rejects.toThrow('500');
  });

  it('스키마가 맞지 않으면 던진다', async () => {
    mockFetch({
      ok: true,
      status: 200,
      json: async () => ({ data: { mentorId: 'x' } }),
    });
    await expect(fetchLiveMentorDetail('1')).rejects.toThrow();
  });
});
