import {
  useGetAdminBlogPopup,
  usePatchAdminBlogPopup,
} from '@/api/blog/blogPopup';
import { AdminBlogPopup } from '@/api/blog/blogPopupSchema';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import BlogPopupFormFields from './popup/BlogPopupFormFields';
import {
  BlogPopupFormValue,
  DEFAULT_TRIGGER_RATIO,
  toBlogIdsPayload,
  validateBlogPopupForm,
} from './popup/blogPopupForm';

const toFormValue = (popup: AdminBlogPopup): BlogPopupFormValue => ({
  title: popup.title ?? '',
  imageUrl: popup.imageUrl ?? '',
  link: popup.link ?? '',
  targetType: popup.targetType,
  blogIds: popup.blogIds,
  triggerRatio: popup.triggerRatio ?? DEFAULT_TRIGGER_RATIO,
  isVisible: popup.isVisible ?? false,
  startDate: popup.startDate ?? '',
  endDate: popup.endDate ?? '',
});

const BlogPopupEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useGetAdminBlogPopup(Number(id));

  if (!data) return <LoadingContainer className="mt-[20%]" />;

  // 조회가 끝난 뒤에 폼을 띄운다. 초기값은 마운트할 때 한 번만 넣는다.
  return (
    <BlogPopupEditForm
      blogPopupId={data.blogPopupInfo.blogPopupId}
      initialValue={toFormValue(data.blogPopupInfo)}
    />
  );
};

interface BlogPopupEditFormProps {
  blogPopupId: number;
  initialValue: BlogPopupFormValue;
}

function BlogPopupEditForm({
  blogPopupId,
  initialValue,
}: BlogPopupEditFormProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialValue);
  // 서버는 blogIds 의 null 과 빈 배열을 다르게 본다. 건드리지 않았으면 키를 아예 빼야
  // 제목만 고쳤을 때 노출 대상이 날아가지 않는다.
  const [targetTouched, setTargetTouched] = useState(false);

  const patch = usePatchAdminBlogPopup();
  const { snackbar } = useAdminSnackbar();

  const handleChange = (patchValue: Partial<BlogPopupFormValue>) => {
    if ('blogIds' in patchValue || 'targetType' in patchValue) {
      setTargetTouched(true);
    }
    setForm((prev) => ({ ...prev, ...patchValue }));
  };

  const handleSubmit = async () => {
    const error = validateBlogPopupForm(form);
    if (error) {
      snackbar(error);
      return;
    }

    await patch.mutateAsync({
      blogPopupId,
      title: form.title,
      imageUrl: form.imageUrl,
      link: form.link,
      targetType: form.targetType,
      ...(targetTouched ? { blogIds: toBlogIdsPayload(form) } : {}),
      triggerRatio: form.triggerRatio,
      isVisible: form.isVisible,
      startDate: form.startDate,
      endDate: form.endDate,
    });

    snackbar('수정되었습니다');
    navigate('/blog/popup');
  };

  return (
    <div className="p-5">
      <Heading className="mb-5">블로그 팝업 수정</Heading>
      <div className="w-1/2 min-w-[37.5rem]">
        <BlogPopupFormFields value={form} onChange={handleChange} />
        <div className="flex w-full justify-end gap-5">
          <Button variant="contained" onClick={handleSubmit}>
            저장
          </Button>
          <Button variant="outlined" onClick={() => navigate('/blog/popup')}>
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BlogPopupEditPage;
