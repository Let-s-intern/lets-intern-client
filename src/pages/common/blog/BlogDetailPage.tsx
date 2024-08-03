import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useBlogListTypeQuery,
  useBlogQuery,
  usePostBlogRatingMutation,
} from '../../../api/blog';
import BlogHashtag from '../../../components/common/blog/BlogHashtag';
import LexicalContent from '../../../components/common/blog/LexicalContent';
import RecommendBlogCard from '../../../components/common/blog/RecommendBlogCard';
import { blogCategory } from '../../../utils/convert';

const BlogDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useBlogQuery(id || '');
  const [starRating, setStarRating] = useState<number | null>(null);
  const [formValue, setFormValue] = useState<string>('');
  const [isPostedRating, setIsPostedRating] = useState<boolean>(false);
  const {
    data: recommendData,
    isLoading: recommendIsLoading,
    isError: recommendIsError,
  } = useBlogListTypeQuery({
    type: data?.blogDetailInfo.category,
    pageable: { page: 0, size: 4 },
  });

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }
  }, []);

  const handleShareKakaoClick = () => {
    if (window.Kakao) {
      const kakao = window.Kakao;

      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: data?.blogDetailInfo.title,
          description:
            data?.blogDetailInfo.description?.substring(0, 30) + '...',
          imageUrl: data?.blogDetailInfo.thumbnail,
          link: {
            mobileWebUrl: `${window.location.origin}${location.pathname}`,
            webUrl: `${window.location.origin}${location.pathname}`,
          },
        },
        buttons: [
          {
            title: '글 확인하기',
            link: {
              mobileWebUrl: `${window.location.origin}${location.pathname}`,
              webUrl: `${window.location.origin}${location.pathname}`,
            },
          },
        ],
      });
    }
  };

  const { mutate: postRating } = usePostBlogRatingMutation({
    successCallback: () => {
      setIsPostedRating(true);
    },
  });

  const handlePostRating = () => {
    if (!id) return;

    if (!starRating) return;
    postRating({
      blogId: id,
      title: formValue,
      score: starRating,
    });
  };

  useEffect(() => {
    console.log('data.blogDetailInfo.content', data?.blogDetailInfo.content);
  }, [data?.blogDetailInfo.content]);

  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('클립보드에 복사되었습니다.');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mx-auto flex w-full flex-1 flex-col items-center">
      {!data ? (
        isLoading ? (
          <div className="w-full text-center">글을 가져오는 중입니다..</div>
        ) : (
          <div className="w-full text-center">글을 찾을 수 없습니다.</div>
        )
      ) : (
        <>
          <div className="flex w-full max-w-[1200px] flex-col items-center px-5 md:px-10 md:pt-10">
            <div className="flex w-full flex-col items-center gap-y-8 pt-8 md:px-[100px] md:pt-8">
              <div className="flex w-full flex-col gap-y-3 py-3">
                <h2 className="w-full text-xl font-bold text-primary">
                  {blogCategory[data.blogDetailInfo.category || '']}
                </h2>
                <div className="flex w-full flex-col gap-y-5">
                  <div className="flex w-full flex-col gap-y-4">
                    <h1 className="line-clamp-4 text-xlarge28 font-bold text-neutral-0">
                      {data.blogDetailInfo.title}
                    </h1>
                    <p>
                      {data.blogDetailInfo.lastModifiedDate?.format(
                        'YYYY년 MM월 DD일',
                      )}
                    </p>
                  </div>
                  <img
                    className="h-[218px] w-full rounded-md object-cover md:h-[484px] lg:h-[627px]"
                    src={data.blogDetailInfo.thumbnail || ''}
                    alt="thumbnail"
                  />
                </div>
              </div>
              <div className="w-full break-all text-xsmall16">
                <LexicalContent
                  node={
                    !data.blogDetailInfo.content
                      ? { type: 'root', children: [] }
                      : JSON.parse(data.blogDetailInfo.content)?.root
                  }
                />
              </div>
              <div className="flex w-full items-center justify-center gap-x-3 py-10">
                <div className="flex items-center justify-center rounded-full border border-primary-20 p-[9px]">
                  <img
                    className="h-[36px] w-[36px]"
                    src="/logo/logo-gradient.svg"
                    alt="author"
                  />
                </div>
                <div className="flex flex-1 flex-col text-neutral-0">
                  <h3 className="text-small18 font-bold">렛츠커리어</h3>
                  <p className="text-xsmall16">커리어의 첫걸음을 함께 해요</p>
                </div>
              </div>
              <div className="flex w-full flex-col gap-y-4">
                <div className="flex w-full flex-col items-center justify-center gap-y-3 rounded-md border-2 border-neutral-80 px-10 py-8">
                  <h3 className="text-xsmall16 font-bold text-black">
                    블로그 글은 어떠셨나요?
                  </h3>
                  <div className="flex items-center justify-center gap-x-2">
                    <img
                      className="h-6 w-6 cursor-pointer"
                      src={`/icons/star-${!starRating ? 'null' : starRating >= 1 ? 'fill' : 'unfill'}.svg`}
                      alt="star"
                      onClick={() => setStarRating(1)}
                    />
                    <img
                      className="h-6 w-6 cursor-pointer"
                      src={`/icons/star-${!starRating ? 'null' : starRating >= 2 ? 'fill' : 'unfill'}.svg`}
                      alt="star"
                      onClick={() => setStarRating(2)}
                    />
                    <img
                      className="h-6 w-6 cursor-pointer"
                      src={`/icons/star-${!starRating ? 'null' : starRating >= 3 ? 'fill' : 'unfill'}.svg`}
                      alt="star"
                      onClick={() => setStarRating(3)}
                    />
                    <img
                      className="h-6 w-6 cursor-pointer"
                      src={`/icons/star-${!starRating ? 'null' : starRating >= 4 ? 'fill' : 'unfill'}.svg`}
                      alt="star"
                      onClick={() => setStarRating(4)}
                    />
                    <img
                      className="h-6 w-6 cursor-pointer"
                      src={`/icons/star-${!starRating ? 'null' : starRating >= 5 ? 'fill' : 'unfill'}.svg`}
                      alt="star"
                      onClick={() => setStarRating(5)}
                    />
                  </div>
                </div>
                {starRating && (
                  <div className="flex w-full flex-col gap-y-3 rounded-md bg-primary-10 px-10 py-8">
                    <div className="flex w-full flex-col items-center justify-center gap-y-4">
                      <h3 className="text-xsmall16 font-bold text-primary">
                        더 필요한 콘텐츠가 있다면 알려주세요!
                      </h3>
                      <input
                        className={`w-full rounded-md border-none text-xsmall14 ${formValue.length === 0 ? 'bg-neutral-95' : 'bg-[#5177FF]/10'} p-3 outline-none placeholder:text-black/35`}
                        placeholder="예시. 포트폴리오 꿀팁, 영문레쥬메 작성방법"
                        value={formValue}
                        onChange={(e) => setFormValue(e.target.value)}
                      />
                    </div>
                    <button
                      className={`flex w-full items-center justify-center rounded-sm border-2 border-primary px-4 py-1.5 text-primary-dark ${formValue.length === 0 || isPostedRating ? 'cursor-not-allowed opacity-40' : ''}`}
                      onClick={handlePostRating}
                    >
                      {isPostedRating ? '제출완료' : '제출하기'}
                    </button>
                  </div>
                )}
              </div>
              <div className="flex w-full flex-wrap items-center gap-1 py-3">
                {data.tagDetailInfos.map((tag) => (
                  <BlogHashtag
                    key={tag.id}
                    text={tag.title || ''}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/blog/hashtag', { state: tag });
                    }}
                  />
                ))}
              </div>
              <div className="flex w-full items-center py-5">
                <hr className="w-full bg-neutral-60" />
              </div>
              <div className="flex w-full flex-col items-center gap-y-3 py-5">
                <p className="text-xsmall14 text-black">
                  나만 보기 아깝다면 공유하기
                </p>
                <div className="flex items-center gap-x-5">
                  <div
                    className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-primary-10"
                    onClick={() =>
                      handleCopyClipBoard(
                        `${window.location.origin}${location.pathname}`,
                      )
                    }
                  >
                    <img
                      src="/icons/link-01.svg"
                      alt="link"
                      className="h-4 w-4"
                    />
                  </div>
                  <div
                    className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-primary-10"
                    onClick={handleShareKakaoClick}
                  >
                    <img src="/icons/kakao_path.svg" alt="kakao" />
                  </div>
                </div>
              </div>
              <button
                className="rounded-full bg-neutral-90 px-6 py-5 font-bold text-neutral-0"
                onClick={() => navigate('/blog')}
              >
                블로그 홈
              </button>
            </div>
          </div>
          <div className="mt-8 flex w-full flex-col items-center bg-neutral-100 py-10 md:py-[60px] md:pb-10">
            <div className="flex w-full max-w-[1200px] flex-col px-5 md:px-10">
              <div className="flex w-full flex-col items-center md:px-[100px]">
                <div className="flex w-full flex-col gap-y-5 px-5">
                  <h3 className="text-xl font-semibold">
                    함께 읽어보면 좋아요
                  </h3>
                  <div className="flex w-full flex-col gap-y-5">
                    {!recommendData ? (
                      recommendIsLoading ? (
                        <div className="w-full text-center">
                          추천 글을 가져오는 중입니다..
                        </div>
                      ) : (
                        <div className="w-full text-center">
                          추천 글을 찾을 수 없습니다.
                        </div>
                      )
                    ) : (
                      recommendData.blogInfos
                        .filter(
                          (blog) =>
                            blog.blogThumbnailInfo.id !==
                            data.blogDetailInfo.id,
                        )
                        .slice(0, 3)
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
          {data.blogDetailInfo.ctaText && data.blogDetailInfo.ctaLink && (
            <div className="fixed bottom-0 left-0 flex w-full items-center justify-center bg-neutral-100 py-3 shadow-button">
              <div className="flex w-full max-w-[1200px] flex-col items-center px-5 md:px-10">
                <div className="flex w-full flex-col items-center md:px-[100px]">
                  <button
                    className="w-full rounded-md bg-primary px-6 py-3 text-small18 font-medium text-neutral-100"
                    onClick={() =>
                      window.open(data.blogDetailInfo.ctaLink || '', '_blank')
                    }
                  >
                    {data.blogDetailInfo.ctaText}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogDetailPage;
