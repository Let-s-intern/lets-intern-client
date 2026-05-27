import { useGetChallengeList } from '@/api/challenge/challenge';
import {
  useCreateAdminNoticeMutation,
  useDeleteAdminNoticeMutation,
  useGetAdminNoticeDetail,
  useGetAdminNotices,
  useGetNoticeChallenges,
  useUpdateAdminNoticeMutation,
  useUpdateNoticeChallengeMutation,
} from '@/api/challenge/noticeTemplate';
import WarningModal from '@/common/alert/WarningModal';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import ProgramRecommendEditor from '@/domain/program-recommend/ProgramRecommendEditor';
import TableLayout from '@/domain/admin/ui/table/TableLayout';
import {
  AdminNoticeResItem,
  AdminNoticeType,
  CreateAdminNoticeReq,
} from '@/schema';
import { ProgramRecommend } from '@/types/interface';
import dayjs from '@/lib/dayjs';
import { Pencil, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

type TabType = 'ALL' | AdminNoticeType;

const TABS: { label: string; value: TabType }[] = [
  { label: '전체', value: 'ALL' },
  { label: '공지사항', value: 'NOTICE' },
  { label: '가이드', value: 'GUIDE' },
  { label: '프로그램 추천', value: 'PROGRAM' },
];

const NOTICE_TYPE_LABEL: Record<AdminNoticeType, string> = {
  NOTICE: '공지사항',
  GUIDE: '가이드',
  PROGRAM: '프로그램 추천',
};

const EMPTY_FORM: CreateAdminNoticeReq = {
  type: 'NOTICE',
  title: '',
  link: '',
};

const defaultProgramRecommend: ProgramRecommend = { list: [] };

const ChallengeNoticesPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateAdminNoticeReq>(EMPTY_FORM);

  // 프로그램 추천 관련 state
  const [programRecommend, setProgramRecommend] = useState<ProgramRecommend>(
    defaultProgramRecommend,
  );
  const [moreButton, setMoreButton] = useState({ visible: false, url: '' });

  // 노출 영역 관리 모달
  const [exposureNoticeId, setExposureNoticeId] = useState<number | null>(null);
  const [selectedChallengeIds, setSelectedChallengeIds] = useState<number[]>(
    [],
  );

  // 삭제 모달
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const { data, isLoading, error } = useGetAdminNotices(
    activeTab === 'ALL' ? undefined : activeTab,
  );
  const createMutation = useCreateAdminNoticeMutation();
  const updateMutation = useUpdateAdminNoticeMutation();
  const deleteMutation = useDeleteAdminNoticeMutation();

  // 노출 영역 관리 hooks
  const challengeListQuery = useGetChallengeList({
    pageable: { page: 1, size: 10000 },
  });
  const noticeChallengesQuery = useGetNoticeChallenges(exposureNoticeId);
  const updateChallengesMutation = useUpdateNoticeChallengeMutation();

  const rows = data?.noticeList ?? [];

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setProgramRecommend(defaultProgramRecommend);
    setMoreButton({ visible: false, url: '' });
    setModalMode('create');
  };

  const detailQuery = useGetAdminNoticeDetail(editingId);

  const openEditModal = (item: AdminNoticeResItem) => {
    setEditingId(item.id);
    setModalMode('edit');
  };

  // 단건 조회 데이터로 편집 폼 초기화
  useEffect(() => {
    if (!detailQuery.data || modalMode !== 'edit') return;
    const detail = detailQuery.data;
    setForm({
      type: detail.type ?? 'NOTICE',
      title: detail.title ?? '',
      link: detail.link ?? '',
    });
    if (detail.type === 'PROGRAM') {
      setProgramRecommend({
        list: (detail.programList ?? []).map((p) => ({
          programInfo: {
            id: p.programId,
            programType: p.programType,
            title: p.title,
            thumbnail: p.thumbnail ?? '',
          } as ProgramRecommend['list'][number]['programInfo'],
          classificationList: [],
          adminClassificationList: [],
          recommendTitle: p.title,
          recommendCTA: p.cta,
        })),
      });
      setMoreButton({
        visible: detail.isMoreVisible ?? false,
        url: detail.moreLink ?? '',
      });
    }
  }, [detailQuery.data, modalMode]);

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setProgramRecommend(defaultProgramRecommend);
    setMoreButton({ visible: false, url: '' });
  };

  const isProgramType = form.type === 'PROGRAM';

  const canSave = isProgramType
    ? programRecommend.list.length > 0 &&
      programRecommend.list.every(
        (item) => item.recommendTitle && item.recommendCTA,
      )
    : form.title.trim() !== '';

  const buildReqBody = (): CreateAdminNoticeReq => {
    if (isProgramType) {
      return {
        ...form,
        isMoreVisible: moreButton.visible,
        moreLink: moreButton.url,
        programList: programRecommend.list.map((item) => ({
          programType: item.programInfo.programType,
          programId: item.programInfo.id,
          title: item.recommendTitle ?? '',
          cta: item.recommendCTA ?? '',
        })),
      };
    }
    return form;
  };

  const handleSubmit = async () => {
    const body = buildReqBody();
    if (modalMode === 'create') {
      await createMutation.mutateAsync(body);
    } else if (modalMode === 'edit' && editingId !== null) {
      await updateMutation.mutateAsync({ id: editingId, ...body });
    }
    closeModal();
  };

  const handleDeleteButtonClicked = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteModalShown(true);
  };

  const deleteNotice = async () => {
    if (deleteTargetId === null) return;
    await deleteMutation.mutateAsync(deleteTargetId);
    setIsDeleteModalShown(false);
    setDeleteTargetId(null);
  };

  // 노출 영역 관리
  const openExposureModal = (noticeId: number) => {
    setExposureNoticeId(noticeId);
  };

  useEffect(() => {
    if (!noticeChallengesQuery.data) return;
    setSelectedChallengeIds(noticeChallengesQuery.data.challengeIdList ?? []);
  }, [noticeChallengesQuery.data]);

  const closeExposureModal = () => {
    setExposureNoticeId(null);
    setSelectedChallengeIds([]);
  };

  const handleToggleChallenge = (challengeId: number, checked: boolean) => {
    setSelectedChallengeIds((prev) =>
      checked
        ? [...prev, challengeId]
        : prev.filter((id) => id !== challengeId),
    );
  };

  const allChallengeIds =
    challengeListQuery.data?.programList?.map((item) => item.id) ?? [];
  const isAllSelected =
    allChallengeIds.length > 0 &&
    allChallengeIds.every((id) => selectedChallengeIds.includes(id));
  const isSomeSelected =
    !isAllSelected &&
    allChallengeIds.some((id) => selectedChallengeIds.includes(id));

  const selectAllRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) node.indeterminate = isSomeSelected;
    },
    [isSomeSelected],
  );

  const handleToggleAll = (checked: boolean) => {
    setSelectedChallengeIds(checked ? [...allChallengeIds] : []);
  };

  const handleSaveExposure = async () => {
    if (exposureNoticeId === null) return;
    await updateChallengesMutation.mutateAsync({
      noticeId: exposureNoticeId,
      challengeIdList: selectedChallengeIds,
    });
    closeExposureModal();
  };

  const renderContent = () => {
    if (isLoading) return <LoadingContainer />;

    if (error) {
      const message =
        error instanceof Error ? error.message : '알 수 없는 오류';
      return (
        <div className="py-16 text-center text-sm text-red-500">
          공지 목록을 불러오지 못했습니다: {message}
        </div>
      );
    }

    if (rows.length === 0)
      return <EmptyContainer text="등록된 공지가 없습니다." />;

    return (
      <div className="rounded-xxs overflow-x-auto border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="w-[80px] px-4 py-3 text-left font-medium text-gray-600">
                ID
              </th>
              <th className="w-[150px] px-4 py-3 text-left font-medium text-gray-600">
                콘텐츠 구분
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                제목
              </th>
              <th className="w-[150px] px-4 py-3 text-left font-medium text-gray-600">
                생성일
              </th>
              <th className="w-[150px] px-4 py-3 text-left font-medium text-gray-600">
                URL
              </th>
              <th className="w-[180px] px-4 py-3 text-left font-medium text-gray-600">
                노출 영역 관리
              </th>
              <th className="w-[80px] px-4 py-3 text-center font-medium text-gray-600">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="px-4 py-4 text-gray-700">{row.id}</td>
                <td className="px-4 py-4 text-gray-700">
                  {row.type ? NOTICE_TYPE_LABEL[row.type] : '-'}
                </td>
                <td className="px-4 py-4 text-gray-700">{row.title ?? '-'}</td>
                <td className="px-4 py-4 text-gray-700">
                  {row.createDate
                    ? dayjs(row.createDate).format('YYYY-MM-DD')
                    : '-'}
                </td>
                <td className="px-4 py-4">
                  {row.link ? (
                    <a
                      href={row.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      URL 확인
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => openExposureModal(row.id)}
                    className="rounded-xxs border-primary text-xsmall14 text-primary hover:bg-primary-20 border bg-white px-4 py-0.5 duration-200 hover:font-semibold"
                  >
                    노출 영역 관리
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <Pencil
                      size={16}
                      className="cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={() => openEditModal(row)}
                    />
                    <Trash
                      size={16}
                      className="cursor-pointer text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteButtonClicked(row.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <TableLayout
        title="전체 공지 관리"
        tabs={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              {TABS.map((tab, idx) => (
                <span key={tab.value} className="flex items-center gap-3">
                  {idx > 0 && <span className="text-gray-300">|</span>}
                  <button
                    className={
                      activeTab === tab.value
                        ? 'text-primary'
                        : 'text-neutral-40'
                    }
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </button>
                </span>
              ))}
            </div>
            <button
              className="rounded-xxs border-primary text-xsmall14 text-primary hover:bg-primary-20 border bg-white px-4 py-0.5 duration-200 hover:font-semibold"
              onClick={openCreateModal}
            >
              추가
            </button>
          </div>
        }
      >
        <div className="pb-24">{renderContent()}</div>
      </TableLayout>

      {/* 삭제 확인 모달 */}
      <WarningModal
        isOpen={isDeleteModalShown}
        title="공지 삭제"
        content="정말로 공지를 삭제하시겠습니까?"
        onConfirm={deleteNotice}
        onCancel={() => setIsDeleteModalShown(false)}
        confirmText="삭제"
      />

      {/* 노출 영역 관리 모달 */}
      {exposureNoticeId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeExposureModal}
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-semibold">노출 영역 관리</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveExposure}
                  disabled={updateChallengesMutation.isPending}
                  className="rounded bg-[#4F5BDB] px-5 py-2 text-sm font-medium text-white hover:opacity-80 disabled:bg-neutral-300"
                >
                  저장
                </button>
                <button
                  onClick={closeExposureModal}
                  className="rounded bg-neutral-400 px-5 py-2 text-sm font-medium text-white hover:opacity-80"
                >
                  취소
                </button>
              </div>
            </div>
            <div className="mx-3 flex-1 overflow-auto">
              {challengeListQuery.isLoading ? (
                <LoadingContainer />
              ) : (
                <table className="min-w-full table-auto">
                  <thead className="sticky top-0 bg-neutral-100">
                    <tr className="border-y text-sm text-zinc-600">
                      <th className="w-25 px-4 py-3 text-center font-medium">
                        노출 여부
                      </th>
                      <th className="px-4 py-3 text-center font-medium">
                        챌린지 제목
                      </th>
                      <th className="w-56 px-4 py-3 text-center font-medium">
                        챌린지 기간
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b text-sm">
                      <td className="px-4 py-3 text-center">
                        <input
                          ref={selectAllRef}
                          className="h-4 w-4 accent-[#4F5BDB]"
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={(e) => handleToggleAll(e.target.checked)}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium" colSpan={2}>
                        전체선택
                      </td>
                    </tr>
                    {challengeListQuery.data?.programList?.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b text-sm hover:bg-neutral-50"
                      >
                        <td className="px-4 py-3 text-center">
                          <input
                            className="h-4 w-4 accent-[#4F5BDB]"
                            type="checkbox"
                            checked={selectedChallengeIds.includes(item.id)}
                            onChange={(e) =>
                              handleToggleChallenge(item.id, e.target.checked)
                            }
                          />
                        </td>
                        <td className="px-4 py-3">{item.title ?? '-'}</td>
                        <td className="px-4 py-3 text-right text-zinc-500">
                          {item.startDate?.slice(0, 10) ?? '-'} ~{' '}
                          {item.endDate?.slice(0, 10) ?? '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalMode !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
            <div className="overflow-y-auto p-6">
              <h2 className="mb-4 text-lg font-semibold">
                {modalMode === 'create' ? '전체 공지 추가' : '전체 공지 수정'}
              </h2>

              {/* 콘텐츠 유형 */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  콘텐츠 유형
                </label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as AdminNoticeType,
                    }))
                  }
                >
                  <option value="" disabled>
                    유형을 선택해주세요.
                  </option>
                  <option value="NOTICE">공지사항</option>
                  <option value="GUIDE">가이드</option>
                  <option value="PROGRAM">프로그램 추천</option>
                </select>
              </div>

              {/* 공지사항/가이드: 제목 + URL */}
              {!isProgramType && (
                <>
                  <div className="mb-3">
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                      제목
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border px-3 py-2 text-sm"
                      placeholder="제목"
                      value={form.title}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                      URL
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border px-3 py-2 text-sm"
                      placeholder="https://..."
                      value={form.link}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          link: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}

              {/* 프로그램 추천 */}
              {isProgramType && (
                <>
                  <ProgramRecommendEditor
                    programRecommend={programRecommend}
                    setProgramRecommend={setProgramRecommend}
                  />

                  <div className="mb-3 mt-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#4F5BDB]"
                        checked={moreButton.visible}
                        onChange={(e) =>
                          setMoreButton((prev) => ({
                            ...prev,
                            visible: e.target.checked,
                          }))
                        }
                      />
                      더보기 버튼 노출 여부
                    </label>
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="w-full rounded border px-3 py-2 text-sm disabled:bg-neutral-100"
                      placeholder="URL을 입력하세요"
                      value={moreButton.url}
                      disabled={!moreButton.visible}
                      onChange={(e) =>
                        setMoreButton((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 border-t px-6 py-4">
              <button
                onClick={closeModal}
                className="flex-1 rounded border border-zinc-300 py-3 text-sm font-medium text-zinc-600 hover:bg-neutral-50"
              >
                취소하기
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !canSave ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                className="flex-1 rounded bg-[#4F5BDB] py-3 text-sm font-medium text-white hover:opacity-80 disabled:bg-neutral-300 disabled:text-neutral-500"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChallengeNoticesPage;
