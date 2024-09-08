import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBlogTagQuery, useInfiniteBlogListQuery } from '../../../api/blog';
import { TagType } from '../../../api/blogSchema';
import BlogCard from '../../../components/common/blog/BlogCard';

const BlogHashtagListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isToggle, setIsToggle] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagType | null>(
    location.state as TagType,
  );
  const { data: tagListData = [], isLoading: tagListIsLoading } =
    useBlogTagQuery();
  const {
    data: blogListData,
    fetchNextPage,
    hasNextPage,
    isLoading: blogListIsLoading,
  } = useInfiniteBlogListQuery({
    tagId: selectedTag?.id,
    pageable: { page: 0, size: 5 },
  });

  console.log(blogListData);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedTag) {
      params.set('tagId', selectedTag.id.toString());
    } else {
      params.delete('tagId');
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedTag]);

  const handleTagClick = (tag: TagType) => {
    setSelectedTag(tag);
    setIsToggle(false);
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 flex-col items-center px-5 md:px-10">
      <div className="flex w-full flex-col items-center md:px-[100px] md:py-10">
        <div className="flex w-full flex-col items-center gap-y-8 py-8">
          <div className="flex w-full flex-col gap-y-5">
            <div className="flex items-center gap-x-2">
              <img
                src="/icons/x-close.svg"
                alt="hashtag"
                className="h-6 w-6 cursor-pointer"
                onClick={() => navigate(-1)}
              />
              <h2 className="text-small18 font-bold text-neutral-0">
                해시태그 검색
              </h2>
              <span className="text-small18 text-primary">
                {blogListData?.pages[0].pageInfo.totalElements}건
              </span>
            </div>
            <div className="relative flex flex-col">
              <div
                className="flex w-full cursor-pointer items-center justify-between rounded-full bg-primary-10 px-5 py-3 text-xsmall16 text-neutral-0"
                onClick={() => setIsToggle(!isToggle)}
              >
                {!selectedTag ? (
                  <span>전체</span>
                ) : (
                  <span className="blog_hashtag">#{selectedTag.title}</span>
                )}
                <img
                  src="/icons/Caret_Down_MD.svg"
                  alt="arrow-down"
                  className={`h-6 w-6 transition-all duration-150 ${isToggle ? 'rotate-180' : ''}`}
                />
              </div>
              <div
                className={`absolute bottom-[-10px] left-0 z-10 flex w-full translate-y-full flex-col overflow-y-scroll rounded-md transition-all duration-150 ${isToggle ? 'max-h-96' : 'max-h-0'}`}
              >
                {tagListIsLoading ? (
                  <div className="w-full bg-neutral-90 px-4 py-[14px] text-xsmall16 text-primary">
                    로딩중입니다.
                  </div>
                ) : (
                  tagListData.map((tag) => (
                    <div
                      key={tag.id}
                      className="w-full cursor-pointer bg-neutral-90 px-4 py-[14px] text-xsmall16 text-primary"
                      onClick={() => handleTagClick(tag)}
                    >
                      #{tag.title}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <InfiniteScroll
            className="w-full flex-1 gap-y-8"
            hasMore={hasNextPage}
            loadMore={() => {
              fetchNextPage();
            }}
          >
            {blogListIsLoading ? (
              <div className="w-full py-6 text-center">
                블로그를 가져오는 중입니다..
              </div>
            ) : (
              <div className="flex w-full flex-wrap gap-4">
                {!blogListData || blogListData.pages[0].blogInfos.length < 1 ? (
                  <div className="w-full py-6 text-center text-neutral-40">
                    등록된 글이 없습니다.
                  </div>
                ) : (
                  blogListData.pages.map((page, pageIdx) =>
                    page.blogInfos?.map((blogInfo, blogIdx) => (
                      <React.Fragment key={blogInfo.blogThumbnailInfo.id}>
                        <BlogCard
                          key={blogInfo.blogThumbnailInfo.id}
                          blogInfo={blogInfo}
                          setSelectedTag={setSelectedTag}
                        />
                        {!(
                          pageIdx === blogListData.pages.length - 1 &&
                          blogIdx === page.blogInfos.length - 1
                        ) && (
                          <hr className="h-0.5 w-full border-t border-neutral-80" />
                        )}
                      </React.Fragment>
                    )),
                  )
                )}
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default BlogHashtagListPage;
