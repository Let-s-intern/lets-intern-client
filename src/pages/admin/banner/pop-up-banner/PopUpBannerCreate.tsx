import ProgramBannerInputContent from '../../../../components/admin/banner/program-banner/ProgramBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';

const PopUpBannerCreate = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <EditorTemplate
      title="팝업 등록"
      onSubmit={handleSubmit}
      submitButton={{
        text: '등록',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <ProgramBannerInputContent />
    </EditorTemplate>
  );
};

export default PopUpBannerCreate;
