import { BlogQueryParams } from '@/api/blog';
import { blogListSchema, BlogSchema, blogSchema } from '@/api/blogSchema';
import LexicalContent from '@/components/common/blog/LexicalContent';
import RecommendBlogCard from '@/components/common/blog/RecommendBlogCard';
import { blogCategory } from '@/utils/convert';
import { getBlogPathname, getBlogTitle } from '@/utils/url';
import BlogCTA from '@components/common/blog/BlogCTA';
import BlogHashtag from '@components/common/blog/BlogHashtag';
import BlogHomeButton from '@components/common/blog/BlogHomeButton';
import BlogRating from '@components/common/blog/BlogRating';
import BlogShareSection from '@components/common/blog/BlogShareSection';
import dayjs from 'dayjs';
import { Metadata } from 'next';

const mockBlog: BlogSchema = {
  blogDetailInfo: {
    id: 0,
    title: '로딩중...',
    description: '',
    content: '{"root":{"children":[]}}',
    displayDate: dayjs(),
    createDate: dayjs(),
    lastModifiedDate: dayjs(),
    thumbnail: '',
  },
  tagDetailInfos: [],
};

// Fetching 블로그 데이터
const fetchBlogData = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/blog/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch blog data');
  }

  const data = await res.json();
  return blogSchema.parse(data.data);
};

// Fetching 추천 블로그 데이터
const fetchRecommendBlogData = async ({ pageable, type }: BlogQueryParams) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/blog?type=${type}&page=${pageable.page}&size=${pageable.size}`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch recommend blog data');
  }

  const data = await res.json();

  return blogListSchema.parse(data.data);
};

// SSR 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blog = await fetchBlogData(id);

  return {
    title: getBlogTitle(blog.blogDetailInfo),
    description: blog.blogDetailInfo.description,
    openGraph: {
      title: blog.blogDetailInfo.title || undefined,
      description: blog.blogDetailInfo.description || undefined,
      images: [
        {
          url: blog.blogDetailInfo.thumbnail || '',
          width: 800,
          height: 600,
          alt: 'Blog Thumbnail',
        },
      ],
    },
  };
}

const BlogDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const blog = (await fetchBlogData(id).catch(() => mockBlog)) || mockBlog;
  const recommendData = await fetchRecommendBlogData({
    type: blog?.blogDetailInfo.category,
    pageable: { page: 0, size: 4 },
  });

  console.log('Blog data:', blog);
  console.log('Recommend data:', recommendData);

  return (
    <div className="flex flex-col items-center flex-1 w-full mx-auto">
      <div className="flex w-full max-w-[1200px] flex-col items-center px-5 md:px-10 md:pt-10">
        <div className="flex w-full flex-col items-center gap-y-8 pt-8 md:px-[100px] md:pt-8">
          <div className="flex flex-col w-full py-3 gap-y-3">
            <h2 className="w-full text-xl font-bold text-primary">
              {blogCategory[blog.blogDetailInfo.category || '']}
            </h2>
            <div className="flex flex-col w-full gap-y-5">
              <div className="flex flex-col w-full gap-y-4">
                <h1 className="font-bold line-clamp-4 text-xlarge28 text-neutral-0">
                  {blog.blogDetailInfo.title}{' '}
                  {!blog.blogDetailInfo.isDisplayed && (
                    <span className="text-xsmall14 text-system-error">
                      (비공개)
                    </span>
                  )}
                </h1>
                {blog.blogDetailInfo.displayDate ? (
                  <p>
                    {dayjs(blog.blogDetailInfo.displayDate).format(
                      'YYYY년 MM월 DD일',
                    )}
                  </p>
                ) : null}
              </div>
              <img
                className="h-[218px] w-full rounded-md object-cover md:h-[484px] lg:h-[627px]"
                src={blog.blogDetailInfo.thumbnail || ''}
                alt="thumbnail"
              />
            </div>
          </div>
          <div className="w-full break-all text-xsmall16">
            <LexicalContent
              node={JSON.parse(blog.blogDetailInfo?.content || '{}')?.root}
            />
          </div>
          <div className="flex items-center justify-center w-full py-10 gap-x-3">
            <div className="flex items-center justify-center rounded-full border border-primary-20 p-[9px]">
              <img
                className="h-[36px] w-[36px]"
                src="/logo/logo-gradient.svg"
                alt="author"
              />
            </div>
            <div className="flex flex-col flex-1 text-neutral-0">
              <h3 className="font-bold text-small18">렛츠커리어</h3>
              <p className="text-xsmall16">커리어의 첫걸음을 함께 해요</p>
            </div>
          </div>
          <BlogRating blogId={blog.blogDetailInfo.id} />
          <div className="flex flex-wrap items-center w-full gap-1 py-3">
            {blog.tagDetailInfos.map((tag) => (
              <BlogHashtag key={tag.id} text={tag.title || ''} tagId={tag.id} />
            ))}
          </div>
          <div className="flex items-center w-full py-5">
            <hr className="w-full bg-neutral-60" />
          </div>
          <BlogShareSection
            title={blog.blogDetailInfo.title || ''}
            description={
              blog.blogDetailInfo.description?.substring(0, 30) + '...' || ''
            }
            thumbnail={blog.blogDetailInfo.thumbnail || ''}
            pathname={getBlogPathname(blog.blogDetailInfo)}
          />
          <BlogHomeButton />
        </div>
      </div>
      <div className="mt-8 flex w-full flex-col items-center bg-neutral-100 py-10 md:py-[60px] md:pb-10">
        <div className="flex w-full max-w-[1200px] flex-col px-5 md:px-10">
          <div className="flex w-full flex-col items-center md:px-[100px]">
            <div className="flex flex-col w-full gap-y-5">
              <h3 className="text-xl font-semibold">함께 읽어보면 좋아요</h3>
              <div className="flex flex-col w-full blog_recommend gap-y-5">
                {!recommendData ? (
                  <div className="w-full text-center">
                    추천 글을 찾을 수 없습니다.
                  </div>
                ) : (
                  recommendData.blogInfos
                    .filter(
                      (recommend) =>
                        recommend.blogThumbnailInfo.id !==
                        blog.blogDetailInfo.id,
                    )
                    .map((blog) => (
                      <RecommendBlogCard
                        key={blog.blogThumbnailInfo.id}
                        {...blog}
                      />
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {blog.blogDetailInfo.ctaText && blog.blogDetailInfo.ctaLink && (
        <BlogCTA
          ctaText={blog.blogDetailInfo.ctaText}
          ctaLink={blog.blogDetailInfo.ctaLink}
        />
      )}
    </div>
  );
};

export default BlogDetailPage;
