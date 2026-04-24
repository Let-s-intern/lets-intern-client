import CloneFormDropdown from '@/domain/admin/magnet/form/CloneFormDropdown';
import FormBuilderSection from '@/domain/admin/magnet/form/FormBuilderSection';
import { useMagnetFormBuilder } from '@/domain/admin/magnet/hooks/useMagnetFormBuilder';
import Heading from '@/domain/admin/ui/heading/Heading';
import { Button, CircularProgress } from '@mui/material';

interface MagnetFormPageProps {
  magnetId: string;
}

const MagnetFormPage = ({ magnetId }: MagnetFormPageProps) => {
  const {
    questions,
    isLoading,
    isSaving,
    addQuestion,
    removeQuestion,
    updateQuestion,
    cloneFromMagnet,
    saveForm,
    navigateToList,
  } = useMagnetFormBuilder({ magnetId });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="mx-6 mb-40 mt-6">
      <header className="mb-6 flex items-center justify-between">
        <Heading>신청폼 관리</Heading>
        <CloneFormDropdown
          currentMagnetId={Number(magnetId)}
          hasExistingQuestions={questions.length > 0}
          onClone={cloneFromMagnet}
        />
      </header>

      <main className="max-w-screen-xl">
        <FormBuilderSection
          questions={questions}
          onUpdateQuestion={updateQuestion}
          onRemoveQuestion={removeQuestion}
          onAddQuestion={addQuestion}
        />

        <div className="mt-8 flex items-center justify-end gap-4">
          <Button
            variant="outlined"
            type="button"
            onClick={navigateToList}
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={saveForm}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default MagnetFormPage;
