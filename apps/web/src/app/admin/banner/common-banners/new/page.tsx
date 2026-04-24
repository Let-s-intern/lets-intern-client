'use client';

import CommonBannerInputContent from '@/domain/admin/banner/common-banner/CommonBannerInputContent';
import useCommonBannerCreate from '@/domain/admin/pages/banner/common-banner/useCommonBannerCreate';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';

const CommonBannerCreatePage = () => {
  const { value, setValue, handleSubmit } = useCommonBannerCreate();

  return (
    <EditorTemplate
      title="배너 등록"
      onSubmit={handleSubmit}
      submitButton={{ text: '등록' }}
      cancelButton={{ text: '취소', to: '-1' }}
    >
      <CommonBannerInputContent value={value} onChange={setValue} />
    </EditorTemplate>
  );
};

export default CommonBannerCreatePage;
