import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AxiosError } from 'axios';
import { Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';

import {
  useAdminMentorHashTagListQuery,
  useDeleteAdminMentorHashTag,
  usePatchAdminMentorHashTag,
  usePostAdminMentorHashTag,
} from '@/api/mentor/mentor';
import type {
  MentorHashTagItem,
  MentorHashTagReq,
  MentorHashTagType,
} from '@/api/mentor/mentorSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import type { ErrorResonse } from '@/types/interface';

import { MENTOR_HASH_TAG_TYPE_OPTIONS } from './constants';

type ModalState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; item: MentorHashTagItem };

const getTypeLabel = (type: string) =>
  MENTOR_HASH_TAG_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
  type;

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<ErrorResonse>;
  return axiosError.response?.data?.message || fallback;
};

const DATA_GRID_LOCALE_TEXT = {
  noRowsLabel: '등록된 키워드가 없습니다.',
} as const;

export default function MentorHashTagManagement() {
  const { snackbar } = useAdminSnackbar();
  const { data, isLoading } = useAdminMentorHashTagListQuery();
  const hashTags = useMemo(() => data ?? [], [data]);

  const [modalState, setModalState] = useState<ModalState>({ open: false });
  const [type, setType] = useState<MentorHashTagType>(
    MENTOR_HASH_TAG_TYPE_OPTIONS[0].value,
  );
  const [title, setTitle] = useState('');

  const postMutation = usePostAdminMentorHashTag();
  const patchMutation = usePatchAdminMentorHashTag();
  const deleteMutation = useDeleteAdminMentorHashTag();

  const openCreateModal = () => {
    setType(MENTOR_HASH_TAG_TYPE_OPTIONS[0].value);
    setTitle('');
    setModalState({ open: true, mode: 'create' });
  };

  const openEditModal = (item: MentorHashTagItem) => {
    setType(item.type as MentorHashTagType);
    setTitle(item.title);
    setModalState({ open: true, mode: 'edit', item });
  };

  const closeModal = () => setModalState({ open: false });

  const handleSubmit = async () => {
    if (!modalState.open) return;
    const body: MentorHashTagReq = { type, title };

    try {
      if (modalState.mode === 'create') {
        await postMutation.mutateAsync(body);
        snackbar('키워드가 생성되었습니다.');
      } else {
        await patchMutation.mutateAsync({
          mentorHashTagId: modalState.item.id,
          ...body,
        });
        snackbar('키워드가 수정되었습니다.');
      }
      closeModal();
    } catch (error) {
      snackbar(
        getErrorMessage(
          error,
          modalState.mode === 'create'
            ? '키워드 생성에 실패했습니다.'
            : '키워드 수정에 실패했습니다.',
        ),
      );
    }
  };

  const handleDelete = async (item: MentorHashTagItem) => {
    if (!window.confirm(`'${item.title}' 키워드를 삭제하시겠습니까?`)) return;

    try {
      await deleteMutation.mutateAsync(item.id);
      snackbar('키워드가 삭제되었습니다.');
    } catch (error) {
      snackbar(getErrorMessage(error, '키워드 삭제에 실패했습니다.'));
    }
  };

  const columns: GridColDef<MentorHashTagItem>[] = useMemo(
    () => [
      {
        field: 'type',
        headerName: '타입',
        width: 100,
      },
      {
        field: 'typeLabel',
        headerName: '카테고리명',
        width: 300,
        valueGetter: (_, row) => getTypeLabel(row.type),
      },
      {
        field: 'title',
        headerName: '키워드명',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'actions',
        headerName: '관리',
        width: 180,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <div className="flex h-full items-center gap-2">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<Pencil />}
              onClick={() => openEditModal(row)}
            >
              수정
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<FaTrashCan />}
              onClick={() => handleDelete(row)}
            >
              삭제
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">멘토 키워드 관리</h2>
        <Button variant="contained" onClick={openCreateModal}>
          키워드 생성
        </Button>
      </div>

      <DataGrid
        rows={hashTags}
        columns={columns}
        loading={isLoading}
        disableRowSelectionOnClick
        autoHeight
        hideFooter
        localeText={DATA_GRID_LOCALE_TEXT}
      />

      <Dialog
        open={modalState.open}
        onClose={closeModal}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {modalState.open && modalState.mode === 'edit'
            ? '키워드 수정'
            : '키워드 생성'}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          <TextField
            select
            label="타입"
            value={type}
            onChange={(e) => setType(e.target.value as MentorHashTagType)}
            fullWidth
            margin="dense"
          >
            {MENTOR_HASH_TAG_TYPE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value} ({option.label})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="키워드명"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <div className="mt-2 flex gap-2 pb-2">
            <Button
              variant="outlined"
              size="large"
              onClick={closeModal}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              variant="contained"
              size="large"
              className="flex-1 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!title.trim()}
            >
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
