import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import TableTemplate, {
  TableTemplateProps,
} from '../../../components/admin/ui/table/new/TableTemplate';
import axios from '../../../utils/axios';
import TableCell from '../../../components/admin/ui/table/new/TableCell';
import TableRow from '../../../components/admin/ui/table/new/TableRow';
import { Link } from 'react-router-dom';
import { CiTrash } from 'react-icons/ci';
import TableManageContent from '../../../components/admin/ui/table/new/TableManageContent';
import AlertModal from '../../../components/ui/alert/AlertModal';

type OnlineContentsTableKey = 'title' | 'link' | 'management';

const OnineContents = () => {
  const queryClient = useQueryClient();

  const [onlineContentsList, setOnlineContentsList] = useState<
    {
      id: number;
      title: string;
      link: string;
    }[]
  >([]);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [onlineContentsIdForDeleting, setOnlineContentsIdForDeleting] =
    useState<number>();

  const columnMetaData: TableTemplateProps<OnlineContentsTableKey>['columnMetaData'] =
    {
      title: {
        headLabel: '제목',
        cellWidth: 'w-5/12',
      },
      link: {
        headLabel: '링크',
        cellWidth: 'w-4/12',
      },
      management: {
        headLabel: '관리',
        cellWidth: 'w-3/12',
      },
    };

  const getOnlineContentsList = useQuery({
    queryKey: [
      'online-program',
      'admin',
      {
        page: 1,
        size: 10000,
      },
    ],
    queryFn: async () => {
      const res = await axios('/online-program/admin', {
        params: {
          page: 1,
          size: 10000,
        },
      });
      return res.data;
    },
  });

  const deleteOnlineContents = useMutation({
    mutationFn: async (programId: number) => {
      const res = await axios.delete(`/online-program/${programId}`);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['online-program'] });
      setIsDeleteModalShown(false);
    },
  });

  useEffect(() => {
    if (getOnlineContentsList.data) {
      setOnlineContentsList(getOnlineContentsList.data.onlineProgramList);
    }
  }, [getOnlineContentsList]);

  const handleDeleteButtonClicked = async (bannerId: number) => {
    setOnlineContentsIdForDeleting(bannerId);
    setIsDeleteModalShown(true);
  };

  return (
    <>
      <TableTemplate<OnlineContentsTableKey>
        title="상시 콘텐츠"
        headerButton={{
          label: '등록',
          href: '/admin/online-contents/new',
        }}
        columnMetaData={columnMetaData}
        minWidth="35rem"
      >
        {onlineContentsList.map((onlineContents) => (
          <TableRow key={onlineContents.id} minWidth="35rem">
            <TableCell cellWidth={columnMetaData.title.cellWidth}>
              {onlineContents.title}
            </TableCell>
            <TableCell cellWidth={columnMetaData.link.cellWidth} textEllipsis>
              <Link
                to={onlineContents.link}
                target="_blank"
                rel="noopenner noreferrer"
                className="hover:underline"
              >
                {onlineContents.link}
              </Link>
            </TableCell>
            <TableCell cellWidth={columnMetaData.management.cellWidth}>
              <TableManageContent>
                <Link to={`/admin/online-contents/${onlineContents.id}/edit`}>
                  <i>
                    <img src="/icons/edit-icon.svg" alt="수정 아이콘" />
                  </i>
                </Link>
                <button
                  onClick={() => handleDeleteButtonClicked(onlineContents.id)}
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
      {isDeleteModalShown && (
        <AlertModal
          title="상시 콘텐츠 삭제"
          onConfirm={() =>
            onlineContentsIdForDeleting &&
            deleteOnlineContents.mutate(onlineContentsIdForDeleting)
          }
          onCancel={() => setIsDeleteModalShown(false)}
        >
          정말로 상시 콘텐츠를 삭제하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default OnineContents;
