import { PassFormInput } from '@/domain/all-in-one-pass/types';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

interface Props {
  input: PassFormInput;
  /** import = 붙여넣어 폼 채우기(생성), export = 현재값 복사(수정) */
  mode: 'import' | 'export';
  onImport?: (input: PassFormInput) => void;
}

export default function ImportExportBar({ input, mode, onImport }: Props) {
  const { snackbar } = useAdminSnackbar();
  const [importText, setImportText] = useState('');

  if (mode === 'export') {
    const handleExport = async () => {
      await navigator.clipboard.writeText(JSON.stringify(input));
      snackbar('현재 입력값을 클립보드에 복사했습니다.');
    };
    return (
      <Button variant="outlined" size="small" onClick={handleExport}>
        Export
      </Button>
    );
  }

  const handleImport = () => {
    if (!importText.trim() || !onImport) return;
    try {
      const parsed = JSON.parse(importText) as Partial<PassFormInput>;
      // 누락 필드는 현재 값으로 보존
      onImport({ ...input, ...parsed });
      setImportText('');
      snackbar('Import 되었습니다.');
    } catch {
      snackbar('올바른 JSON 형식이 아닙니다.');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <TextField
        placeholder="Export한 데이터 붙여넣기"
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
        size="small"
        className="w-64"
      />
      <Button variant="outlined" size="medium" onClick={handleImport}>
        Import
      </Button>
    </div>
  );
}
