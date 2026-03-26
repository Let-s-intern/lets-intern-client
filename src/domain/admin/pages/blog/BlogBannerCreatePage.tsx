'use client';

import { usePostAdminBlogBanner } from '@/api/blog/blog';
import { PostAdminBlogBannerReqBody } from '@/api/blog/blogSchema';
import { fileType, uploadFile } from '@/api/file';
import { YYYY_MMDD_THHmmss } from '@/data/dayjsFormat';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

const BlogBannerCreatePage = () => {
  const router = useRouter();

  const [reqBody, setReqBody] = useState<PostAdminBlogBannerReqBody>({
    title: '',
    link: '',
    file: null,
    startDate: undefined,
    endDate: undefined,
  });

  const post = usePostAdminBlogBanner();
  const { snackbar } = useAdminSnackbar();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setReqBody((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="p-5">
      <Heading className="mb-5">블로그 광고 배너 등록</Heading>
      <div className="w-1/2 min-w-[37.5rem]">
        <div className="mb-5 flex gap-3">
          <TextField
            className="w-full"
            variant="outlined"
            name="title"
            required
            label="제목"
            placeholder="제목을 입력하세요"
            onChange={handleChange}
          />
          <TextField
            className="w-full"
            variant="outlined"
            name="link"
            required
            label="링크"
            placeholder="링크를 입력하세요"
            onChange={handleChange}
          />
        </div>
        <ImageUpload
          label="배너 이미지 업로드"
          id="file"
          name="file"
          onChange={async (e) => {
            if (!e.target.files) return;

            const imgUrl = await uploadFile({
              file: e.target.files[0],
              type: fileType.enum.BLOG_BANNER,
            });

            setReqBody((prev) => ({ ...prev, file: imgUrl }));
          }}
        />
        <div className="my-5 flex gap-3">
          <DateTimePicker
            className="w-full"
            label="시작 일자"
            name="startDate"
            onChange={(value) =>
              setReqBody((prev) => ({
                ...prev,
                startDate: value?.format(YYYY_MMDD_THHmmss),
              }))
            }
          />
          <DateTimePicker
            className="w-full"
            label="종료 일자"
            name="endDate"
            onChange={(value) =>
              setReqBody((prev) => ({
                ...prev,
                endDate: value?.format(YYYY_MMDD_THHmmss),
              }))
            }
          />
        </div>
        <div className="flex w-full justify-end gap-5">
          <Button
            variant="contained"
            onClick={async () => {
              await post.mutateAsync(reqBody);
              snackbar('등록되었습니다');
            }}
          >
            저장
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/admin/blog/banner')}
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogBannerCreatePage;
