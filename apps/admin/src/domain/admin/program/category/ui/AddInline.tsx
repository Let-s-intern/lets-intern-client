import { Button } from '@mui/material';
import { useState } from 'react';
import { AddRow } from '../ProgramCategoryRows';

/** 평소에는 "+ 추가" 글자 버튼만 보이고, 누르면 이름 칸이 열린다 */
const AddInline = ({
  label,
  placeholder,
  onAdd,
}: {
  label: string;
  placeholder: string;
  onAdd: (title: string) => Promise<unknown>;
}) => {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <Button size="small" onClick={() => setOpen(true)}>
        + {label}
      </Button>
    );
  return (
    <div className="flex min-w-[320px] flex-1 items-start gap-1">
      <div className="flex-1">
        <AddRow
          placeholder={placeholder}
          onAdd={async (title) => {
            await onAdd(title);
            setOpen(false);
          }}
        />
      </div>
      <Button size="small" onClick={() => setOpen(false)} sx={{ mt: 2.5 }}>
        취소
      </Button>
    </div>
  );
};

export default AddInline;
