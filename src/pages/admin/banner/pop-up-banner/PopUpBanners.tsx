import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CiTrash } from 'react-icons/ci';
import { Checkbox } from '@mui/material';
import dayjs from 'dayjs';

import TableTemplate, {
  TableTemplateProps,
} from '../../../../components/admin/ui/table/new/TableTemplate';
import axios from '../../../../utils/axios';
import TableCell from '../../../../components/admin/ui/table/new/TableCell';
import TableRow from '../../../../components/admin/ui/table/new/TableRow';
import TableManageContent from '../../../../components/admin/ui/table/new/TableManageContent';
import AlertModal from '../../../../components/ui/alert/AlertModal';

type PopUpTableKey =
  | 'title'
  | 'link'
  | 'visible'
  | 'visiblePeriod'
  | 'management';

const PopUpBanners = () => {
  const queryClient = useQueryClient();

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

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'banner',
      'admin',
      {
        type: 'POPUP',
      },
    ],
    queryFn: async ({ queryKey }) => {
      const res = await axios(`/${queryKey[0]}/${queryKey[1]}`, {
        params: queryKey[2],
      });
      return res.data;
    },
  });

  const popUpList: {
    id: number;
    title: string;
    link: string;
    startDate: string;
    endDate: string;
    isValid: boolean;
    isVisible: boolean;
    imgUrl: string;
  }[] = data?.data?.bannerList || [];

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
    mutationFn: async (params: { bannerId: number; formData: FormData }) => {
      const { bannerId, formData } = params;
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
    editPopUpVisible.mutate({ bannerId, formData });
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
        {isLoading ? (
          <div className="py-6 text-center">로딩 중...</div>
        ) : error ? (
          <div className="py-6 text-center">에러 발생</div>
        ) : popUpList.length === 0 ? (
          <div className="py-6 text-center">팝업 배너가 없습니다.</div>
        ) : (
          popUpList.map((popUp) => (
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
          ))
        )}
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
