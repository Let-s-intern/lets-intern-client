'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import CommonBannerInputContent from '@/domain/admin/banner/common-banner/CommonBannerInputContent';
import useCommonBannerEdit from '@/domain/admin/pages/banner/common-banner/useCommonBannerEdit';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';

const CommonBannerEditPage = () => {
  const { value, setValue, isLoading, handleSubmit } = useCommonBannerEdit();

  if (isLoading || !value) {
    return <LoadingContainer />;
  }

  return (
    <EditorTemplate
      title="배너 수정"
      onSubmit={handleSubmit}
      submitButton={{ text: '수정' }}
      cancelButton={{ text: '취소', to: '-1' }}
    >
      <CommonBannerInputContent value={value} onChange={setValue} />
    </EditorTemplate>
  );
};

export default CommonBannerEditPage;
