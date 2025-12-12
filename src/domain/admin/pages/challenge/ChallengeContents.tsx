'use client';

import Button from '@/domain/admin/challenge/ui/button/Button';
import Heading from '@/domain/admin/challenge/ui/heading/Heading';
import LineTableBody from '@/domain/admin/challenge/ui/lineTable/LineTableBody';
import LineTableBodyRow, {
  ItemWithStatus,
} from '@/domain/admin/challenge/ui/lineTable/LineTableBodyRow';
import LineTableHead from '@/domain/admin/challenge/ui/lineTable/LineTableHead';
import dayjs from '@/lib/dayjs';
import {
  ContentsResItem,
  CreateContentsReq,
  getContentsAdmin,
  UpdateContentsReq,
} from '@/schema';
import axios from '@/utils/axios';
import { TABLE_CONTENT, TABLE_STATUS } from '@/utils/convert';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

const cellWidthList = [
  'w-[200px]',
  'w-[60px]',
  'w-[10%]',
  'w-[20%]',
  'w-[20%]',
];

const colNames = ['생성일자', 'id', '콘텐츠구분', '콘텐츠명', '콘텐츠링크'];

type Row = ContentsResItem & ItemWithStatus;

const ChallengeContents = () => {
  const { data, refetch } = useQuery({
    queryKey: ['contents', 'admin'],
    queryFn: async () => {
      const res = await axios.get('/contents/admin?size=1000');
      return getContentsAdmin.parse(res.data.data);
    },
  });

  const [insertingContents, setInsertingContents] = useState<Row | null>(null);

  const contentsListRows = useMemo(() => {
    const list =
      data?.contentsAdminList?.map(
        (item): Row => ({
          ...item,
          rowStatus: TABLE_STATUS.SAVE,
        }),
      ) ?? [];

    if (insertingContents) {
      list?.push(insertingContents);
    }

    return list;
  }, [data?.contentsAdminList, insertingContents]);

  const createMutation = useMutation({
    mutationFn: async (req: CreateContentsReq) => {
      const res = await axios.post('/contents', req);
      if (res.status !== 200) {
        console.warn(res);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (req: UpdateContentsReq & { id: number }) => {
      const { id, ...payload } = req;
      const res = await axios.patch(`/contents/${id}`, payload);
      if (res.status !== 200) {
        console.warn(res);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/contents/${id}`);
      if (res.status !== 200) {
        console.warn(res);
      }
    },
  });

  return (
    <div className="px-12 pt-6">
      <div className="flex items-center justify-between px-3">
        <Heading>콘텐츠 관리</Heading>
        <Button
          onClick={() => {
            setInsertingContents({
              id: 0, // 임시 id
              title: '',
              createDate: dayjs(), // 임시 생성일자
              link: '',
              type: 'ADDITIONAL',
              rowStatus: TABLE_STATUS.INSERT,
            });
          }}
        >
          등록
        </Button>
      </div>
      <div className="min-w-[1000px]">
        <LineTableHead cellWidthList={cellWidthList} colNames={colNames} />
        <LineTableBody>
          {contentsListRows?.map((row) => (
            <LineTableBodyRow<Row>
              attrNames={['createDate', 'id', 'type', 'title', 'link']}
              placeholders={colNames}
              canEdits={[false, false, true, true, true, true, true]}
              contents={[
                { type: TABLE_CONTENT.DATE },
                { type: TABLE_CONTENT.INPUT },
                {
                  type: TABLE_CONTENT.DROPDOWN,
                  options: [
                    { id: 'ADDITIONAL', title: '추가콘텐츠' },
                    { id: 'ESSENTIAL', title: '필수콘텐츠' },
                  ],
                },
                { type: TABLE_CONTENT.INPUT },
                { type: TABLE_CONTENT.INPUT },
                { type: TABLE_CONTENT.INPUT },
                { type: TABLE_CONTENT.INPUT },
              ]}
              key={row.id}
              initialValues={row}
              onCancel={() => {
                setInsertingContents(null);
              }}
              onDelete={async (item) => {
                await deleteMutation.mutateAsync(item.id);
                refetch();
              }}
              onSave={async (item) => {
                if (item.rowStatus === TABLE_STATUS.INSERT) {
                  await createMutation.mutateAsync({
                    title: item.title ?? '',
                    link: item.link ?? '',
                    type: item.type ?? 'ADDITIONAL',
                  });
                  refetch();
                  setInsertingContents(null);
                } else if (item.rowStatus === TABLE_STATUS.SAVE) {
                  await updateMutation.mutateAsync({
                    id: item.id,
                    title: item.title ?? '',
                    link: item.link ?? '',
                    type: item.type ?? 'ADDITIONAL',
                  });
                  refetch();
                }
              }}
              cellWidthList={cellWidthList}
            />
          ))}
        </LineTableBody>
      </div>
    </div>
  );
};

export default ChallengeContents;
