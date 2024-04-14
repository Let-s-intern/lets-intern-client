import TopBarBannerInputContent from '../../../../components/admin/banner/top-bar-banner/TopBarBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';

const TopBarBannerCreate = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <EditorTemplate
      title="상단 띠 배너 등록"
      onSubmit={handleSubmit}
      submitButton={{
        text: '등록',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <TopBarBannerInputContent />
    </EditorTemplate>
  );
};

export default TopBarBannerCreate;
