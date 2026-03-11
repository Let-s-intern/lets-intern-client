'use client';

import { useState } from 'react';
import {
  useAdminChallengeMentorGuideListQuery,
  usePostAdminChallengeMentorGuide,
  usePatchAdminChallengeMentorGuide,
  useDeleteAdminChallengeMentorGuide,
} from '@/api/challenge-mentor-guide/challengeMentorGuide';
import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import { useGetChallengeList } from '@/api/challenge/challenge';
import type { ChallengeMentorGuideItem } from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';
import Heading from '@/domain/admin/ui/heading/Heading';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { FaEdit } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';

/* ── 타입 ── */

interface NoticeForm {
  title: string;
  link: string;
}

type ModalState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; guideId: number };

const INITIAL_FORM: NoticeForm = { title: '', link: '' };

/* ── 컬럼 정의 ── */

function buildColumns(
  onEdit: (guide: ChallengeMentorGuideItem) => void,
  onDelete: (guideId: number) => void,
): GridColDef<ChallengeMentorGuideItem>[] {
  return [
    {
      field: 'title',
      headerName: '제목',
      flex: 1,
      minWidth: 200,
      valueGetter: (_, row) => row.title ?? '-',
    },
    {
      field: 'link',
      headerName: '링크',
      flex: 2,
      minWidth: 250,
      renderCell: ({ row }) =>
        row.link ? (
          <a
            href={row.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {row.link}
          </a>
        ) : (
          <span>-</span>
        ),
    },
    {
      field: 'createDate',
      headerName: '등록일',
      width: 140,
      valueGetter: (_, row) => row.createDate ?? '-',
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconButton size="small" onClick={() => onEdit(row)}>
            <FaEdit size={14} />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(row.challengeMentorGuideId)}
          >
            <FaTrashCan size={14} />
          </IconButton>
        </div>
      ),
    },
  ];
}

/* ── 메인 컴포넌트 ── */

