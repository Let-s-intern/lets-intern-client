'use client';

import clsx from 'clsx';
import { useCallback, useState } from 'react';

import dayjs from '@/lib/dayjs';
import { useBlogRatingListQuery } from '../../../api/blog';
import { blogCategory } from '../../../utils/convert';
import MuiPagination from '../../program/pagination/MuiPagination';

const ratingColumnWidth = {
  createdDate: 'w-32',
  category: 'w-32',
  title: 'w-60',
  score: 'w-40',
  content: 'flex-1',
};
const initialPageable = { page: 1, size: 10 };
const initialPageInfo = {
  pageNum: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
};

export default function BlogRatingTable() {
  const [pageable, setPageable] = useState(initialPageable);

  const { data, isLoading } = useBlogRatingListQuery(pageable);

  const onChangePage = useCallback(
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
        <TableHeaderCell widthClassName={ratingColumnWidth.createdDate}>
          등록일자
        </TableHeaderCell>
        <TableHeaderCell widthClassName={ratingColumnWidth.category}>
          카테고리
        </TableHeaderCell>
        <TableHeaderCell widthClassName={ratingColumnWidth.title}>
          제목
        </TableHeaderCell>
        <TableHeaderCell widthClassName={ratingColumnWidth.score}>
          만족도
        </TableHeaderCell>
        <TableHeaderCell widthClassName={ratingColumnWidth.content}>
          후기 답변
        </TableHeaderCell>
      </div>

      {/* TableBody */}
      <div className="mb-16 mt-3 flex flex-col gap-2">
        {isLoading ? (
          <></>
        ) : data?.ratingInfos.length === 0 ? (
          <span>작성된 후기가 없습니다.</span>
        ) : (
          data?.ratingInfos.map((rating) => (
            <div
              key={rating.id}
              className="flex rounded-md border border-neutral-200"
            >
              <TableBodyCell widthClassName={ratingColumnWidth.createdDate}>
                {rating.createDate
                  ? dayjs(rating.createDate).format('YYYY년 M월 D일')
                  : null}
              </TableBodyCell>
              <TableBodyCell widthClassName={ratingColumnWidth.category}>
                {blogCategory[rating.category!]}
              </TableBodyCell>
              <TableBodyCell widthClassName={ratingColumnWidth.title}>
                {rating.title}
              </TableBodyCell>
              <TableBodyCell widthClassName={ratingColumnWidth.score}>
                {rating.score}점
              </TableBodyCell>
              <TableBodyCell widthClassName={ratingColumnWidth.content}>
                {rating.content}
              </TableBodyCell>
            </div>
          ))
        )}
      </div>

      <div className="flex">
        <MuiPagination
          page={pageable.page}
          pageInfo={data?.pageInfo || initialPageInfo}
          onChange={onChangePage}
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
