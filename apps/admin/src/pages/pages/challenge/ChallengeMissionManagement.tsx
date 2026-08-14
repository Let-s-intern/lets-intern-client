import Button from '@/domain/admin/challenge/ui/button/Button';
import Heading from '@/domain/admin/challenge/ui/heading/Heading';
import LineTableBody from '@/domain/admin/challenge/ui/lineTable/LineTableBody';
import LineTableBodyRow, {
  ItemWithStatus,
} from '@/domain/admin/challenge/ui/lineTable/LineTableBodyRow';
import LineTableHead from '@/domain/admin/challenge/ui/lineTable/LineTableHead';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import { usePageableWithSearchParams } from '@/hooks/usePageableWithSearchParams';
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

/**
 * 서버가 요구하는 필수값. 비면 400 이 떨어진다
 * (`CreateMissionTemplateRequestDto.required`). 링크 두 개는 선택이다.
 *
 * 예전에는 이 검증이 없어 빈 칸으로 저장하면 400 이 나고, 그 400 은 콘솔로만 갔다.
 * 운영 입장에서는 "저장을 눌렀는데 아무 일도 안 일어난다" 로만 보였다.
 */
const REQUIRED_FIELDS: { key: keyof Row; label: string }[] = [
  { key: 'missionTag', label: '미션태그' },
  { key: 'title', label: '미션명' },
  { key: 'description', label: '내용' },
  { key: 'guide', label: '가이드' },
];

/** 비어 있는 필수 항목의 이름들. 전부 채워졌으면 빈 배열. */
const findEmptyRequiredLabels = (item: Row): string[] =>
  REQUIRED_FIELDS.filter(({ key }) => {
    const value = item[key];
    return typeof value !== 'string' || value.trim() === '';
  }).map(({ label }) => label);

/** 실패를 화면에 알린다. 콘솔에만 남기면 아무도 모른다. */
const notifyFailure = (action: string, error: unknown) => {
  const apiError = error as { code?: string; message?: string } | null;
  const detail = apiError?.message
    ? `${apiError.message}${apiError.code ? ` (${apiError.code})` : ''}`
    : '알 수 없는 오류입니다.';
  // eslint-disable-next-line no-console
  console.error(error);
  alert(`${action}에 실패했습니다.\n\n${detail}`);
};

/** 미션 (템플릿) 관리 */
const ChallengeMissionManagement = () => {
  const { pageable, handlePageChange } = usePageableWithSearchParams({
    defaultPage: 1,
    defaultSize: 20,
  });

  const { data, refetch } = useQuery({
    queryKey: ['mission-template', 'admin', pageable.page, pageable.size],
    queryFn: async () => {
      const res = await axios.get(
        `/mission-template/admin?page=${pageable.page}&size=${pageable.size}`,
      );
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
      // 등록 버튼 클릭 시 입력 행을 맨 위에 추가
      list.unshift(insertingMissionTemplate);
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
    onError: (error) => notifyFailure('미션 등록', error),
  });

  const updateMutation = useMutation({
    mutationFn: async (req: UpdateMissionTemplateReq & { id: number }) => {
      const { id, ...payload } = req;
      const res = await axios.patch(`/mission-template/${id}`, payload);
      // 예전에는 여기서 console.warn 만 했다. 그러면 실패해도 react-query 가 성공으로 보고
      // refetch 가 돌아 화면이 옛 값으로 되돌아온다 — 저장한 것처럼 보이고 아무 표시가 없다.
      if (res.status !== 200) {
        throw new Error(res.data?.message ?? `저장 실패 (HTTP ${res.status})`);
      }
    },
    onError: (error) => notifyFailure('미션 수정', error),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/mission-template/${id}`);
      if (res.status !== 200) {
        throw new Error(res.data?.message ?? `삭제 실패 (HTTP ${res.status})`);
      }
    },
    onError: (error) => notifyFailure('미션 삭제', error),
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
      {/*
        표가 화면보다 넓다. 가로 스크롤을 여기서 받아야 표만 움직인다.
        예전에는 overflow 지정이 없어 문서 전체가 가로로 늘어났고, macOS 는 스크롤바를 숨기므로
        13인치(1440px)에서는 "관리" 열이 화면 밖 487px 지점에 있다는 사실조차 드러나지 않았다.

        min-w 는 열 폭 합(1680px) + "관리" 열(120px) 이다. 1700px 이던 시절에는 관리 열에
        20px 만 남아 저장·취소 버튼이 앞 칸(VOD 링크) 아래로 깔렸고, 클릭이 그 칸으로 들어가
        저장이 되지 않았다(2026-08-14 운영 문의).
      */}
      <div className="overflow-x-auto">
        <div className="min-w-[1800px]">
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
                // 무엇이 비었는지 이름으로 알려준다. 예전에는 그냥 400 이 나고 조용히 끝났다.
                const emptyLabels = findEmptyRequiredLabels(item);
                if (emptyLabels.length > 0) {
                  alert(`다음 항목을 입력해주세요.\n\n${emptyLabels.join(', ')}`);
                  throw new Error('필수 항목 누락');
                }

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
      <div className="flex justify-center">
        <MuiPagination
          page={pageable.page}
          pageInfo={data?.pageInfo ?? { totalPages: 0 }}
          onChange={handlePageChange}
          className="py-4"
        />
      </div>
    </div>
  );
};

export default ChallengeMissionManagement;
