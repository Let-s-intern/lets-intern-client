import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import {
  usePatchAdminCompanyLogoMutation,
  usePostAdminCompanyLogoMutation,
} from '@/api/company-logo/companyLogo';
import type { CompanyLogo } from '@/api/company-logo/companyLogoSchema';
import { uploadFile } from '@/api/file';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const errorMessage = (error: unknown, fallback: string) => {
  const { status, message } = (error ?? {}) as {
    status?: number;
    message?: string;
  };
  if (status === 409) return '같은 회사명이 이미 있습니다.';
  return message ?? fallback;
};

interface Props {
  /** null 이면 등록, 값이 있으면 그 로고를 수정 */
  logo: CompanyLogo | null;
  onClose: () => void;
}

/** 회사 로고 등록·수정. 열 때마다 새로 마운트해 `logo` 로 시작한다 */
export default function CompanyLogoFormDialog({ logo, onClose }: Props) {
  const { snackbar } = useAdminSnackbar();
  const postLogo = usePostAdminCompanyLogoMutation();
  const patchLogo = usePatchAdminCompanyLogoMutation();

  const [name, setName] = useState(logo?.name ?? '');
  const [imageUrl, setImageUrl] = useState(logo?.imageUrl ?? '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSaving = postLogo.isPending || patchLogo.isPending;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }
    setError(null);
    setIsUploading(true);
    try {
      setImageUrl(await uploadFile({ file, type: 'COMPANY_LOGO' }));
    } catch {
      setError('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    const body = { name: name.trim(), imageUrl };
    try {
      if (logo) {
        await patchLogo.mutateAsync({ id: logo.id, ...body });
        snackbar('로고를 수정했습니다.');
      } else {
        await postLogo.mutateAsync(body);
        snackbar('로고를 등록했습니다.');
      }
      onClose();
    } catch (e) {
      setError(
        errorMessage(
          e,
          logo ? '로고 수정에 실패했습니다.' : '로고 등록에 실패했습니다.',
        ),
      );
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="text-base font-semibold">
        {logo ? '로고 수정' : '로고 등록'}
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 pt-2">
          <TextField
            size="small"
            label="회사명"
            value={name}
            inputProps={{ maxLength: 100 }}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <div className="border-neutral-80 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-dashed">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name || '로고'}
                  className="h-full w-full object-contain"
                />
              ) : null}
            </div>
            <Button
              component="label"
              variant="outlined"
              size="small"
              disabled={isUploading}
            >
              {isUploading ? '올리는 중...' : '이미지 업로드'}
              <input
                type="file"
                accept="image/*"
                hidden
                aria-label="로고 이미지 업로드"
                onChange={handleFile}
              />
            </Button>
          </div>
          {error ? (
            <p role="alert" className="text-system-error text-xs">
              {error}
            </p>
          ) : null}
          <p className="text-xxsmall12 text-neutral-40">
            같은 회사명은 등록할 수 없습니다. 로고를 지우거나 바꿔도 이미 멘토에
            지정된 로고는 그대로입니다.
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="contained"
          disabled={!name.trim() || !imageUrl || isUploading || isSaving}
          onClick={handleSubmit}
        >
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
