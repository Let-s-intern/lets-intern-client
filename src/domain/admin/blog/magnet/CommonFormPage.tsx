'use client';

import FormBuilderSection from '@/domain/admin/blog/magnet/form/FormBuilderSection';
import { useCommonFormBuilder } from '@/domain/admin/blog/magnet/hooks/useCommonFormBuilder';
import { CommonFormData } from '@/domain/admin/blog/magnet/types';
import Heading from '@/domain/admin/ui/heading/Heading';
import { Button, IconButton } from '@mui/material';
import { ArrowLeft } from 'lucide-react';

interface CommonFormPageProps {
  initialData: CommonFormData;
}

const CommonFormPage = ({ initialData }: CommonFormPageProps) => {
  const {
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    saveForm,
    navigateToList,
  } = useCommonFormBuilder({ initialData });

  return (
    <div className="mx-6 mb-40 mt-6">
      <header className="mb-6 flex items-center gap-2">
        <IconButton size="small" onClick={navigateToList}>
          <ArrowLeft size={20} />
        </IconButton>
        <Heading>공통 신청폼 관리</Heading>
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
          >
            저장하기
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CommonFormPage;
