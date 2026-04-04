'use client';

import { useMemo, useState } from 'react';
import {
  useAdminChallengeMentorGuideAllQuery,
  usePostAdminChallengeMentorGuide,
  usePatchAdminChallengeMentorGuide,
  useDeleteAdminChallengeMentorGuide,
} from '@/api/challenge-mentor-guide/challengeMentorGuide';
import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import { useGetChallengeList } from '@/api/challenge/challenge';
import type {
  ChallengeMentorGuideItem,
  ChallengeScopeType,
  MentorScopeType,
} from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';
import Heading from '@/domain/admin/ui/heading/Heading';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { FaEdit } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';
import EditorApp, { emptyEditorState } from '@/domain/admin/lexical/EditorApp';

/** 문자열이 Lexical JSON인지 확인. 아니면 Lexical JSON으로 감싸서 반환 */
function toLexicalJson(text: string | undefined): string | undefined {
  if (!text) return undefined;
  try {
    const parsed = JSON.parse(text);
    if (parsed?.root) return text; // 이미 Lexical JSON
  } catch {
    // 일반 텍스트 → Lexical paragraph로 감싸기
    return JSON.stringify({
      root: {
        children: [
          {
            children: [
              { detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    });
  }
  return text;
}

/* ── 용량 표시 ── */

const DB_LIMIT = 65535; // TEXT 컬럼 기준

function ContentSizeIndicator({ content }: { content: string }) {
  const bytes = new TextEncoder().encode(content).length;
  const kb = (bytes / 1024).toFixed(1);
  const percent = Math.min((bytes / DB_LIMIT) * 100, 100);
  const isOver = bytes > DB_LIMIT;
  const isWarning = percent > 80;

  const barColor = isOver
    ? 'bg-red-500'
    : isWarning
      ? 'bg-amber-400'
      : 'bg-primary';

  return (
    <div className="mt-2 flex flex-col gap-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-90">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className={`text-right text-xs ${isOver ? 'font-medium text-red-500' : 'text-neutral-40'}`}>
        {kb} KB / {(DB_LIMIT / 1024).toFixed(0)} KB ({percent.toFixed(1)}%)
        {isOver && ' — 용량 초과!'}
      </div>
    </div>
  );
}

/* ── 타입 ── */

type ContentType = 'URL' | 'EDITOR' | 'MARKDOWN';

interface NoticeForm {
  title: string;
  link: string;
  contents: string;
  contentType: ContentType;
  challengeScopeType: ChallengeScopeType;
  mentorScopeType: MentorScopeType;
  challengeId: string;
  challengeMentorId: string;
}

type ModalState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; guideId: number };

const INITIAL_FORM: NoticeForm = {
  title: '',
  link: '',
  contents: '',
  contentType: 'URL',
  challengeScopeType: 'ALL',
  mentorScopeType: 'ALL_MENTOR',
  challengeId: '',
  challengeMentorId: '',
};

const DATA_GRID_LOCALE_TEXT = {
  noRowsLabel: '등록된 공지가 없습니다.',
} as const;

const SCOPE_LABELS: Record<string, string> = {
  ALL: '전체 챌린지',
  SPECIFIC: '특정 챌린지',
};

const MENTOR_SCOPE_LABELS: Record<string, string> = {
  ALL_MENTOR: '모든 멘토',
  SPECIFIC_MENTOR: '특정 멘토',
};

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
      minWidth: 180,
      valueGetter: (_, row) => row.title ?? '-',
    },
    {
      field: 'contentType',
      headerName: '유형',
      width: 80,
      valueGetter: (_, row) => {
        if (!row.contents) return 'URL';
        try {
          const parsed = JSON.parse(row.contents);
          return parsed?.root ? '에디터' : 'MD';
        } catch {
          return 'MD';
        }
      },
    },
    {
      field: 'challengeScopeType',
      headerName: '범위',
      width: 110,
      valueGetter: (_, row) =>
        SCOPE_LABELS[row.challengeScopeType ?? 'ALL'] ?? '-',
    },
    {
      field: 'mentorScopeType',
      headerName: '대상',
      width: 110,
      valueGetter: (_, row) =>
        MENTOR_SCOPE_LABELS[row.mentorScopeType ?? 'ALL_MENTOR'] ?? '-',
    },
    {
      field: 'link',
      headerName: '링크',
      flex: 1,
      minWidth: 150,
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
          <span className="text-neutral-40">-</span>
        ),
    },
    {
      field: 'createDate',
      headerName: '등록일',
      width: 140,
      valueGetter: (_, row) =>
        row.createDate ? new Date(row.createDate).toLocaleDateString() : '-',
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
  /* 전체 가이드 목록 */
  const { data: guideData, isLoading } =
    useAdminChallengeMentorGuideAllQuery();
  const guides = guideData?.challengeMentorGuideList ?? [];

  /* 챌린지 & 멘토 데이터 (폼 드롭다운용) */
  const { data: challengeData } = useGetChallengeList({
    pageable: { size: 1000, page: 1 },
  });
  const [formChallengeId, setFormChallengeId] = useState('');
  const { data: mentorData } = useAdminChallengeMentorListQuery(
    formChallengeId || undefined,
  );

  /* 검색 */
  const [search, setSearch] = useState('');
  const filteredGuides = useMemo(() => {
    if (!search) return guides;
    const term = search.toLowerCase();
    return guides.filter(
      (g) =>
        g.title?.toLowerCase().includes(term) ||
        g.link?.toLowerCase().includes(term) ||
        g.contents?.toLowerCase().includes(term),
    );
  }, [guides, search]);

  /* CRUD mutations */
  const postMutation = usePostAdminChallengeMentorGuide();
  const patchMutation = usePatchAdminChallengeMentorGuide();
  const deleteMutation = useDeleteAdminChallengeMentorGuide();

  /* 모달 */
  const [modalState, setModalState] = useState<ModalState>({ open: false });
  const [form, setForm] = useState<NoticeForm>(INITIAL_FORM);

  const openCreateModal = () => {
    setForm(INITIAL_FORM);
    setFormChallengeId('');
    setModalState({ open: true, mode: 'create' });
  };

  const openEditModal = (guide: ChallengeMentorGuideItem) => {
    const hasContents = !!guide.contents;
    let contentType: ContentType = 'URL';
    if (hasContents) {
      try {
        const parsed = JSON.parse(guide.contents!);
        contentType = parsed?.root ? 'EDITOR' : 'MARKDOWN';
      } catch {
        contentType = 'MARKDOWN';
      }
    }
    setForm({
      title: guide.title ?? '',
      link: guide.link ?? '',
      contents: guide.contents ?? '',
      contentType,
      challengeScopeType: (guide.challengeScopeType ?? 'ALL') as ChallengeScopeType,
      mentorScopeType: (guide.mentorScopeType ?? 'ALL_MENTOR') as MentorScopeType,
      challengeId: guide.challengeId ? String(guide.challengeId) : '',
      challengeMentorId: guide.challengeMentorId
        ? String(guide.challengeMentorId)
        : '',
    });
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
    setForm(INITIAL_FORM);
  };

  const handleSubmit = async () => {
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

  /* 파생 값 */
  const isCreateMode = modalState.open && modalState.mode === 'create';
  const isFormEmpty = !form.title;

  const columns = useMemo(
    () => buildColumns(openEditModal, handleDelete),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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

        {/* 검색 */}
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

        {/* 테이블 */}
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

      {/* 공지 작성 / 수정 모달 */}
      <Dialog
        open={modalState.open}
        onClose={closeModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{isCreateMode ? '공지 작성' : '공지 수정'}</DialogTitle>
        <DialogContent>
          <div className="mt-4 flex flex-col gap-4">
            {/* 제목 */}
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

            {/* 공지 전달 범위 */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                공지 전달 범위
              </label>
              <Select
                size="small"
                fullWidth
                value={form.challengeScopeType}
                onChange={(e: SelectChangeEvent) =>
                  setForm((prev) => ({
                    ...prev,
                    challengeScopeType: e.target.value as ChallengeScopeType,
                    challengeId: '',
                    challengeMentorId: '',
                  }))
                }
              >
                <MenuItem value="ALL">전체 챌린지</MenuItem>
                <MenuItem value="SPECIFIC">특정 챌린지</MenuItem>
              </Select>
            </div>

            {/* 챌린지 선택 (범위=SPECIFIC) */}
            {form.challengeScopeType === 'SPECIFIC' && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  챌린지 선택
                </label>
                <Select
                  size="small"
                  fullWidth
                  value={form.challengeId}
                  onChange={(e: SelectChangeEvent) => {
                    setForm((prev) => ({
                      ...prev,
                      challengeId: e.target.value,
                      challengeMentorId: '',
                    }));
                    setFormChallengeId(e.target.value);
                  }}
                  displayEmpty
                >
                  <MenuItem value="">챌린지를 선택하세요</MenuItem>
                  {challengeData?.programList.map((p) => (
                    <MenuItem key={p.id} value={String(p.id)}>
                      {p.title}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}

            {/* 전달 대상 */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                전달 대상
              </label>
              <Select
                size="small"
                fullWidth
                value={form.mentorScopeType}
                onChange={(e: SelectChangeEvent) =>
                  setForm((prev) => ({
                    ...prev,
                    mentorScopeType: e.target.value as MentorScopeType,
                    challengeMentorId: '',
                  }))
                }
              >
                <MenuItem value="ALL_MENTOR">모든 멘토</MenuItem>
                <MenuItem value="SPECIFIC_MENTOR">특정 멘토</MenuItem>
              </Select>
            </div>

            {/* 멘토 선택 (대상=SPECIFIC_MENTOR) */}
            {form.mentorScopeType === 'SPECIFIC_MENTOR' && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  멘토 선택
                </label>
                <Select
                  size="small"
                  fullWidth
                  value={form.challengeMentorId}
                  onChange={(e: SelectChangeEvent) =>
                    setForm((prev) => ({
                      ...prev,
                      challengeMentorId: e.target.value,
                    }))
                  }
                  displayEmpty
                  disabled={
                    form.challengeScopeType === 'SPECIFIC' &&
                    !form.challengeId
                  }
                >
                  <MenuItem value="">멘토를 선택하세요</MenuItem>
                  {mentorData?.mentorList.map((m) => (
                    <MenuItem
                      key={m.challengeMentorId}
                      value={String(m.challengeMentorId)}
                    >
                      {m.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}

            {/* 내용 유형 */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                내용 유형
              </label>
              <Select
                size="small"
                fullWidth
                value={form.contentType}
                onChange={(e: SelectChangeEvent) =>
                  setForm((prev) => ({
                    ...prev,
                    contentType: e.target.value as ContentType,
                  }))
                }
              >
                <MenuItem value="URL">URL 링크</MenuItem>
                <MenuItem value="EDITOR">에디터 (리치 텍스트)</MenuItem>
                <MenuItem value="MARKDOWN">마크다운 (텍스트)</MenuItem>
              </Select>
            </div>

            {/* URL 입력 */}
            {form.contentType === 'URL' && (
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
            )}

            {/* 리치 텍스트 입력 (Lexical 에디터) */}
            {form.contentType === 'EDITOR' && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  내용 (에디터)
                </label>
                <EditorApp
                  initialEditorStateJsonString={toLexicalJson(form.contents) || undefined}
                  onChange={(jsonString) =>
                    setForm((prev) => ({ ...prev, contents: jsonString }))
                  }
                />
                <ContentSizeIndicator content={form.contents} />
              </div>
            )}

            {/* 마크다운 텍스트 입력 */}
            {form.contentType === 'MARKDOWN' && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  내용 (마크다운)
                </label>
                <textarea
                  className="w-full rounded border border-neutral-80 px-3 py-2 font-mono text-sm"
                  rows={10}
                  placeholder="마크다운 형식으로 입력하세요"
                  value={form.contents}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, contents: e.target.value }))
                  }
                />
                <ContentSizeIndicator content={form.contents} />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="inherit">
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isFormEmpty}
          >
            {isCreateMode ? '등록' : '수정'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
