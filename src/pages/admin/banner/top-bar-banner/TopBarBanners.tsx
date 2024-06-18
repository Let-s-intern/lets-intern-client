import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';

import TableTemplate, {
  TableTemplateProps,
} from '../../../../components/admin/ui/table/new/TableTemplate';
import axios from '../../../../utils/axios';
import TableCell from '../../../../components/admin/ui/table/new/TableCell';
import TableRow from '../../../../components/admin/ui/table/new/TableRow';
import { Link } from 'react-router-dom';
import { CiTrash } from 'react-icons/ci';
import TableManageContent from '../../../../components/admin/ui/table/new/TableManageContent';
import AlertModal from '../../../../components/ui/alert/AlertModal';
import dayjs from 'dayjs';

type TopBarBannersTableKey =
  | 'title'
  | 'link'
  | 'visible'
  | 'visiblePeriod'
  | 'management';

const TopBarBanners = () => {
  const queryClient = useQueryClient();

  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [bannerIdForDeleting, setBannerIdForDeleting] = useState<number>();

  const columnMetaData: TableTemplateProps<TopBarBannersTableKey>['columnMetaData'] =
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

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'banner',
      'admin',
      {
        type: 'LINE',
      },
    ],
    queryFn: async () => {
      const res = await axios('/banner/admin', {
        params: {
          type: 'LINE',
        },
      });
      return res.data;
    },
  });

  const topBarBannerList: {
    id: number;
    title: string;
    link: string;
    startDate: string;
    endDate: string;
    isValid: boolean;
    isVisible: boolean;
    imgUrl: string;
  }[] = data?.data?.bannerList || [];

  const deleteTopBarBanner = useMutation({
    mutationFn: async (bannerId: number) => {
      const res = await axios.delete(`/banner/${bannerId}`, {
        params: {
          type: 'LINE',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      setIsDeleteModalShown(false);
    },
  });

  const editTopBarBannerVisible = useMutation({
    mutationFn: async (params: { bannerId: number; formData: FormData }) => {
      const { bannerId, formData } = params;
      const res = await axios.patch(`/banner/${bannerId}`, formData, {
        params: {
          type: 'LINE',
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
    },
  });

  const handleVisibleCheckboxClicked = (
    bannerId: number,
    isVisible: boolean,
  ) => {
    const formData = new FormData();
    formData.append(
      'updateBannerRequestDto',
      new Blob(
        [
          JSON.stringify({
            isVisible,
          }),
        ],
        {
          type: 'application/json',
        },
      ),
    );
    editTopBarBannerVisible.mutate({ bannerId, formData });
  };

  const handleDeleteButtonClicked = async (bannerId: number) => {
    setBannerIdForDeleting(bannerId);
    setIsDeleteModalShown(true);
  };

  return (
    <>
      <TableTemplate<TopBarBannersTableKey>
        title="상단 띠 배너 관리"
        headerButton={{
          label: '등록',
          href: '/admin/banner/top-bar-banners/new',
        }}
        columnMetaData={columnMetaData}
        minWidth="60rem"
      >
        {isLoading ? (
          <div className="py-6 text-center">로딩 중...</div>
        ) : error ? (
          <div className="py-6 text-center">에러 발생</div>
        ) : topBarBannerList.length === 0 ? (
          <div className="py-6 text-center">상단 띠 배너가 없습니다.</div>
        ) : (
          topBarBannerList.map((banner) => (
            <TableRow key={banner.id} minWidth="60rem">
              <TableCell cellWidth={columnMetaData.title.cellWidth}>
                {banner.title}
              </TableCell>
              <TableCell cellWidth={columnMetaData.link.cellWidth} textEllipsis>
                <Link
                  to={banner.link}
                  target="_blank"
                  rel="noopenner noreferrer"
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
                  <Link to={`/admin/banner/top-bar-banners/${banner.id}/edit`}>
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
          title="띠 배너 삭제"
          onConfirm={() =>
            bannerIdForDeleting &&
            deleteTopBarBanner.mutate(bannerIdForDeleting)
          }
          onCancel={() => setIsDeleteModalShown(false)}
        >
          정말로 띠 배너를 삭제하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default TopBarBanners;
