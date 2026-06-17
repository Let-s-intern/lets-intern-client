import {
  BlogType,
  blogBannerListQueryOptions,
  blogListQueryOptions,
} from './blog';

describe('blogListQueryOptions', () => {
  it('queryKey에 pageable과 types를 포함한다', () => {
    const options = blogListQueryOptions({
      pageable: { page: 1, size: 10 },
      types: null,
    });

    expect(options.queryKey).toEqual([
      'BlogListQueryKey',
      { page: 1, size: 10 },
      null,
    ]);
    expect(typeof options.queryFn).toBe('function');
  });

  it('types가 전달되면 queryKey에 반영된다', () => {
    const options = blogListQueryOptions({
      pageable: { page: 2, size: 8 },
      types: [BlogType.JOB_PREPARATION_TIPS, BlogType.CAREER_STORIES],
    });

    expect(options.queryKey[2]).toEqual([
      'JOB_PREPARATION_TIPS',
      'CAREER_STORIES',
    ]);
  });
});

describe('blogBannerListQueryOptions', () => {
  it('queryKey에 pageable을 포함한다', () => {
    const options = blogBannerListQueryOptions({ page: 1, size: 2 });

    expect(options.queryKey).toEqual([
      'useGetBlogBannerList',
      { page: 1, size: 2 },
    ]);
    expect(typeof options.queryFn).toBe('function');
  });
});
