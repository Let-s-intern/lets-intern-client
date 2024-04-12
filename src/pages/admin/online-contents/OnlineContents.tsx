import { useQuery } from '@tanstack/react-query';
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

type OnlineContentsTableKey = 'title' | 'link' | 'management';

const OnineContents = () => {
  const [onlineContentsList, setOnlineContentsList] = useState<
    {
      id: number;
      title: string;
      link: string;
    }[]
  >([]);

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

  useEffect(() => {
    if (getOnlineContentsList.data) {
      setOnlineContentsList(getOnlineContentsList.data.onlineProgramList);
    }
  }, [getOnlineContentsList]);

  return (
    <TableTemplate<OnlineContentsTableKey>
      title="상시 콘텐츠"
      headerButton={{
        label: '등록',
        href: '/admin/online-contents/new',
      }}
      columnMetaData={columnMetaData}
      minWidth="35rem"
    >
      {onlineContentsList.map((banner) => (
        <TableRow key={banner.id} minWidth="35rem">
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
          <TableCell cellWidth={columnMetaData.management.cellWidth}>
            <TableManageContent>
              <Link to={`/admin/online-contents/${banner.id}/edit`}>
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

export default OnineContents;
