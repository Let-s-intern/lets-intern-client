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
      startDate: string;
      endDate: string;
      isValid: boolean;
      isVisible: boolean;
      imgUrl: string;
    }[]
  >([]);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [popUpIdForDeleting, setPopUpIdForDeleting] = useState<number>();

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

  useQuery({
    queryKey: [
      'banner',
      'admin',
      {
        type: 'POPUP',
      },
    ],
    queryFn: async () => {
      const res = await axios('/banner/admin', {
        params: {
          type: 'POPUP',
        },
      });
      setPopUpList(res.data.data.bannerList);
      return res.data;
    },
  });

  const deletePopUpBanner = useMutation({
    mutationFn: async (popUpId: number) => {
      const res = await axios.delete(`/banner/${popUpId}`, {
        params: {
          type: 'POPUP',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      setIsDeleteModalShown(false);
    },
  });

  const editPopUpVisible = useMutation({
    mutationFn: async (params: { bannerId: number; isVisible: boolean }) => {
      const { bannerId, isVisible } = params;
      const res = await axios.patch(
        `/banner/${bannerId}`,
        {
          isVisible,
        },
        {
          params: {
            type: 'POPUP',
          },
        },
      );
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

  const handleDeleteButtonClicked = async (bannerId: number) => {
    setPopUpIdForDeleting(bannerId);
    setIsDeleteModalShown(true);
  };

  return (
    <>
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
                  handleVisibleCheckboxClicked(popUp.id, !popUp.isVisible)
                }
              />
            </TableCell>
            <TableCell cellWidth={columnMetaData.visiblePeriod.cellWidth}>
              {dayjs(popUp.startDate).format('YYYY년 MM월 DD일')} ~{' '}
              {dayjs(popUp.endDate).format('YYYY년 MM월 DD일')}
            </TableCell>
            <TableCell cellWidth={columnMetaData.management.cellWidth}>
              <TableManageContent>
                <Link to={`/admin/banner/pop-up/${popUp.id}/edit`}>
                  <i>
                    <img src="/icons/edit-icon.svg" alt="수정 아이콘" />
                  </i>
                </Link>
                <button onClick={() => handleDeleteButtonClicked(popUp.id)}>
                  <i className="text-[1.75rem]">
                    <CiTrash />
                  </i>
                </button>
              </TableManageContent>
            </TableCell>
          </TableRow>
        ))}
      </TableTemplate>
      {isDeleteModalShown && (
        <AlertModal
          title="팝업 삭제"
          onConfirm={() =>
            popUpIdForDeleting && deletePopUpBanner.mutate(popUpIdForDeleting)
          }
          onCancel={() => setIsDeleteModalShown(false)}
        >
          정말로 팝업을 삭제하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default PopUpBanners;
