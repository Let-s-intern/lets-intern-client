'use client';

import { useMemo, useState } from 'react';
import {
  AdminChallengeMentorGuideQueryKey,
  useAdminChallengeMentorGuideAllQuery,
  usePostAdminChallengeMentorGuide,
  usePatchAdminChallengeMentorGuide,
  useDeleteAdminChallengeMentorGuide,
} from '@/api/challenge-mentor-guide/challengeMentorGuide';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import { useGetChallengeList } from '@/api/challenge/challenge';
import type { ChallengeMentorGuideItem } from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';
import Heading from '@/domain/admin/ui/heading/Heading';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { buildColumns } from './mentor-notice/table/buildColumns';
import { NoticeFormModal } from './mentor-notice/modals/NoticeFormModal';
import {
  INITIAL_FORM,
  DATA_GRID_LOCALE_TEXT,
  type NoticeForm,
  type ModalState,
} from './mentor-notice/types';
import { guideToForm } from './mentor-notice/utils/formAdapter';

export default function MentorNoticeManagement() {
  const queryClient = useQueryClient();

  const { data: guideData, isLoading } =
    useAdminChallengeMentorGuideAllQuery();

  const { data: challengeData } = useGetChallengeList({
    pageable: { size: 1000, page: 1 },
  });
  const [formChallengeId, setFormChallengeId] = useState('');
  const { data: mentorData } = useAdminChallengeMentorListQuery(
    formChallengeId || undefined,
  );

  const [search, setSearch] = useState('');
  const filteredGuides = useMemo(() => {
    const guides = guideData?.challengeMentorGuideList ?? [];
    if (!search) return guides;
    const term = search.toLowerCase();
    return guides.filter(
      (g) =>
        g.title?.toLowerCase().includes(term) ||
        g.link?.toLowerCase().includes(term) ||
        g.contents?.toLowerCase().includes(term),
    );
  }, [guideData, search]);

  const postMutation = usePostAdminChallengeMentorGuide();
  const patchMutation = usePatchAdminChallengeMentorGuide();
  const deleteMutation = useDeleteAdminChallengeMentorGuide();

  const [modalState, setModalState] = useState<ModalState>({ open: false });
  const [modalInitialForm, setModalInitialForm] =
    useState<NoticeForm>(INITIAL_FORM);

  const openCreateModal = () => {
    setModalInitialForm(INITIAL_FORM);
    setFormChallengeId('');
    setModalState({ open: true, mode: 'create' });
  };

  const openEditModal = (guide: ChallengeMentorGuideItem) => {
    setModalInitialForm(guideToForm(guide));
    if (guide.challengeId) {
      setFormChallengeId(String(guide.challengeId));
    }
    setModalState({
      open: true,
      mode: 'edit',
      guideId: guide.challengeMentorGuideId,
    });
  };

  const closeModal = () => {
    setModalState({ open: false });
  };

  const handleSubmit = async (form: NoticeForm) => {
    if (!modalState.open) return;

    const body = {
      title: form.title,
      link: form.contentType === 'URL' ? form.link : undefined,
      contents: form.contentType !== 'URL' ? form.contents : undefined,
      challengeScopeType: form.challengeScopeType,
      mentorScopeType: form.mentorScopeType,
      challengeId:
        form.challengeScopeType === 'SPECIFIC' && form.challengeId
          ? Number(form.challengeId)
          : undefined,
      challengeMentorId:
        form.mentorScopeType === 'SPECIFIC_MENTOR' && form.challengeMentorId
          ? Number(form.challengeMentorId)
          : undefined,
      dateType: form.dateType,
      startDate:
        form.dateType === 'CUSTOM' && form.startDate
          ? form.startDate
          : undefined,
      endDate:
        form.dateType === 'CUSTOM' && form.endDate ? form.endDate : undefined,
      isFixed: form.isFixed,
    };

    if (modalState.mode === 'create') {
      await postMutation.mutateAsync(body);
    } else {
      await patchMutation.mutateAsync({
        challengeMentorGuideId: modalState.guideId,
        ...body,
      });
    }

    closeModal();
  };

  const handleDelete = async (guideId: number) => {
    if (!window.confirm('공지를 삭제하시겠습니까?')) return;
    await deleteMutation.mutateAsync(guideId);
  };

  const handleToggleVisible = async (guideId: number, isVisible: boolean) => {
    await patchMutation.mutateAsync({
      challengeMentorGuideId: guideId,
      isVisible,
    });
    queryClient.invalidateQueries({
      queryKey: [AdminChallengeMentorGuideQueryKey],
    });
  };

  const challengeMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const p of challengeData?.programList ?? []) {
      map.set(p.id, p.title ?? '');
    }
    return map;
  }, [challengeData]);

  const mentorMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const m of mentorData?.mentorList ?? []) {
      map.set(m.challengeMentorId, m.name);
    }
    return map;
  }, [mentorData]);

  const columns = useMemo(
    () =>
      buildColumns({
        onEdit: openEditModal,
        onDelete: handleDelete,
        onToggleVisible: handleToggleVisible,
        challengeMap,
        mentorMap,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [challengeMap, mentorMap],
  );

  return (
    <>
      <div className="rounded-lg border border-neutral-80 p-6">
        <div className="mb-6 flex items-center justify-between">
          <Heading>멘토 공지 관리</Heading>
          <Button variant="contained" onClick={openCreateModal}>
            공지 작성
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <label className="text-xsmall16 font-medium text-neutral-0">
            검색
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[400px] rounded border border-neutral-80 px-3 py-2 text-xsmall14"
            placeholder="제목, 링크, 내용으로 검색"
          />
        </div>

        <DataGrid
          rows={filteredGuides}
          columns={columns}
          loading={isLoading}
          disableRowSelectionOnClick
          autoHeight
          hideFooter
          getRowId={(row) => row.challengeMentorGuideId}
          localeText={DATA_GRID_LOCALE_TEXT}
        />
      </div>

      <NoticeFormModal
        open={modalState.open}
        mode={modalState.open ? modalState.mode : 'create'}
        initialForm={modalInitialForm}
        challengeList={challengeData?.programList ?? []}
        mentorList={mentorData?.mentorList ?? []}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onChallengeIdChange={setFormChallengeId}
      />
    </>
  );
}
