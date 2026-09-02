import { usePostAdminBlogPopup } from '@/api/blog/blogPopup';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BlogPopupFormFields from './popup/BlogPopupFormFields';
import { toBlogPopupSaveErrorMessage } from './popup/blogPopupError';
import {
  BlogPopupFormValue,
  EMPTY_BLOG_POPUP_FORM,
  toBlogIdsPayload,
  validateBlogPopupForm,
} from './popup/blogPopupForm';

const BlogPopupCreatePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<BlogPopupFormValue>(EMPTY_BLOG_POPUP_FORM);

  const post = usePostAdminBlogPopup();
  const { snackbar } = useAdminSnackbar();

  const handleChange = (patch: Partial<BlogPopupFormValue>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async () => {
    const error = validateBlogPopupForm(form);
    if (error) {
      snackbar(error);
      return;
    }

    try {
      await post.mutateAsync({
        title: form.title,
        imageUrl: form.imageUrl,
        link: form.link,
        targetType: form.targetType,
        blogIds: toBlogIdsPayload(form),
        triggerRatio: form.triggerRatio,
        priority: form.priority,
        isVisible: form.isVisible,
        startDate: form.startDate,
        endDate: form.endDate,
      });
    } catch (error) {
      // 우선순위 중복은 서버도 막는다. 거절 사유를 그대로 보여준다.
      snackbar(toBlogPopupSaveErrorMessage(error, '등록에 실패했습니다'));
      return;
    }

    snackbar('등록되었습니다');
    navigate('/blog/popup');
  };

  return (
    <div className="p-5">
      <Heading className="mb-5">블로그 팝업 등록</Heading>
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
};

export default BlogPopupCreatePage;
