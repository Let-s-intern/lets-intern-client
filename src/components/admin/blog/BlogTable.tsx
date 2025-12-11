'use client';

import clsx from 'clsx';
import { CiTrash } from 'react-icons/ci';

import dayjs from '@/lib/dayjs';
import Link from 'next/link';
import { ChangeEvent, useCallback, useState } from 'react';
import {
  useBlogListQuery,
  useDeleteBlogMutation,
  usePatchBlogMutation,
} from '../../../api/blog';
import { BlogThumbnail, PatchBlogReqBody } from '../../../api/blogSchema';
import MuiPagination from '../../../domain/program/pagination/MuiPagination';
import { blogCategory } from '../../../utils/convert';

const blogColumnWidth = {
  id: 'w-20',
  displayDate: 'w-40',
  category: 'w-40',
  title: 'flex-1',
  isVisible: 'w-32',
  management: 'w-52',
  status: 'w-40',
};
const initialPageable = { page: 1, size: 10 };
const initialPageInfo = {
  pageNum: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
};

export default function BlogTable() {
  const [pageable, setPageable] = useState(initialPageable);

  const { data, isLoading } = useBlogListQuery({
    pageable,
  });
  const deleteBlogMutation = useDeleteBlogMutation();
  const patchBlogMutation = usePatchBlogMutation();

  const deleteBlog = (blogId: number) => {
    const isDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (isDelete) {
      deleteBlogMutation.mutate(blogId);
    }
  };

  const handleCheck = (
    event: ChangeEvent<HTMLInputElement>,
    checkedBlog: BlogThumbnail,
  ) => {
    if (event.target.checked) {
      const reqBody: PatchBlogReqBody = {
        id: checkedBlog.id,
        isDisplayed: true,
        displayDate: checkedBlog.displayDate
          ? dayjs(checkedBlog.displayDate).format('YYYY-MM-DDTHH:mm')
          : dayjs().format('YYYY-MM-DDTHH:mm'),
      };
      patchBlogMutation.mutate(reqBody);
    } else {
      const reqBody: PatchBlogReqBody = {
        id: checkedBlog.id,
        isDisplayed: false,
      };
      patchBlogMutation.mutate(reqBody);
    }
  };

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      setPageable((prev) => ({ ...prev, page }));
      window.scrollTo(0, 0);
    },
    [],
  );

  return (
    <div className="mt-3 min-w-[60rem]">
      {/* TableHeader */}
      <div className="flex rounded-sm bg-[#E5E5E5]">
        <TableHeaderCell widthClassName={blogColumnWidth.id}>
          id
        </TableHeaderCell>
        <TableHeaderCell widthClassName={blogColumnWidth.displayDate}>
          게시일자
        </TableHeaderCell>
        <TableHeaderCell widthClassName={blogColumnWidth.category}>
          카테고리
        </TableHeaderCell>
        <TableHeaderCell widthClassName={blogColumnWidth.title}>
          제목
        </TableHeaderCell>
        <TableHeaderCell widthClassName={blogColumnWidth.isVisible}>
          노출여부
        </TableHeaderCell>
        <TableHeaderCell widthClassName={blogColumnWidth.status}>
          상태
        </TableHeaderCell>
        <TableHeaderCell widthClassName={blogColumnWidth.management}>
          관리
        </TableHeaderCell>
      </div>

      {/* TableBody */}
      {isLoading ? (
        <div className="py-6 text-center">블로그를 가져오는 중입니다..</div>
      ) : data?.blogInfos.length === 0 ? (
        <div className="py-6 text-center">개설된 블로그가 없습니다.</div>
      ) : (
        <div className="mb-16 mt-3 flex flex-col gap-2">
          {data?.blogInfos.map((blogInfo) => (
            <div
              key={blogInfo.blogThumbnailInfo.id}
              className="flex rounded-md border border-neutral-200"
            >
              <TableBodyCell widthClassName={blogColumnWidth.id}>
                <Link
                  href={`/blog/${blogInfo.blogThumbnailInfo.id}`}
                  className="underline"
                >
                  {blogInfo.blogThumbnailInfo.id}
                </Link>
              </TableBodyCell>
              <TableBodyCell widthClassName={blogColumnWidth.displayDate}>
                {blogInfo.blogThumbnailInfo.displayDate
                  ? dayjs(blogInfo.blogThumbnailInfo.displayDate).format(
                      'YYYY년 M월 D일',
                    )
                  : null}
              </TableBodyCell>
              <TableBodyCell widthClassName={blogColumnWidth.category}>
                {blogCategory[blogInfo.blogThumbnailInfo.category!]}
              </TableBodyCell>
              <TableBodyCell widthClassName={blogColumnWidth.title}>
                {blogInfo.blogThumbnailInfo.title}
              </TableBodyCell>
              <TableBodyCell widthClassName={blogColumnWidth.isVisible}>
                <input
                  type="checkbox"
                  data-blog-id={blogInfo.blogThumbnailInfo.id}
                  checked={blogInfo.blogThumbnailInfo.isDisplayed!}
                  onChange={(event) =>
                    handleCheck(
                      event,
                      blogInfo.blogThumbnailInfo as BlogThumbnail,
                    )
                  }
                />
              </TableBodyCell>
              <TableBodyCell widthClassName={blogColumnWidth.status}>
                {blogInfo.blogThumbnailInfo.isDisplayed ? '발행' : '임시저장'}
              </TableBodyCell>
              <TableBodyCell widthClassName={blogColumnWidth.management}>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/blog/edit/${blogInfo.blogThumbnailInfo.id}`}
                  >
                    <i>
                      <img src="/icons/edit-icon.svg" alt="수정 아이콘" />
                    </i>
                  </Link>
                  <button
                    onClick={() => deleteBlog(blogInfo.blogThumbnailInfo.id)}
                  >
                    <i className="text-[1.75rem]">
                      <CiTrash />
                    </i>
                  </button>
                </div>
              </TableBodyCell>
            </div>
          ))}
        </div>
      )}

      <div className="flex">
        <MuiPagination
          page={pageable.page}
          pageInfo={data?.pageInfo || initialPageInfo}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

interface TableHeaderCellProps {
  widthClassName: string;
  children: React.ReactNode;
}

function TableHeaderCell({ widthClassName, children }: TableHeaderCellProps) {
  return (
    <div
      className={clsx(
        'flex justify-center py-2 text-sm font-medium text-[#717179]',
        widthClassName,
      )}
    >
      {children}
    </div>
  );
}

interface TableBodyCellProps {
  widthClassName: string;
  children: React.ReactNode;
}

function TableBodyCell({ widthClassName, children }: TableBodyCellProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
        widthClassName,
      )}
    >
      {children}
    </div>
  );
}
