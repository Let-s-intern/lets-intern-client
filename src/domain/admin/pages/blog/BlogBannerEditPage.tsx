'use client';

import { useGetAdminBlogBanner, usePatchAdminBlogBanner } from '@/api/blog';
import { PatchAdminBlogBannerReqBody } from '@/api/blogSchema';
import { fileType, uploadFile } from '@/api/file';
import LoadingContainer from '@/common/ui/loading/LoadingContainer';
import { YYYY_MMDD_THHmmss } from '@/data/dayjsFormat';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

const BlogBannerEditPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data } = useGetAdminBlogBanner(Number(id));
  const patch = usePatchAdminBlogBanner();

  const [reqBody, setReqBody] = useState<
    Omit<PatchAdminBlogBannerReqBody, 'blogBannerId'>
  >({});

  const { snackbar } = useAdminSnackbar();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setReqBody((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  if (!data) return <LoadingContainer className="mt-[20%]" />;

  return (
    <div className="p-5">
      <Heading className="mb-5">블로그 광고 배너 수정</Heading>
      <div className="w-1/2 min-w-[37.5rem]">
        <div className="mb-5 flex gap-3">
          <TextField
            className="w-full"
            variant="outlined"
            name="title"
            required
            label="제목"
            placeholder="제목을 입력하세요"
            defaultValue={data?.blogBannerInfo.title}
            onChange={handleChange}
          />
          <TextField
            className="w-full"
            variant="outlined"
            name="link"
            required
            label="링크"
            placeholder="링크를 입력하세요"
            defaultValue={data?.blogBannerInfo.link}
            onChange={handleChange}
          />
        </div>
        <ImageUpload
          label="배너 이미지 업로드"
          id="file"
          name="file"
          image={data?.blogBannerInfo.file ?? undefined}
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
            defaultValue={dayjs(data?.blogBannerInfo.startDate)}
            onChange={(value) => {
              setReqBody((prev) => ({
                ...prev,
                startDate: value?.format(YYYY_MMDD_THHmmss),
              }));
            }}
          />
          <DateTimePicker
            className="w-full"
            label="종료 일자"
            name="endDate"
            defaultValue={dayjs(data?.blogBannerInfo.endDate)}
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
              await patch.mutateAsync({
                ...reqBody,
                blogBannerId: data?.blogBannerInfo.blogBannerId,
              });
              snackbar('수정되었습니다');
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

export default BlogBannerEditPage;
