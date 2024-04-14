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

type PopUpTableKey =
  | 'title'
  | 'link'
  | 'visible'
  | 'visiblePeriod'
  | 'management';

const PopUpBanners = () => {
  const queryClient = useQueryClient();

  const [popUpList, setPopUpList] = useState<
    {
      id: number;
      title: string;
      link: string;
      isVisible: boolean;
      startDate: string;
      endDate: string;
    }[]
  >([]);

  const columnMetaData: TableTemplateProps<PopUpTableKey>['columnMetaData'] = {
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

  const getPopUpList = useQuery({
    queryKey: [
      'banner',
      'admin',
      {
        type: 'POPUP',
        page: 1,
        size: 10000,
      },
    ],
    queryFn: async () => {
      const res = await axios('/banner/admin', {
        params: {
          type: 'POPUP',
          page: 1,
          size: 10000,
        },
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (getPopUpList.data) {
      setPopUpList(getPopUpList.data.bannerList);
    }
  }, [getPopUpList]);

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  const editPopUpVisible = useMutation({
    mutationFn: async (params: { bannerId: number; isVisible: boolean }) => {
      const { bannerId, isVisible } = params;
      const formData = new FormData();
      formData.append(
        'bannerCreateDTO',
        JSON.stringify({ isVisible: !isVisible }),
      );
      const res = await axios.patch(`/banner/${bannerId}`, formData, {
        params: {
          type: 'POPUP',
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
    editPopUpVisible.mutate({ bannerId, isVisible });
  };

  return (
    <TableTemplate<PopUpTableKey>
      title="팝업 관리"
      headerButton={{
        label: '등록',
        href: '/admin/banner/pop-up/new',
      }}
      columnMetaData={columnMetaData}
      minWidth="60rem"
    >
      {popUpList.map((popUp) => (
        <TableRow key={popUp.id} minWidth="60rem">
          <TableCell cellWidth={columnMetaData.title.cellWidth}>
            {popUp.title}
          </TableCell>
          <TableCell cellWidth={columnMetaData.link.cellWidth} textEllipsis>
            <Link
              to={popUp.link}
              target="_blank"
              rel="noopenner noreferrer"
              className="hover:underline"
            >
              {popUp.link}
            </Link>
          </TableCell>
          <TableCell cellWidth={columnMetaData.visible.cellWidth}>
            <Checkbox
              checked={popUp.isVisible}
              onChange={() =>
                handleVisibleCheckboxClicked(popUp.id, popUp.isVisible)
              }
            />
          </TableCell>
          <TableCell cellWidth={columnMetaData.visiblePeriod.cellWidth}>
            {formatDateString(popUp.startDate)} ~{' '}
            {formatDateString(popUp.endDate)}
          </TableCell>
          <TableCell cellWidth={columnMetaData.management.cellWidth}>
            <TableManageContent>
              <Link to={`/admin/banner/pop-up/${popUp.id}/edit`}>
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

export default PopUpBanners;
