import {
  useAdminCurrentChallenge,
  useAdminMissionsOfCurrentChallenge,
  useMissionsOfCurrentChallengeRefetch,
} from '@/context/CurrentAdminChallengeProvider';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import {
  CreateMissionReq,
  getContentsAdminSimple,
  Mission,
  missionTemplateAdmin,
  MissionTemplateResItem,
  UpdateMissionReq,
} from '@/schema';
import { Content, Row } from '@/types/interface';
import axios from '@/utils/axios';
import { END_OF_SECONDS } from '@/utils/constants';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

// 페이지네이션된 /mission-template/admin 에서 전체 템플릿을 한 번에 받기 위한 큰 페이지 크기.
const ALL_TEMPLATES_PAGE_SIZE = 1000;

export const useMissionOperations = (
  apiRef: React.RefObject<GridApiCommunity>,
) => {
  const missions = useAdminMissionsOfCurrentChallenge();
  const { currentChallenge } = useAdminCurrentChallenge();
  const refetchMissions = useMissionsOfCurrentChallengeRefetch();
  const { snackbar: setSnackbar } = useAdminSnackbar();

  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  const createMissionMutation = useMutation({
    mutationFn: async (mission: CreateMissionReq) => {
      return axios.post(`/mission/${currentChallenge?.id}`, mission);
    },
    onError(error) {
      setSnackbar('미션 생성에 실패했습니다. ' + error);
    },
  });

  const updateMission = useMutation({
    mutationFn: async (mission: UpdateMissionReq & { id: number }) => {
      const { id, ...payload } = mission;
      return axios.patch(`/mission/${id}`, payload);
    },
    onError(error) {
      setSnackbar('미션 수정에 실패했습니다. ' + error);
    },
  });

  const deleteMission = useMutation({
    mutationFn: async (id: number) => {
      return axios.delete(`/mission/${id}`);
    },
    onError(error) {
      setSnackbar('미션 삭제에 실패했습니다. ' + error);
    },
  });

  const { data: missionTemplates } = useQuery({
    queryKey: ['admin', 'challenge', 'missionTemplates'],
    enabled: Boolean(currentChallenge),
    queryFn: async (): Promise<MissionTemplateResItem[]> => {
      // BE 가 /mission-template/admin 을 size 20 으로 페이지네이션(LC-3067)한 이후
      // size 없이 호출하면 최신 20개만 수신돼 옛 템플릿 미션의 미션명이 공백이 된다.
      // /admin/simple 은 {id, title} 만 반환해 missionTag 파생(태그 컬럼)이 깨지므로
      // 기존 스키마를 유지한 채 size 를 크게 부여해 전량 로드한다.
      const res = await axios.get(
        `/mission-template/admin?size=${ALL_TEMPLATES_PAGE_SIZE}`,
      );
      return missionTemplateAdmin.parse(res.data.data).missionTemplateAdminList;
    },
  });

  const { data: additionalContents = [] } = useQuery({
    queryKey: [
      'admin',
      'challenge',
      currentChallenge?.id,
      'missions',
      'contents',
      'additional',
    ],
    queryFn: async (): Promise<Content[]> => {
      if (!currentChallenge) {
        return [];
      }
      const res = await axios.get(`/contents/admin/simple?type=ADDITIONAL`);
      return getContentsAdminSimple.parse(res.data.data).contentsSimpleList;
    },
  });

  const { data: essentialContents = [] } = useQuery({
    queryKey: [
      'admin',
      'challenge',
      currentChallenge?.id,
      'missions',
      'contents',
      'essential',
    ],
    queryFn: async (): Promise<Content[]> => {
      if (!currentChallenge) {
        return [];
      }
      const res = await axios.get(`/contents/admin/simple?type=ESSENTIAL`);
      return getContentsAdminSimple.parse(res.data.data).contentsSimpleList;
    },
  });

  // TODO: [나중에...] 최선은 아님... column 자체에 action을 넣는게 좋을듯.
  const onAction = useCallback(
    async ({
      action,
      row,
    }: {
      action: 'create' | 'edit' | 'delete' | 'cancel';
      row: Row;
    }) => {
      // 미션 title 은 선택한 템플릿에서 파생한다. create 시에는 title 확정을 강제하지만,
      // edit 시에는 미해석이어도 기존 title 을 유지한 채(생략) 나머지 필드를 저장한다.
      const resolvedTitle = row.missionTemplateId
        ? row.missionTemplatesOptions?.find(
            (t) => t.id === row.missionTemplateId,
          )?.title
        : undefined;

      switch (action) {
        case 'create':
          if (!row.missionTemplateId) {
            setSnackbar('미션 템플릿을 선택해주세요.');
            return;
          }
          if (!resolvedTitle) {
            setSnackbar(
              '존재하지 않거나 삭제된 미션 템플릿입니다. 다른 템플릿을 선택해주세요.',
            );
            return;
          }
          await createMissionMutation.mutateAsync({
            additionalContentsIdList:
              row.additionalContentsList
                ?.map((c) => c?.id)
                .filter((id): id is number => Boolean(id)) || [],
            essentialContentsIdList:
              row.essentialContentsList
                ?.map((c) => c?.id)
                .filter((id): id is number => Boolean(id)) || [],
            lateScore: row.lateScore,
            missionTemplateId: row.missionTemplateId,
            score: row.score,
            startDate: row.startDate.tz().format('YYYY-MM-DDTHH:mm:ss'),
            endDate: row.endDate
              .set('second', END_OF_SECONDS)
              .tz()
              .format('YYYY-MM-DDTHH:mm:ss'),
            th: row.th,
            title: resolvedTitle,
            missionType: row.missionType,
          });
          if (apiRef?.current?.getRowMode(row.id) === 'edit') {
            apiRef.current?.stopRowEditMode({ id: row.id });
          }
          setSnackbar('미션을 생성했습니다.');
          setEditingMission(null);
          refetchMissions();
          return;

        case 'edit':
          if (!row.missionTemplateId) {
            setSnackbar('미션 템플릿을 선택해주세요.');
            return;
          }
          // 템플릿 목록 미로딩·템플릿 삭제 등으로 title 이 해석되지 않아도
          // 일자 등 다른 편집까지 막지 않는다. title 은 PATCH 에서 생략(optional)해
          // 빈 문자열로 덮어쓰지 않고 기존 미션명을 그대로 유지한다.
          await updateMission.mutateAsync({
            additionalContentsIdList:
              row.additionalContentsList
                ?.map((c) => c?.id)
                .filter((id): id is number => Boolean(id)) || [],
            essentialContentsIdList:
              row.essentialContentsList
                ?.map((c) => c?.id)
                .filter((id): id is number => Boolean(id)) || [],
            id: row.id,
            lateScore: row.lateScore,
            missionTemplateId: row.missionTemplateId,
            missionType: row.missionType,
            score: row.score,
            startDate: row.startDate.tz().format('YYYY-MM-DDTHH:mm:ss'),
            endDate: row.endDate
              .set('second', END_OF_SECONDS)
              .tz()
              .format('YYYY-MM-DDTHH:mm:ss'),
            th: row.th,
            ...(resolvedTitle ? { title: resolvedTitle } : {}),
          });
          if (apiRef?.current?.getRowMode(row.id) === 'edit') {
            apiRef.current?.stopRowEditMode({ id: row.id });
          }
          setSnackbar('미션을 수정했습니다.');
          setEditingMission(null);
          refetchMissions();
          apiRef?.current?.forceUpdate();
          return;

        case 'delete':
          await deleteMission.mutateAsync(row.id);
          setSnackbar('미션을 삭제했습니다.');
          refetchMissions();
          apiRef?.current?.forceUpdate();
          return;

        case 'cancel':
          if (apiRef?.current?.getRowMode(row.id) === 'edit') {
            apiRef.current?.stopRowEditMode({ id: row.id });
          }
          refetchMissions();
          apiRef?.current?.forceUpdate();
          setEditingMission(null);
          return;
      }
    },
    [
      apiRef,
      createMissionMutation,
      deleteMission,
      refetchMissions,
      setSnackbar,
      updateMission,
    ],
  );

  const createNewMission = useCallback(() => {
    setEditingMission({
      attendanceCount: 0,
      endDate: dayjs(),
      startDate: dayjs(),
      id: -1,
      lateScore: 5,
      score: 10,
      th: 1,
      title: '',
      missionTemplateId: null,
      missionStatusType: 'WAITING',
      lateAttendanceCount: 0,
      applicationCount: 0,
      additionalContentsList: [],
      essentialContentsList: [],
      missionTag: '',
      missionType: null,
      challengeOptionCode: '',
      challengeOptionId: -1,
    });
  }, []);

  const rows = useMemo((): Row[] => {
    const result: Row[] = (missions ?? []).map((m) => ({
      ...m,
      challengeOptionId: m.challengeOptionId ?? null,
      challengeOptionCode: m.challengeOptionCode ?? null,
      mode: 'normal',
      additionalContentsOptions: additionalContents,
      essentialContentsOptions: essentialContents,
      missionTemplatesOptions: missionTemplates ?? [],
      onAction,
    }));

    if (editingMission) {
      result.push({
        ...editingMission,
        challengeOptionId: editingMission.challengeOptionId ?? null,
        challengeOptionCode: editingMission.challengeOptionCode ?? null,
        mode: 'create',
        additionalContentsOptions: additionalContents,
        essentialContentsOptions: essentialContents,
        missionTemplatesOptions: missionTemplates ?? [],
        onAction,
      });
    }

    return result;
  }, [
    missions,
    editingMission,
    additionalContents,
    essentialContents,
    missionTemplates,
    onAction,
  ]);

  return {
    rows,
    createNewMission,
    onAction,
  };
};
