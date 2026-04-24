import { useMemo } from 'react';
import GridActionLink from '@/domain/admin/ui/table/GridActionLink';

import { CommonBannerAdminAllItemType } from '@/api/banner';
import WarningModal from '@/common/alert/WarningModal';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import ActiveBannerTable from '@/pages/banner/common-banner/ActiveBannerTable';
import CommonBannerVisibilityToggle from '@/pages/banner/common-banner/CommonBannerVisibilityToggle';
import useCommonBanners from '@/domain/admin/pages/banner/common-banner/useCommonBanners';
import TableLayout from '@/domain/admin/ui/table/TableLayout';
import dayjs from '@/lib/dayjs';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Pencil, RefreshCw, Trash } from 'lucide-react';

const CommonBanners = () => {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    error,
    groupedActiveBanners,
    allBanners,
    isDeleteModalShown,
    setIsDeleteModalShown,
    bannerIdForDeleting,
    handleDeleteButtonClicked,
    deleteCommonBanner,
    isUpdatingExpired,
    updateExpiredBanners,
  } = useCommonBanners();

  const allColumns = useMemo<
    GridColDef<CommonBannerAdminAllItemType & { uniqueId: string }>[]
  >(
    () => [
      {
        field: 'title',
        headerName: '제목',
        flex: 1,
        valueGetter: (_, row) => row.title || '-',
      },
      {
        field: 'landingUrl',
        headerName: '링크',
        width: 300,
        valueGetter: (_, row) => row.landingUrl || '-',
      },
      {
        field: 'isVisible',
        headerName: '노출 여부',
        width: 150,
        renderCell: ({ row }) => (
          <CommonBannerVisibilityToggle
            commonBannerId={row.commonBannerId}
            isVisible={row.isVisible ?? false}
          />
        ),
      },
      {
        field: 'date',
        headerName: '노출 기간',
        width: 250,
        valueGetter: (_, row) =>
          `${row.startDate ? dayjs(row.startDate).format('YYYY-MM-DD') : '미지정'} ~ ${row.endDate ? dayjs(row.endDate).format('YYYY-MM-DD') : '미지정'}`,
      },
      {
        field: 'management',
        type: 'actions',
        headerName: '관리',
        width: 100,
        getActions: (
          params: GridRowParams<
            CommonBannerAdminAllItemType & { uniqueId: string }
          >,
        ) => {
          const id = params.row.commonBannerId;

          return [
            <GridActionLink
              to={`/banner/common-banners/${id}/edit`}
              key={'edit' + id}
            >
              <Pencil />
            </GridActionLink>,
            <Trash
              key={'delete' + id}
              className="ml-4 cursor-pointer"
              color="red"
              onClick={() => handleDeleteButtonClicked(Number(id))}
            />,
          ];
        },
      },
    ],
    [handleDeleteButtonClicked],
  );

  const renderContent = () => {
    if (isLoading) {
      return <LoadingContainer />;
    }

    if (error) {
      return <EmptyContainer />;
    }

    if (activeTab === 'active') {
      return (
        <div className="overflow-x-auto rounded-xxs border border-gray-200">
          <ActiveBannerTable
            groupedData={groupedActiveBanners}
            onDeleteClick={handleDeleteButtonClicked}
          />
        </div>
      );
    }

    if (activeTab === 'all') {
      if (allBanners.length === 0) {
        return <EmptyContainer />;
      }

      return (
        <DataGrid
          rows={allBanners}
          getRowId={(row) => row.uniqueId}
          columns={allColumns}
          hideFooter
        />
      );
    }

    return <EmptyContainer />;
  };

  return (
    <>
      <TableLayout
        title="통합 배너 관리"
        headerButton={{
          label: '등록',
          href: '/banner/common-banners/new',
        }}
        tabs={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <button
                className={
                  activeTab === 'active' ? 'text-primary' : 'text-neutral-40'
                }
                onClick={() => setActiveTab('active')}
              >
                노출 중
              </button>
              <span className="text-gray-300">|</span>
              <button
                className={
                  activeTab === 'all' ? 'text-primary' : 'text-neutral-40'
                }
                onClick={() => setActiveTab('all')}
              >
                전체
              </button>
            </div>
            <button
              className="flex items-center gap-1 rounded-xxs border border-primary bg-white px-4 py-0.5 text-xsmall14 text-primary duration-200 hover:bg-primary-20 hover:font-semibold disabled:opacity-50"
              disabled={isUpdatingExpired}
              onClick={() => updateExpiredBanners()}
            >
              <RefreshCw
                size={14}
                className={isUpdatingExpired ? 'animate-spin' : ''}
              />
              {isUpdatingExpired ? '업데이트 중...' : '업데이트'}
            </button>
          </div>
        }
      >
        <div className="pb-24">{renderContent()}</div>
      </TableLayout>
      <WarningModal
        isOpen={isDeleteModalShown}
        title="배너 삭제"
        content="정말로 배너를 삭제하시겠습니까?"
        onConfirm={() =>
          bannerIdForDeleting && deleteCommonBanner(bannerIdForDeleting)
        }
        onCancel={() => setIsDeleteModalShown(false)}
        confirmText="삭제"
      />
    </>
  );
};

export default CommonBanners;