export default function MentorNoticeManagement() {
  /* 챌린지 & 멘토 선택 */
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [selectedChallengeMentorId, setSelectedChallengeMentorId] =
    useState('');

  const { data: challengeData } = useGetChallengeList({
    pageable: { size: 1000, page: 1 },
  });
  const { data: mentorData } = useAdminChallengeMentorListQuery(
    selectedChallengeId || undefined,
  );

  /* 가이드 목록 */
  const { data: guideData, isLoading } =
    useAdminChallengeMentorGuideListQuery(
      selectedChallengeMentorId || undefined,
    );
  const guides = guideData?.challengeMentorGuideList ?? [];

  /* 검색 */
  const [search, setSearch] = useState('');
  const filteredGuides = search
    ? guides.filter((g) => {
        const term = search.toLowerCase();
        return (
          g.title?.toLowerCase().includes(term) ||
          g.link?.toLowerCase().includes(term)
        );
      })
    : guides;

  /* CRUD mutations */
  const postMutation = usePostAdminChallengeMentorGuide();
  const patchMutation = usePatchAdminChallengeMentorGuide();
  const deleteMutation = useDeleteAdminChallengeMentorGuide();

  /* 모달 */
  const [modalState, setModalState] = useState<ModalState>({ open: false });
  const [form, setForm] = useState<NoticeForm>(INITIAL_FORM);

  const openCreateModal = () => {
    setForm(INITIAL_FORM);
    setModalState({ open: true, mode: 'create' });
  };

  const openEditModal = (guide: ChallengeMentorGuideItem) => {
    setForm({ title: guide.title ?? '', link: guide.link ?? '' });
    setModalState({
      open: true,
      mode: 'edit',
      guideId: guide.challengeMentorGuideId,
    });
  };

  const closeModal = () => {
    setModalState({ open: false });
    setForm(INITIAL_FORM);
  };

  const handleSubmit = async () => {
    if (!modalState.open) return;

    if (modalState.mode === 'create') {
      if (!selectedChallengeMentorId) {
        alert('멘토를 먼저 선택해주세요.');
        return;
      }
      await postMutation.mutateAsync({
        challengeMentorId: Number(selectedChallengeMentorId),
        title: form.title,
        link: form.link,
      });
    } else {
      await patchMutation.mutateAsync({
        challengeMentorGuideId: modalState.guideId,
        title: form.title,
        link: form.link,
      });
    }

    closeModal();
  };

  const handleDelete = async (guideId: number) => {
    if (!window.confirm('공지를 삭제하시겠습니까?')) return;
    await deleteMutation.mutateAsync(guideId);
  };

  /* 파생 값 */
  const selectedMentorName =
    mentorData?.mentorList.find(
      (m) => String(m.challengeMentorId) === selectedChallengeMentorId,
    )?.name ?? '';

  const selectedChallengeTitle =
    challengeData?.programList.find(
      (p) => String(p.id) === selectedChallengeId,
    )?.title ?? '';

  const columns = buildColumns(openEditModal, handleDelete);

  const isMentorSelected = !!selectedChallengeMentorId;

  return (
    <>
      <div className="rounded-lg border border-neutral-80 p-6">
        <div className="mb-6 flex items-center justify-between">
          <Heading>멘토 공지 관리</Heading>
          <Button
            variant="contained"
            onClick={openCreateModal}
            disabled={!isMentorSelected}
          >
            공지 작성
          </Button>
        </div>

        {/* 챌린지 & 멘토 선택 */}
        <div className="mb-6 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xsmall14 font-medium text-neutral-0">
              챌린지 선택
            </label>
            <select
              className="w-[280px] rounded border border-neutral-80 px-3 py-2 text-xsmall14"
              value={selectedChallengeId}
              onChange={(e) => {
                setSelectedChallengeId(e.target.value);
                setSelectedChallengeMentorId('');
              }}
            >
              <option value="">챌린지를 선택하세요</option>
              {challengeData?.programList.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xsmall14 font-medium text-neutral-0">
              멘토 선택
            </label>
            <select
              className="w-[200px] rounded border border-neutral-80 px-3 py-2 text-xsmall14"
              value={selectedChallengeMentorId}
              onChange={(e) => setSelectedChallengeMentorId(e.target.value)}
              disabled={!selectedChallengeId}
            >
              <option value="">멘토를 선택하세요</option>
              {mentorData?.mentorList.map((mentor) => (
                <option
                  key={mentor.challengeMentorId}
                  value={mentor.challengeMentorId}
                >
                  {mentor.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 선택된 챌린지/멘토 정보 */}
        {isMentorSelected && (
          <div className="mb-4 text-xsmall14 text-neutral-30">
            <span className="font-medium">{selectedChallengeTitle}</span>
            {' > '}
            <span className="font-medium">{selectedMentorName}</span>
            {' 멘토의 공지 목록'}
          </div>
        )}

        {/* 검색 */}
        {isMentorSelected && (
          <div className="mb-6 flex items-center gap-3">
            <label className="text-xsmall16 font-medium text-neutral-0">
              검색
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[400px] rounded border border-neutral-80 px-3 py-2 text-xsmall14"
              placeholder="제목, 링크로 검색"
            />
          </div>
        )}

        {/* 테이블 */}
        {isMentorSelected ? (
          <DataGrid
            rows={filteredGuides}
            columns={columns}
            loading={isLoading}
            disableRowSelectionOnClick
            autoHeight
            hideFooter
            getRowId={(row) => row.challengeMentorGuideId}
            localeText={{ noRowsLabel: '등록된 공지가 없습니다.' }}
            sx={{
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
        ) : (
          <div className="py-16 text-center text-xsmall14 text-neutral-40">
            {selectedChallengeId
              ? '멘토를 선택하면 공지 목록이 표시됩니다.'
              : '챌린지와 멘토를 선택하면 공지 목록이 표시됩니다.'}
          </div>
        )}
      </div>

      {/* 공지 작성 / 수정 모달 */}
      <Dialog open={modalState.open} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {modalState.open && modalState.mode === 'create'
            ? '공지 작성'
            : '공지 수정'}
        </DialogTitle>
        <DialogContent>
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">제목</label>
              <input
                type="text"
                className="w-full rounded border border-neutral-80 px-3 py-2 text-sm"
                placeholder="공지 제목"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">링크</label>
              <input
                type="text"
                className="w-full rounded border border-neutral-80 px-3 py-2 text-sm"
                placeholder="https://"
                value={form.link}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, link: e.target.value }))
                }
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="inherit">
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!form.title && !form.link}
          >
            {modalState.open && modalState.mode === 'create' ? '등록' : '수정'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
