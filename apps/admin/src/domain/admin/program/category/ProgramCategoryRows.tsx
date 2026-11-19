import { Button, TextField } from '@mui/material';
import { useState } from 'react';

export const AddRow = ({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (title: string) => Promise<unknown>;
}) => {
  const [value, setValue] = useState('');
  // Enter 연타로 같은 이름이 두 번 만들어지지 않게 보내는 동안은 막는다
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const title = value.trim();
    if (!title || submitting) return;
    setSubmitting(true);
    try {
      await onAdd(title);
      setValue('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-2 flex gap-2">
      <TextField
        size="small"
        placeholder={placeholder}
        value={value}
        inputProps={{ maxLength: 30 }}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        sx={{ flex: 1 }}
      />
      <Button variant="outlined" onClick={submit} disabled={submitting}>
        추가
      </Button>
    </div>
  );
};
