import Button from '@/components/admin/challenge/ui/button/Button';
import Heading from '@/components/admin/challenge/ui/heading/Heading';
import LineTableBody from '@/components/admin/challenge/ui/lineTable/LineTableBody';
import LineTableBodyRow, {
  ItemWithStatus,
} from '@/components/admin/challenge/ui/lineTable/LineTableBodyRow';
import LineTableHead from '@/components/admin/challenge/ui/lineTable/LineTableHead';
import dayjs from '@/lib/dayjs';
import {
  CreateMissionTemplateReq,
  missionTemplateAdmin,
  MissionTemplateResItem,
  UpdateMissionTemplateReq,
} from '@/schema';
import axios from '@/utils/axios';
import { TABLE_CONTENT, TABLE_STATUS } from '@/utils/convert';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

const cellWidthList = [
  'w-[200px]',
  'w-[80px]',
  'w-[200px]',
  'w-[200px]',
  'w-[300px]',
  'w-[300px]',
  'w-[200px]',
  'w-[200px]',
];

const colNames = [
  '생성일자',
  'id',
  '미션태그',
  '미션명',
  '내용',
  '가이드',
  '템플릿 링크',
  'VOD 링크',
];

type Row = MissionTemplateResItem & ItemWithStatus;

/** 미션 (템플릿) 관리 */
const ChallengeMissionManagement = () => {
  const { data, refetch } = useQuery({
    queryKey: ['mission-template', 'admin'],
    queryFn: async () => {
      const res = await axios.get('/mission-template/admin?size=1000');
      return missionTemplateAdmin.parse(res.data.data);
    },
  });

  const [insertingMissionTemplate, setInsertingMissionTemplate] =
    useState<Row | null>(null);

  const missionTemplateListRows = useMemo(() => {
    const list =
      data?.missionTemplateAdminList?.map(
        (item): Row => ({
          ...item,
          rowStatus: TABLE_STATUS.SAVE,
        }),
      ) ?? [];

    if (insertingMissionTemplate) {
      list?.push(insertingMissionTemplate);
    }

    return list;
  }, [data?.missionTemplateAdminList, insertingMissionTemplate]);

  const createMutation = useMutation({
    mutationFn: async (req: CreateMissionTemplateReq) => {
      const res = await axios.post('/mission-template', req);
      if (res.status !== 201) {
        throw new Error(res.data.message);
      }
    },

    onError: console.error,
  });

  const updateMutation = useMutation({
    mutationFn: async (req: UpdateMissionTemplateReq & { id: number }) => {
      const { id, ...payload } = req;
      const res = await axios.patch(`/mission-template/${id}`, payload);
      if (res.status !== 200) {
        console.warn(res.data);
      }
    },
    onError: console.error,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/mission-template/${id}`);
      if (res.status !== 200) {
        console.warn(res.data);
      }
    },
    onError: console.error,
  });

  return (
    <div className="px-12 pt-6">
      <div className="flex items-center justify-between px-3">
        <Heading>미션 관리</Heading>
        <Button
          onClick={() => {
            setInsertingMissionTemplate({
              id: 0, // 임시 id
              title: '',
              description: '',
              guide: '',
              templateLink: '',
              createDate: dayjs(), // 임시 생성일자
              rowStatus: TABLE_STATUS.INSERT,
              missionTag: '',
            });
          }}
        >
          등록
        </Button>
      </div>
      <div className="min-w-[1700px]">
        <LineTableHead cellWidthList={cellWidthList} colNames={colNames} />
        <LineTableBody>
          {missionTemplateListRows?.map((row) => (
            <LineTableBodyRow<Row>
              attrNames={[
                'createDate',
                'id',
                'missionTag',
                'title',
                'description',
                'guide',
                'templateLink',
                'vodLink',
              ]}
              placeholders={colNames}
              canEdits={[false, false, true, true, true, true, true, true]}
              contents={[
                { type: TABLE_CONTENT.DATE },
                { type: TABLE_CONTENT.INPUT },
                { type: TABLE_CONTENT.INPUT },
                { type: TABLE_CONTENT.INPUT },
                { type: TABLE_CONTENT.INPUT },
                { type: TABLE_CONTENT.INPUT },
                { type: TABLE_CONTENT.INPUT },
                { type: TABLE_CONTENT.INPUT },
              ]}
              key={row.id}
              initialValues={row}
              onCancel={() => {
                setInsertingMissionTemplate(null);
              }}
              onDelete={async (item) => {
                await deleteMutation.mutateAsync(item.id);
                refetch();
              }}
              onSave={async (item) => {
                if (item.rowStatus === TABLE_STATUS.INSERT) {
                  await createMutation.mutateAsync({
                    description: item.description,
                    guide: item.guide,
                    missionTag: item.missionTag,
                    templateLink: item.templateLink ?? '',
                    title: item.title,
                    vodLink: item.vodLink,
                  });
                  refetch();
                  setInsertingMissionTemplate(null);
                } else if (item.rowStatus === TABLE_STATUS.SAVE) {
                  await updateMutation.mutateAsync({
                    id: item.id,
                    description: item.description,
                    guide: item.guide,
                    missionTag: item.missionTag,
                    templateLink: item.templateLink ?? '',
                    title: item.title,
                    vodLink: item.vodLink,
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

export default ChallengeMissionManagement;
