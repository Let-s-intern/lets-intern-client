'use client';

import { Checkbox } from '@mui/material';
import { useState } from 'react';

import {
  useDeleteProgramBannerMutation,
  useEditProgramBannerMutation,
  useGetProgramBannerListQuery,
} from '@/api/program';
import TableCell from '@/components/admin/ui/table/new/TableCell';
import TableManageContent from '@/components/admin/ui/table/new/TableManageContent';
import TableRow from '@/components/admin/ui/table/new/TableRow';
import TableTemplate, {
  TableTemplateProps,
} from '@/components/admin/ui/table/new/TableTemplate';
import AlertModal from '@/components/ui/alert/AlertModal';
import dayjs from '@/lib/dayjs';
import Link from 'next/link';
import { CiTrash } from 'react-icons/ci';

type ProgramBannersTableKey =
  | 'title'
  | 'link'
  | 'visible'
  | 'visiblePeriod'
  | 'management';

const PopUpBanners = () => {
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [bannerIdForDeleting, setBannerIdForDeleting] = useState<number>();

  const columnMetaData: TableTemplateProps<ProgramBannersTableKey>['columnMetaData'] =
    {
      title: {
        headLabel: '제목',
        cellWidth: 'w-3/12',
      },
      link: {
        headLabel: '링크',
        cellWidth: 'w-3/12',
      },
      visible: {
        headLabel: '노출 여부',
        cellWidth: 'w-1/12',
      },
      visiblePeriod: {
        headLabel: '노출 기간',
        cellWidth: 'w-3/12',
      },
      management: {
        headLabel: '관리',
        cellWidth: 'w-2/12',
      },
    };

  const {
    data: programBannerList,
    isLoading,
    error,
  } = useGetProgramBannerListQuery();

  const { mutate: tryDeleteBanner } = useDeleteProgramBannerMutation({
    onSuccess: async () => {
      setIsDeleteModalShown(false);
    },
    onError: (error) => {
      console.error(error);
      alert('프로그램 배너 삭제에 실패했습니다.');
      setIsDeleteModalShown(false);
    },
  });

  const { mutate: tryEditVisible } = useEditProgramBannerMutation({
    onError: (error) => {
      console.error(error);
      alert('프로그램 배너 노출 여부 수정에 실패했습니다.');
    },
  });

  const handleVisibleCheckboxClicked = (
    bannerId: number,
    isVisible: boolean,
  ) => {
    const formData = new FormData();
    formData.append(
      'requestDto',
      new Blob([JSON.stringify({ isVisible })], { type: 'application/json' }),
    );

    tryEditVisible({ bannerId, formData });
  };

  const handleDeleteButtonClicked = async (bannerId: number) => {
    setBannerIdForDeleting(bannerId);
    setIsDeleteModalShown(true);
  };

  return (
    <>
      <TableTemplate<ProgramBannersTableKey>
        title="프로그램 배너 관리"
        headerButton={{
          label: '등록',
          href: '/admin/banner/program-banners/new',
        }}
        columnMetaData={columnMetaData}
        minWidth="60rem"
      >
        {!programBannerList ? (
          isLoading ? (
            <div className="py-6 text-center">로딩 중...</div>
          ) : error ? (
            <div className="py-6 text-center">에러 발생</div>
          ) : (
            <div className="py-6 text-center">프로그램 배너가 없습니다.</div>
          )
        ) : programBannerList.bannerList.length === 0 ? (
          <div className="py-6 text-center">프로그램 배너가 없습니다.</div>
        ) : (
          programBannerList.bannerList.map((banner) => (
            <TableRow key={banner.id} minWidth="60rem">
              <TableCell cellWidth={columnMetaData.title.cellWidth}>
                {banner.title}
              </TableCell>
              <TableCell cellWidth={columnMetaData.link.cellWidth} textEllipsis>
                <Link
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {banner.link}
                </Link>
              </TableCell>
              <TableCell cellWidth={columnMetaData.visible.cellWidth}>
                <Checkbox
                  checked={banner.isVisible}
                  onChange={() =>
                    handleVisibleCheckboxClicked(banner.id, !banner.isVisible)
                  }
                />
              </TableCell>
              <TableCell cellWidth={columnMetaData.visiblePeriod.cellWidth}>
                {dayjs(banner.startDate).format('YYYY년 MM월 DD일')} ~{' '}
                {dayjs(banner.endDate).format('YYYY년 MM월 DD일')}
              </TableCell>
              <TableCell cellWidth={columnMetaData.management.cellWidth}>
                <TableManageContent>
                  <Link
                    href={`/admin/banner/program-banners/${banner.id}/edit`}
                  >
                    <i>
                      <img src="/icons/edit-icon.svg" alt="수정 아이콘" />
                    </i>
                  </Link>
                  <button onClick={() => handleDeleteButtonClicked(banner.id)}>
                    <i className="text-[1.75rem]">
                      <CiTrash />
                    </i>
                  </button>
                </TableManageContent>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableTemplate>
      {isDeleteModalShown && (
        <AlertModal
          title="프로그램 배너 삭제"
          onConfirm={() =>
            bannerIdForDeleting && tryDeleteBanner(bannerIdForDeleting)
          }
          onCancel={() => setIsDeleteModalShown(false)}
        >
          정말로 프로그램 배너를 삭제하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default PopUpBanners;
