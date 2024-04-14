import PopUpBannerInputContent from '../../../../components/admin/banner/pop-up-banner/PopUpBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';

const PopUpBannerEdit = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <EditorTemplate
      title="팝업 수정"
      onSubmit={handleSubmit}
      submitButton={{
        text: '수정',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <PopUpBannerInputContent />
    </EditorTemplate>
  );
};

export default PopUpBannerEdit;
