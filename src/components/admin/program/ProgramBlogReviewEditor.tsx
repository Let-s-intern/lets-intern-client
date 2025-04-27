import { useBlogListQuery } from '@/api/blog';
import dayjs from '@/lib/dayjs';
import { ProgramBlogReview } from '@/types/interface';
import { blogCategory } from '@/utils/convert';
import Heading2 from '@components/admin/ui/heading/Heading2';
import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';

// 모달 스타일
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxHeight: '100vh', // 뷰포트 높이의 90%로 제한
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column', // 컨텐츠를 세로로 배치
};

// 헤더 스타일
const headerStyle = {
  p: 2,
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'space-between',
};

// 컨텐츠 스타일
const contentStyle = {
  flex: 1, // 남은 공간 차지
  overflow: 'auto', // 스크롤 활성화
};

// 푸터 스타일
const footerStyle = {
  p: 2,
  borderTop: 1,
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 1,
};

const ProgramBlogReviewEditor: React.FC<{
  blogReview: ProgramBlogReview;
  setBlogReview: (value: ProgramBlogReview) => void;
}> = ({ blogReview, setBlogReview }) => {
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const res = useBlogListQuery({
    pageable: { page: 1, size: 1000 },
  });

  const displayedBlogList = res.data?.blogInfos.filter(
    (info) => info.blogThumbnailInfo.isDisplayed,
  );

  const list = useMemo(() => {
    const l = [...(displayedBlogList ?? [])];
    l.sort((a, b) => {
      if (!a.blogThumbnailInfo.createDate) {
        return -1;
      }
      if (!b.blogThumbnailInfo.createDate) {
        return 1;
      }
      const aCreateDate = dayjs(a.blogThumbnailInfo.createDate);
      const bCreateDate = dayjs(b.blogThumbnailInfo.createDate);
      return bCreateDate.diff(aCreateDate);
    });
    return l;
  }, [displayedBlogList]);

  const onClose = () => setSelectModalOpen(false);
  const onOpen = () => setSelectModalOpen(true);

  return (
    <div className="my-10">
      <Heading2 className="mb-2">블로그 후기</Heading2>
      <div className="mb-2">
        <Button variant="outlined" onClick={onOpen}>
          블로그 리뷰 선택
        </Button>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="flex min-w-full gap-2">
          {blogReview.list.map((item) => (
            <div
              key={item.id}
              className="h-28 w-32 flex-none rounded-xs border"
              style={{
                backgroundImage: `url(${item.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="flex h-full items-center justify-center bg-black bg-opacity-30 p-2 text-xxsmall12">
                <span className="text-white">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={selectModalOpen} onClose={onClose}>
        <Box sx={modalStyle}>
          {/* 헤더 영역 - 고정 */}
          <Box sx={headerStyle}>
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              fontWeight="bold"
            >
              블로그 리뷰 선택 (노출 순서대로 체크하세요)
              <span className="block text-xsmall14 font-normal text-neutral-40">
                노출한 블로그만 표시됩니다.
              </span>
            </Typography>
            <Button onClick={onClose} variant="outlined">
              닫기
            </Button>
          </Box>

          {/* 컨텐츠 영역 - 스크롤 가능 */}
          <Box sx={contentStyle}>
            <div className="w-full overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th></th>
                    <th className="whitespace-nowrap">순서</th>
                    <th className="whitespace-nowrap">카테고리</th>
                    <th className="whitespace-nowrap">작성일</th>
                    <th className="whitespace-nowrap">제목</th>
                    <th className="whitespace-nowrap">설명</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item) => {
                    const index = blogReview.list.findIndex(
                      (v) => v.id === item.blogThumbnailInfo.id,
                    );
                    const order = index === -1 ? '' : index + 1;
                    return (
                      <tr
                        key={item.blogThumbnailInfo.id}
                        className="divide-x divide-y"
                      >
                        <td className="px-2 py-1">
                          <input
                            className="h-4 w-4"
                            type="checkbox"
                            checked={blogReview.list.some(
                              (v) => v.id === item.blogThumbnailInfo.id,
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBlogReview({
                                  list: [
                                    ...blogReview.list,
                                    {
                                      category:
                                        item.blogThumbnailInfo.category ?? '',
                                      title: item.blogThumbnailInfo.title ?? '',
                                      thumbnail:
                                        item.blogThumbnailInfo.thumbnail ?? '',
                                      id: item.blogThumbnailInfo.id,
                                    },
                                  ],
                                });
                              } else {
                                setBlogReview({
                                  list: blogReview.list.filter(
                                    (v) => v.id !== item.blogThumbnailInfo.id,
                                  ),
                                });
                              }
                            }}
                          />
                        </td>
                        <td className="px-2 py-1">
                          <div className="flex items-center justify-center">
                            <span className="whitespace-nowrap text-xsmall14">
                              {order}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-1">
                          <div className="flex items-center justify-center">
                            <span className="whitespace-nowrap text-xsmall14">
                              {item.blogThumbnailInfo.category
                                ? blogCategory[item.blogThumbnailInfo.category]
                                : ''}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap p-1 text-xsmall14">
                          {item.blogThumbnailInfo.createDate
                            ? dayjs(item.blogThumbnailInfo.createDate).format(
                                'YYYY.MM.DD',
                              )
                            : null}
                        </td>
                        <td className="whitespace-nowrap">
                          {item.blogThumbnailInfo.title}
                        </td>
                        <td>
                          <span className="block w-60">
                            {item.blogThumbnailInfo.description}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Box>

          {/* 푸터 영역 - 고정 */}
          <Box sx={footerStyle}>
            <Button onClick={onClose} variant="outlined">
              닫기
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ProgramBlogReviewEditor;
