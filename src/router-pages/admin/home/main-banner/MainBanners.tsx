import { Checkbox } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import dayjs from '@/lib/dayjs';
import { CiTrash } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import TableCell from '../../../../components/admin/ui/table/new/TableCell';
import TableManageContent from '../../../../components/admin/ui/table/new/TableManageContent';
import TableRow from '../../../../components/admin/ui/table/new/TableRow';
import TableTemplate, {
  TableTemplateProps,
} from '../../../../components/admin/ui/table/new/TableTemplate';
import AlertModal from '../../../../components/ui/alert/AlertModal';
import axios from '../../../../utils/axios';

type MainBannersTableKey =
  | 'title'
  | 'link'
  | 'visible'
  | 'visiblePeriod'
  | 'management';

const MainBanners = () => {
  const queryClient = useQueryClient();

  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [bannerIdForDeleting, setBannerIdForDeleting] = useState<number>();

  const columnMetaData: TableTemplateProps<MainBannersTableKey>['columnMetaData'] =
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
        type: 'MAIN',
      },
    ],
    queryFn: async ({ queryKey }) => {
      const res = await axios(`/${queryKey[0]}/${queryKey[1]}`, {
        params: queryKey[2],
      });
      return res.data;
    },
  });

  const mainBannerList: {
    id: number;
    title: string;
    link: string;
    startDate: string;
    endDate: string;
    isValid: boolean;
    isVisible: boolean;
    imgUrl: string;
  }[] = data?.data?.bannerList || [];

  const deleteMainBanner = useMutation({
    mutationFn: async (bannerId: number) => {
      const res = await axios.delete(`/banner/${bannerId}`, {
        params: {
          type: 'MAIN',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      setIsDeleteModalShown(false);
    },
  });

  const editMainBannerVisible = useMutation({
    mutationFn: async (params: { bannerId: number; formData: FormData }) => {
      const { bannerId, formData } = params;
      const res = await axios.patch(`/banner/${bannerId}`, formData, {
        params: {
          type: 'MAIN',
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
      'requestDto',
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
    editMainBannerVisible.mutate({ bannerId, formData });
  };

  const handleDeleteButtonClicked = async (bannerId: number) => {
    setBannerIdForDeleting(bannerId);
    setIsDeleteModalShown(true);
  };

  return (
    <>
      <TableTemplate<MainBannersTableKey>
        title="메인 배너 관리"
        headerButton={{
          label: '등록',
          href: '/admin/home/main-banners/new',
        }}
        columnMetaData={columnMetaData}
        minWidth="60rem"
      >
        {isLoading ? (
          <div className="py-6 text-center">로딩 중...</div>
        ) : error ? (
          <div className="py-6 text-center">에러 발생</div>
        ) : mainBannerList.length === 0 ? (
          <div className="py-6 text-center">메인 배너가 없습니다.</div>
        ) : (
          mainBannerList.map((banner) => (
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
                  <Link to={`/admin/home/main-banners/${banner.id}/edit`}>
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
          title="메인 배너 삭제"
          onConfirm={() =>
            bannerIdForDeleting && deleteMainBanner.mutate(bannerIdForDeleting)
          }
          onCancel={() => setIsDeleteModalShown(false)}
        >
          정말로 메인 배너를 삭제하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default MainBanners;
