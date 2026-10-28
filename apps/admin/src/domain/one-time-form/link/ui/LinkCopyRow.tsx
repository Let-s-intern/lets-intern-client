import { Button } from '@mui/material';

import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

interface LinkCopyRowProps {
  label: string;
  value: string;
  description?: string;
  /** 여러 줄 코드는 줄바꿈을 살려 보여 준다 */
  isCode?: boolean;
}

/** 값 하나를 읽기 전용으로 보여 주고 복사 버튼을 붙인다 */
const LinkCopyRow = ({
  label,
  value,
  description,
  isCode,
}: LinkCopyRowProps) => {
  const { snackbar } = useAdminSnackbar();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      snackbar('복사했습니다.');
    } catch {
      snackbar('복사하지 못했습니다. 직접 선택해 복사해 주세요.');
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xsmall14 text-neutral-0 font-semibold">
        {label}
      </span>
      {description && (
        <span className="text-xxsmall12 text-neutral-40">{description}</span>
      )}
      <div className="flex items-start gap-3">
        {isCode ? (
          <pre
            aria-label={label}
            className="border-neutral-80 bg-neutral-95 text-xxsmall12 text-neutral-0 rounded-xs max-h-40 min-w-0 flex-1 overflow-auto border p-3"
          >
            {value}
          </pre>
        ) : (
          <input
            readOnly
            aria-label={label}
            value={value}
            onFocus={(e) => e.target.select()}
            className="border-neutral-80 bg-neutral-95 text-xsmall14 text-neutral-0 rounded-xs min-w-0 flex-1 border px-3 py-2"
          />
        )}
        <Button variant="outlined" onClick={copy} aria-label={`${label} 복사`}>
          복사
        </Button>
      </div>
    </div>
  );
};

export default LinkCopyRow;
