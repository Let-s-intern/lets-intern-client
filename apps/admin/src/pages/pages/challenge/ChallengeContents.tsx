'use client';

import Button from '@/domain/admin/challenge/ui/button/Button';
import Heading from '@/domain/admin/challenge/ui/heading/Heading';
import LineTableBody from '@/domain/admin/challenge/ui/lineTable/LineTableBody';
import LineTableBodyRow, {
  ItemWithStatus,
} from '@/domain/admin/challenge/ui/lineTable/LineTableBodyRow';
import LineTableHead from '@/domain/admin/challenge/ui/lineTable/LineTableHead';
import dayjs from '@/lib/dayjs';
import { ContentsResItem } from '@/schema';
import { TABLE_CONTENT, TABLE_STATUS } from '@/utils/convert';
import { useMemo, useState } from 'react';
import useContentsQuery from './contents/hooks/useContentsQuery';
import useContentsMutations from './contents/hooks/useContentsMutations';

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
  const { data, refetch } = useContentsQuery();
  const { createMutation, updateMutation, deleteMutation } =
    useContentsMutations();

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

  return (
    <div className="px-12 pt-6">
      <div className="flex items-center justify-between px-3">
        <Heading>콘텐츠 관리</Heading>
        <Button
          onClick={() => {
            setInsertingContents({
              id: 0,
              title: '',
              createDate: dayjs(),
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
