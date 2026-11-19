import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';

/** 이름 바꾸기. 비우거나 같은 이름이면 저장하지 않는다 */
const RenameDialog = ({
  title,
  label,
  onClose,
  onSave,
}: {
  title: string;
  label: string;
  onClose: () => void;
  onSave: (title: string) => void;
}) => {
  const [value, setValue] = useState(title);
  const next = value.trim();
  const submit = () => {
    if (next && next !== title) onSave(next);
    onClose();
  };
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{label} 바꾸기</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          size="small"
          margin="dense"
          value={value}
          inputProps={{ maxLength: 30 }}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" disabled={!next} onClick={submit}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameDialog;
