import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { useBlogListQuery } from '../../../api/blog';
import { BlogRating, blogRatingSchema } from '../../../api/blogSchema';
import axios from '../../../utils/axios';
import { blogCategory } from '../../../utils/convert';

const ratingColumnWidth = {
  createdDate: 'w-32',
  category: 'w-30',
  title: 'flex-1',
  score: 'w-40',
  content: 'w-40',
};

const pageable = { page: 1, size: 10000 };

interface BlogRatingWithCategory extends BlogRating {
  category?: string | null;
}

export default function BlogRatingTable() {
  const [ratingList, setRatingList] = useState<BlogRatingWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: blogData } = useBlogListQuery({ pageable });

  useEffect(() => {
    // 각 블로그 id로 별점 조회하여 ratingList에 저장
    // 블로그 카테고리 함께 저장
    const getRatingList = async (blogId: number) => {
      const res = await axios.get(`/blog-rating/${blogId}`);
      return blogRatingSchema.parse(res.data.data).ratingInfos;
    };

    if (!blogData) return;
    for (const blogInfo of blogData.blogInfos) {
      const { id, category } = blogInfo.blogThumbnailInfo;

      getRatingList(id).then((ratingInfos) => {
        const ratingListWithCategory = ratingInfos.map(
          (ratingInfo: BlogRating) => ({ ...ratingInfo, category }),
        );
        setRatingList((prev) => [...prev, ...ratingListWithCategory]);
        setIsLoading(false);
      });
    }
  }, [blogData]);

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
          <span>로딩 중...</span>
        ) : ratingList.length === 0 ? (
          <span>작성된 후기가 없습니다.</span>
        ) : (
          ratingList.map((rating) => (
            <div
              key={rating.id}
              className="flex rounded-md border border-neutral-200"
            >
              <TableBodyCell widthClassName={ratingColumnWidth.createdDate}>
                {rating.createDate?.format('YYYY년 M월 D일')}
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
