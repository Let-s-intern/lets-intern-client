import TopBarBannerInputContent from '../../../components/admin/banner/top-bar-banner/TopBarBannerInputContent';
import OnlineContentsInputContent from '../../../components/admin/online-contents/OnlineContentsInputContent';
import EditorTemplate from '../../../components/admin/program/ui/editor/EditorTemplate';

const OnlineContentsEdit = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <EditorTemplate
      title="상시 콘텐츠 수정"
      onSubmit={handleSubmit}
      submitButton={{
        text: '수정',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <OnlineContentsInputContent />
    </EditorTemplate>
  );
};

export default OnlineContentsEdit;
