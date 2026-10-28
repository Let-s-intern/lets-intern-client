import { notFound } from 'next/navigation';

import Layout from './layout';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

const render = (slug: string) =>
  Layout({ children: 'child', params: Promise.resolve({ slug }) });

describe('/form/[slug] layout', () => {
  beforeEach(() => jest.clearAllMocks());

  it('유효한 slug 면 children 을 그대로 그린다', async () => {
    await expect(render('portfolio-1115')).resolves.toBe('child');
    expect(notFound).not.toHaveBeenCalled();
  });

  it('유효하지 않은 slug 면 notFound 를 부른다', async () => {
    await expect(render('..%2Fadmin')).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
