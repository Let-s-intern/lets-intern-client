import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';

import TableTemplate, {
  TableTemplateProps,
} from '../../../components/admin/ui/table/new/TableTemplate';
import axios from '../../../utils/axios';
import TableCell from '../../../components/admin/ui/table/new/TableCell';
import TableRow from '../../../components/admin/ui/table/new/TableRow';
import { Link } from 'react-router-dom';
import { CiTrash } from 'react-icons/ci';
import TableManageContent from '../../../components/admin/ui/table/new/TableManageContent';

type MainBannersTableKey =
  | 'title'
  | 'link'
  | 'visible'
  | 'visiblePeriod'
  | 'management';

const MainBanners = () => {
  const queryClient = useQueryClient();

  const [mainBannerList, setMainBannerList] = useState<
    {
      id: number;
      title: string;
      link: string;
      isVisible: boolean;
      startDate: string;
      endDate: string;
    }[]
  >([]);

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

  const getMainBannerList = useQuery({
    queryKey: [
      'banner',
      'admin',
      {
        type: 'MAIN',
        page: 1,
        size: 10000,
      },
    ],
    queryFn: async () => {
      const res = await axios('/banner/admin', {
        params: {
          type: 'MAIN',
          page: 1,
          size: 10000,
        },
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (getMainBannerList.data) {
      setMainBannerList(getMainBannerList.data.bannerList);
    }
  }, [getMainBannerList]);

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  const editMainBannerVisible = useMutation({
    mutationFn: async (params: { bannerId: number; isVisible: boolean }) => {
      const { bannerId, isVisible } = params;
      const formData = new FormData();
      formData.append(
        'bannerCreateDTO',
        JSON.stringify({ isVisible: !isVisible }),
      );
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
    editMainBannerVisible.mutate({ bannerId, isVisible });
  };

  return (
    <TableTemplate<MainBannersTableKey>
      title="메인 배너 관리"
      headerButton={{
        label: '등록',
        href: '/admin/banner/main-banners/new',
      }}
      columnMetaData={columnMetaData}
      minWidth="60rem"
    >
      {mainBannerList.map((banner) => (
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
                handleVisibleCheckboxClicked(banner.id, banner.isVisible)
              }
            />
          </TableCell>
          <TableCell cellWidth={columnMetaData.visiblePeriod.cellWidth}>
            {formatDateString(banner.startDate)} ~{' '}
            {formatDateString(banner.endDate)}
          </TableCell>
          <TableCell cellWidth={columnMetaData.management.cellWidth}>
            <TableManageContent>
              <Link to={`/admin/banner/main-banners/${banner.id}/edit`}>
                <i>
                  <img src="/icons/edit-icon.svg" alt="수정 아이콘" />
                </i>
              </Link>
              <button
              // onClick={() => handleDeleteButtonClicked(coupon.couponId)}
              >
                <i className="text-[1.75rem]">
                  <CiTrash />
                </i>
              </button>
            </TableManageContent>
          </TableCell>
        </TableRow>
      ))}
    </TableTemplate>
  );
};

export default MainBanners;
