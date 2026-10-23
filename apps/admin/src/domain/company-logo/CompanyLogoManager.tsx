import { Button, TextField } from '@mui/material';
import { useState } from 'react';

import {
  useAdminCompanyLogoListQuery,
  useDeleteAdminCompanyLogoMutation,
} from '@/api/company-logo/companyLogo';
import type { CompanyLogo } from '@/api/company-logo/companyLogoSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

import CompanyLogoFormDialog from './ui/CompanyLogoFormDialog';

/** 열린 다이얼로그. 등록이면 null 로고, 닫혀 있으면 undefined */
type DialogState = { logo: CompanyLogo | null } | undefined;

/**
 * 회사 로고 라이브러리. 여기 저장한 로고를 멘토 대표 로고·경력 로고에서 골라 쓴다.
 * 지정은 주소를 복사하는 방식이라 여기서 지우거나 바꿔도 이미 지정된 곳은 그대로다.
 */
export default function CompanyLogoManager() {
  const { snackbar } = useAdminSnackbar();
  const {
    data: logos = [],
    isLoading,
    isError,
  } = useAdminCompanyLogoListQuery();
  const deleteLogo = useDeleteAdminCompanyLogoMutation();

  const [keyword, setKeyword] = useState('');
  const [dialog, setDialog] = useState<DialogState>(undefined);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredLogos = logos.filter((logo) =>
    logo.name.toLowerCase().includes(normalizedKeyword),
  );

  const handleDelete = (logo: CompanyLogo) => {
    if (!window.confirm(`'${logo.name}' 로고를 삭제하시겠습니까?`)) return;
    deleteLogo.mutate(logo.id, {
      onSuccess: () => snackbar('로고를 삭제했습니다.'),
      onError: () => snackbar('로고 삭제에 실패했습니다.'),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">회사 로고</h2>
          <p className="text-xsmall14 text-neutral-40 mt-1">
            여기 저장한 로고를 멘토 대표 로고·경력 로고에서 골라 씁니다.
          </p>
        </div>
        <Button variant="contained" onClick={() => setDialog({ logo: null })}>
          로고 등록
        </Button>
      </div>

      <TextField
        size="small"
        className="max-w-sm"
        placeholder="회사명 검색"
        inputProps={{ 'aria-label': '회사명 검색' }}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {isLoading ? (
        <p className="text-xsmall14 text-neutral-40 py-10">불러오는 중...</p>
      ) : isError ? (
        <p className="text-xsmall14 text-neutral-40 py-10">
          로고 목록을 불러오지 못했습니다.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
          {filteredLogos.map((logo) => (
            <li
              key={logo.id}
              className="border-neutral-80 flex flex-col items-center gap-3 rounded-lg border bg-white p-4"
            >
              <img
                src={logo.imageUrl}
                alt={logo.name}
                className="h-16 w-16 rounded object-contain"
              />
              <span className="text-xsmall14 break-all text-center font-semibold">
                {logo.name}
              </span>
              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setDialog({ logo })}
                >
                  수정
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  disabled={deleteLogo.isPending}
                  onClick={() => handleDelete(logo)}
                >
                  삭제
                </Button>
              </div>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setDialog({ logo: null })}
              className="border-neutral-70 text-xsmall14 text-neutral-40 flex h-full min-h-[160px] w-full items-center justify-center rounded-lg border border-dashed"
            >
              새 로고 등록
            </button>
          </li>
        </ul>
      )}

      {normalizedKeyword && !isLoading && filteredLogos.length === 0 ? (
        <p className="text-xsmall14 text-neutral-40">
          「{keyword.trim()}」 와 맞는 로고가 없습니다.
        </p>
      ) : null}

      {dialog ? (
        <CompanyLogoFormDialog
          key={dialog.logo?.id ?? 'new'}
          logo={dialog.logo}
          onClose={() => setDialog(undefined)}
        />
      ) : null}
    </div>
  );
}
