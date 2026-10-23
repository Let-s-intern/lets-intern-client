import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import { useAdminCompanyLogoListQuery } from '@/api/company-logo/companyLogo';
import type { CompanyLogo } from '@/api/company-logo/companyLogoSchema';
import { twMerge } from '@/lib/twMerge';

import CompanyLogoFormDialog from './CompanyLogoFormDialog';

interface Props {
  onClose: () => void;
  /** 고른 로고. 지정은 라이브러리 로고에 연결하는 방식이라 id 로 저장한다 */
  onSelect: (logo: CompanyLogo) => void;
  /** 주면 「로고 해제」 버튼을 둔다 */
  onClear?: () => void;
}

/**
 * 회사 로고 라이브러리에서 하나 고르기. 멘토 대표 로고와 경력 로고가 같이 쓴다.
 * 찾는 로고가 없으면 여기서 바로 등록한다(관리 화면과 같은 등록 창). 등록한 로고는 선택 상태로만
 * 두고, 지정은 「선택」 을 눌러야 한다.
 */
export default function CompanyLogoPickerDialog({
  onClose,
  onSelect,
  onClear,
}: Props) {
  const { data: logos = [], isLoading } = useAdminCompanyLogoListQuery();
  const [keyword, setKeyword] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const registerButton = (
    <Button
      variant="outlined"
      size="small"
      className="shrink-0"
      onClick={() => setIsRegisterOpen(true)}
    >
      로고 등록
    </Button>
  );

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredLogos = logos.filter((logo) =>
    logo.name.toLowerCase().includes(normalizedKeyword),
  );
  const selectedLogo = logos.find((logo) => logo.id === selectedId);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-base font-semibold">로고 선택</DialogTitle>
      <DialogContent>
        <div className="mt-2 flex items-center gap-2">
          <TextField
            size="small"
            fullWidth
            placeholder="회사명 검색"
            inputProps={{ 'aria-label': '회사명 검색' }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {registerButton}
        </div>
        {isLoading ? (
          <p className="text-xsmall14 text-neutral-40 py-8">불러오는 중...</p>
        ) : filteredLogos.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-xsmall14 text-neutral-40">
              맞는 로고가 없습니다. 새로 등록해 주세요.
            </p>
            {registerButton}
          </div>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {filteredLogos.map((logo) => (
              <li key={logo.id}>
                <button
                  type="button"
                  aria-pressed={logo.id === selectedId}
                  onClick={() => setSelectedId(logo.id)}
                  className={twMerge(
                    'flex w-full flex-col items-center gap-2 rounded-lg border p-3',
                    logo.id === selectedId
                      ? 'border-primary bg-primary-10'
                      : 'border-neutral-80',
                  )}
                >
                  <img
                    src={logo.imageUrl}
                    alt=""
                    className="h-12 w-12 rounded object-contain"
                  />
                  <span className="text-xsmall14 break-all">{logo.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
      <DialogActions>
        {onClear ? (
          <Button color="error" className="mr-auto" onClick={onClear}>
            로고 해제
          </Button>
        ) : null}
        <Button color="inherit" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="contained"
          disabled={!selectedLogo}
          onClick={() => selectedLogo && onSelect(selectedLogo)}
        >
          선택
        </Button>
      </DialogActions>
      {isRegisterOpen ? (
        <CompanyLogoFormDialog
          logo={null}
          onClose={() => setIsRegisterOpen(false)}
          onCreated={(logoId) => {
            // 방금 만든 로고가 목록에 보이도록 검색어를 비우고 골라 둔다
            setKeyword('');
            setSelectedId(logoId);
          }}
        />
      ) : null}
    </Dialog>
  );
}
