import { Button, TextField } from '@mui/material';
import { useState } from 'react';

import {
  useAdminCompanyLogoListQuery,
  useDeleteAdminCompanyLogoMutation,
} from '@/api/company-logo/companyLogo';
import type { CompanyLogo } from '@/api/company-logo/companyLogoSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

import CompanyLogoFormDialog from '@/common/company-logo/CompanyLogoFormDialog';

/** 열린 다이얼로그. 등록이면 null 로고, 닫혀 있으면 undefined */
type DialogState = { logo: CompanyLogo | null } | undefined;

/**
 * 회사 로고 라이브러리. 여기 저장한 로고를 멘토 대표 로고·경력 로고에 연결해 쓴다.
 * 연결 방식이라 여기서 이미지를 바꾸면 연결된 멘토 로고도 함께 바뀐다. 쓰는 곳이 있으면 지울 수 없다.
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
      onError: (error) => {
        const { code, message } = error as { code?: string; message?: string };
        // 쓰는 곳이 있으면 서버가 409 와 사용 건수를 담은 문구를 준다. 그대로 보여 준다
        snackbar(
          code === 'COMPANY_LOGO_IN_USE' && message
            ? message
            : '로고 삭제에 실패했습니다.',
        );
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">회사 로고</h2>
          <p className="text-xsmall14 text-neutral-40 mt-1">
            여기 저장한 로고를 멘토 대표 로고·경력 로고에 연결해 씁니다. 이
            로고를 바꾸면 연결된 멘토 로고도 함께 바뀝니다.
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
