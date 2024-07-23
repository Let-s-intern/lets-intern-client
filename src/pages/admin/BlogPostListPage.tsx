import clsx from 'clsx';
import dayjs from 'dayjs';
import { CiTrash } from 'react-icons/ci';
import { Link } from 'react-router-dom';

import { blogCategory } from '../../utils/convert';

const mock = {
  blogInfos: [
    {
      blogThumbnailInfo: {
        id: 0,
        title: '근로조건의 기준은 인간의 존엄성을 보장하도록',
        category: 'JOB_PREPARATION_TIPS',
        thumbnail: 'string',
        description:
          '근로조건의 기준은 인간의 존엄성을 보장하도록 법률로 정한다. 국가는 모성의 보호를 위하여 노력하여야 한다. 선거운동은 각급 선거관리위원회의 관리하에 법률이 정하는 범위안에서 하되, 균등한 기회가 보장되어야 한다.',
        displayDate: '2024-07-22T06:26:29.722Z',
        createDate: '2024-07-22T06:26:29.722Z',
        lastModifiedDate: '2024-07-22T06:26:29.722Z',
      },
    },
    {
      blogThumbnailInfo: {
        id: 1,
        title: '선거운동은 각급 선거관리위원회의',
        category: 'PROGRAM_REVIEWS',
        thumbnail: 'string',
        description:
          '근로조건의 기준은 인간의 존엄성을 보장하도록 법률로 정한다. 국가는 모성의 보호를 위하여 노력하여야 한다. 선거운동은 각급 선거관리위원회의 관리하에 법률이 정하는 범위안에서 하되, 균등한 기회가 보장되어야 한다.',
        displayDate: '2024-07-22T06:26:29.722Z',
        createDate: '2024-07-22T06:26:29.722Z',
        lastModifiedDate: '2024-07-22T06:26:29.722Z',
      },
    },
    {
      blogThumbnailInfo: {
        id: 2,
        title: '불가피한 사정으로 발생하는 농지의 임대차와 위탁경영은',
        category: 'JUNIOR_STORIES',
        thumbnail: 'string',
        description:
          '근로조건의 기준은 인간의 존엄성을 보장하도록 법률로 정한다. 국가는 모성의 보호를 위하여 노력하여야 한다. 선거운동은 각급 선거관리위원회의 관리하에 법률이 정하는 범위안에서 하되, 균등한 기회가 보장되어야 한다.',
        displayDate: '2024-07-22T06:26:29.722Z',
        createDate: '2024-07-22T06:26:29.722Z',
        lastModifiedDate: '2024-07-22T06:26:29.722Z',
      },
    },
  ],
};

const blogColumnWidth = {
  displayDate: 'w-40',
  category: 'w-40',
  title: 'flex-1',
  isVisible: 'w-32',
  management: 'w-52',
  status: 'w-40',
};

const BlogPostListPage = () => {
  // const { data, isLoading } = useBlogQuery({ pageable: { page: 1, size: 10 } });
  const data = mock.blogInfos;

  return (
    <div className="px-12 pt-12">
      <header className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-semibold">블로그</h1>
        <Link
          to="/admin/blog/create"
          className="rounded-xxs border border-zinc-600 bg-white px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
        >
          등록
        </Link>
      </header>
      <main>
        <div className="mt-3 min-w-[60rem]">
          <div className="flex rounded-sm bg-[#E5E5E5]">
            <div
              className={clsx(
                'flex justify-center py-2 text-sm font-medium text-[#717179]',
                blogColumnWidth.displayDate,
              )}
            >
              게시일자
            </div>
            <div
              className={clsx(
                'flex justify-center py-2 text-sm font-medium text-[#717179]',
                blogColumnWidth.category,
              )}
            >
              카테고리
            </div>
            <div
              className={clsx(
                'flex justify-center py-2 text-sm font-medium text-[#717179]',
                blogColumnWidth.title,
              )}
            >
              제목
            </div>
            <div
              className={clsx(
                'flex justify-center py-2 text-sm font-medium text-[#717179]',
                blogColumnWidth.isVisible,
              )}
            >
              노출여부
            </div>
            <div
              className={clsx(
                'flex justify-center py-2 text-sm font-medium text-[#717179]',
                blogColumnWidth.management,
              )}
            >
              관리
            </div>
            <div
              className={clsx(
                'flex justify-center py-2 text-sm font-medium text-[#717179]',
                blogColumnWidth.status,
              )}
            >
              상태
            </div>
          </div>
          {data.length === 0 ? (
            <div className="py-6 text-center">개설된 블로그가 없습니다.</div>
          ) : (
            <div className="mb-16 mt-3 flex flex-col gap-2">
              {data.map((blogInfo) => (
                <div
                  key={blogInfo.blogThumbnailInfo.id}
                  className="flex rounded-md border border-neutral-200"
                >
                  <div
                    className={clsx(
                      'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
                      blogColumnWidth.displayDate,
                    )}
                  >
                    {dayjs(blogInfo.blogThumbnailInfo.displayDate).format(
                      'YYYY년 M월 D일',
                    )}
                  </div>
                  <div
                    className={clsx(
                      'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
                      blogColumnWidth.category,
                    )}
                  >
                    {blogCategory[blogInfo.blogThumbnailInfo.category]}
                  </div>
                  <div
                    className={clsx(
                      'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
                      blogColumnWidth.title,
                    )}
                  >
                    {blogInfo.blogThumbnailInfo.title}
                  </div>
                  <div
                    className={clsx(
                      'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
                      blogColumnWidth.isVisible,
                    )}
                  >
                    <input type="checkbox" />
                  </div>
                  <div
                    className={clsx(
                      'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
                      blogColumnWidth.management,
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Link to={''}>
                        <i>
                          <img src="/icons/edit-icon.svg" alt="수정 아이콘" />
                        </i>
                      </Link>
                      <button onClick={() => console.log('블로그 삭제')}>
                        <i className="text-[1.75rem]">
                          <CiTrash />
                        </i>
                      </button>
                    </div>
                  </div>
                  <div
                    className={clsx(
                      'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
                      blogColumnWidth.status,
                    )}
                  >
                    임시저장
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogPostListPage;
