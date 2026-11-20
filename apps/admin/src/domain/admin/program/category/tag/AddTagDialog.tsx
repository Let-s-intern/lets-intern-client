import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import {
  useCreateProgramCategoryTag,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import PageAddressField, { pageAddressError } from '../ui/PageAddressField';
import { filterRowsOf, tagsOf } from '../utils/tagUtils';

/** 분류 추가. 필터 줄을 고르고 이름·주소를 넣으면 기본 섹션 5개로 페이지가 바로 생긴다 */
const AddTagDialog = ({
  groups,
  onClose,
  onCreated,
}: {
  groups: ProgramCategoryGroup[];
  onClose: () => void;
  onCreated: (id: number) => void;
}) => {
  const { snackbar } = useAdminSnackbar();
  const create = useCreateProgramCategoryTag();
  const rows = filterRowsOf(groups);
  const [rowId, setRowId] = useState<number | ''>(rows[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const trimmed = title.trim();
  const slugTaken =
    slug !== '' && tagsOf(groups).some(({ tag }) => tag.slug === slug);

  const add = async () => {
    setSubmitted(true);
    if (rowId === '' || !trimmed || pageAddressError(slug, false) || slugTaken)
      return;
    try {
      const id = await create.mutateAsync({
        programCategoryGroupId: rowId,
        title: trimmed,
        slug: slug || undefined,
      });
      onCreated(id);
      onClose();
    } catch {
      snackbar('분류를 만들지 못했습니다. 주소가 겹치는지 확인하세요.');
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>분류 추가</DialogTitle>
      <DialogContent className="flex flex-col gap-3 !pt-2">
        <TextField
          size="small"
          label="분류 이름"
          placeholder="예: 개발"
          value={title}
          inputProps={{ maxLength: 30 }}
          onChange={(e) => setTitle(e.target.value)}
          error={submitted && !trimmed}
          helperText={submitted && !trimmed ? '이름을 넣어 주세요' : undefined}
        />
        <FormControl size="small" error={submitted && rowId === ''}>
          <Select
            displayEmpty
            value={rowId}
            onChange={(e) => setRowId(e.target.value as number | '')}
          >
            <MenuItem value="" disabled>
              필터 줄 고르기
            </MenuItem>
            {rows.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.title}
                {r.isVisible ? '' : ' (숨김)'}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            /program 필터에서 이 줄의 버튼으로 보여요.
          </FormHelperText>
        </FormControl>
        <PageAddressField
          value={slug}
          onChange={setSlug}
          showErrors={submitted}
          externalError={slugTaken ? '이미 쓰고 있는 주소예요' : undefined}
          helperText="정하면 기본 섹션으로 /category/주소 페이지가 바로 생겨요."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" disabled={create.isPending} onClick={add}>
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTagDialog;
