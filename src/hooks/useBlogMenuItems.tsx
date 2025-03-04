import { useBlogListQuery } from '@/api/blog';
import { MenuItem } from '@mui/material';
import { useMemo } from 'react';

export default function useBlogMenuItems() {
  const { data } = useBlogListQuery({
    pageable: { page: 1, size: 10000 },
  });

  const blogMenuItems = useMemo(
    () => [
      <MenuItem key="null" value="null">
        선택 안 함
      </MenuItem>,
      ...(data?.blogInfos
        .filter(
          (info) =>
            // 공개된 블로그이고, 게시일자가 있으며, 게시일이 과거인 블로그
            info.blogThumbnailInfo.isDisplayed &&
            info.blogThumbnailInfo.displayDate &&
            new Date(info.blogThumbnailInfo.displayDate) <= new Date(),
        )
        .map((info) => (
          <MenuItem
            key={info.blogThumbnailInfo.id}
            value={info.blogThumbnailInfo.id}
          >
            {`[${info.blogThumbnailInfo.id}] ${info.blogThumbnailInfo.title}`}
          </MenuItem>
        )) ?? []),
    ],
    [data],
  );

  return blogMenuItems;
}
