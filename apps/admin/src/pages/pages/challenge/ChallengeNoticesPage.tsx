import {
  useDeleteAdminNoticeMutation,
  useGetAdminNotices,
} from '@/api/challenge/noticeTemplate';
import WarningModal from '@/common/alert/WarningModal';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import ExposureModal from '@/domain/admin/challenge/notice/modal/ExposureModal';
import NoticeEditModal from '@/domain/admin/challenge/notice/modal/NoticeEditModal';
import TableLayout from '@/domain/admin/ui/table/TableLayout';
import dayjs from '@/lib/dayjs';
import { AdminNoticeResItem, AdminNoticeType } from '@/schema';
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

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

const ChallengeNoticesPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [exposureNoticeId, setExposureNoticeId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const { data, isLoading, error } = useGetAdminNotices(
    activeTab === 'ALL' ? undefined : activeTab,
  );
  const deleteMutation = useDeleteAdminNoticeMutation();

  const rows = data?.noticeList ?? [];

  const openEditModal = (item: AdminNoticeResItem) => {
    setEditingId(item.id);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
  };

  const deleteNotice = async () => {
    if (deleteTargetId === null) return;
    await deleteMutation.mutateAsync(deleteTargetId);
    setDeleteTargetId(null);
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
                  {row.url ? (
                    <a
                      href={row.url}
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
                    onClick={() => setExposureNoticeId(row.id)}
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
                      onClick={() => setDeleteTargetId(row.id)}
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
              onClick={() => setModalMode('create')}
            >
              추가
            </button>
          </div>
        }
      >
        <div className="pb-24">{renderContent()}</div>
      </TableLayout>

      <WarningModal
        isOpen={deleteTargetId !== null}
        title="공지 삭제"
        content="정말로 공지를 삭제하시겠습니까?"
        onConfirm={deleteNotice}
        onCancel={() => setDeleteTargetId(null)}
        confirmText="삭제"
      />

      {exposureNoticeId !== null && (
        <ExposureModal
          noticeId={exposureNoticeId}
          onClose={() => setExposureNoticeId(null)}
        />
      )}

      {modalMode !== null && (
        <NoticeEditModal
          mode={modalMode}
          editingId={editingId}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default ChallengeNoticesPage;
