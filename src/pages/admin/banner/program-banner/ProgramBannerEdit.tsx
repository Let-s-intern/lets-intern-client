import MainBannerInputContent from '../../../../components/admin/banner/main-banner/MainBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';

const ProgramBannerEdit = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <EditorTemplate
      title="프로그램 배너 수정"
      onSubmit={handleSubmit}
      submitButton={{
        text: '수정',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <MainBannerInputContent />
    </EditorTemplate>
  );
};

export default ProgramBannerEdit;
