import { useCreateAllInOnePassMutation } from '@/api/all-in-one-pass/usePassMutations';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import PassForm, {
  createInitialPassInput,
} from '@/domain/all-in-one-pass/section/PassForm';
import PassFormViewTabs, {
  PassFormView,
} from '@/domain/all-in-one-pass/section/PassFormViewTabs';
import { PassFormInput } from '@/domain/all-in-one-pass/types';
import ImportExportBar from '@/domain/all-in-one-pass/ui/ImportExportBar';
import { useVodDefaults } from '@/domain/all-in-one-pass/util/useVodDefaults';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllInOnePassCreate() {
  const navigate = useNavigate();
  const { snackbar } = useAdminSnackbar();
  const [input, setInput] = useState<PassFormInput>(createInitialPassInput);
  const [view, setView] = useState<PassFormView>('info');

  const patch = (partial: Partial<PassFormInput>) =>
    setInput((prev) => ({ ...prev, ...partial }));

  const createMutation = useCreateAllInOnePassMutation();
  const applyVodDefaults = useVodDefaults();

  const handleSave = async () => {
    try {
      await createMutation.mutateAsync(applyVodDefaults(input));
      snackbar('올인원패스가 개설되었습니다.');
      navigate('/all-in-one-pass');
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '개설에 실패했습니다.');
    }
  };

  return (
    <main className="flex flex-col p-6">
      <Header>
        <div className="flex items-center gap-4">
          <Heading>올인원패스 생성</Heading>
          <PassFormViewTabs value={view} onChange={setView} />
        </div>
        <ImportExportBar mode="import" input={input} onImport={setInput} />
      </Header>
      <PassForm input={input} patch={patch} view={view} />
      <div className="border-neutral-80 sticky bottom-0 z-10 -mx-6 -mb-6 flex justify-end gap-2 border-t bg-neutral-100 px-6 py-4">
        <Button variant="outlined" onClick={() => navigate('/all-in-one-pass')}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={createMutation.isPending}
        >
          저장하기
        </Button>
      </div>
    </main>
  );
}
