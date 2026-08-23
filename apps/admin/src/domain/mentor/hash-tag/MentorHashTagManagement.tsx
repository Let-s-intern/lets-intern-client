import { ApiError } from '@letscareer/api';
import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';

import {
  useAdminMentorHashTagListQuery,
  useDeleteAdminMentorHashTag,
} from '@/api/mentor/mentor';
import type { MentorHashTagItem } from '@/api/mentor/mentorSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

import MentorHashTagFormDialog from './MentorHashTagFormDialog';

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError ? error.message : fallback;

const DATA_GRID_LOCALE_TEXT = {
  noRowsLabel: '등록된 키워드가 없습니다.',
} as const;

export default function MentorHashTagManagement() {
  const { snackbar } = useAdminSnackbar();
  const { data, isLoading } = useAdminMentorHashTagListQuery();
  const hashTags = useMemo(() => data ?? [], [data]);

  const existingTypes = useMemo(
    () => Array.from(new Set(hashTags.map((tag) => tag.type))),
    [hashTags],
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MentorHashTagItem | null>(
    null,
  );

  const deleteMutation = useDeleteAdminMentorHashTag();

  const openCreateModal = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const openEditModal = (item: MentorHashTagItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const closeModal = () => setIsDialogOpen(false);

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
        width: 200,
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

      <MentorHashTagFormDialog
        open={isDialogOpen}
        item={editingItem}
        existingTypes={existingTypes}
        onClose={closeModal}
      />
    </div>
  );
}
