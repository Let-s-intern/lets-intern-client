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
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

export const useMissionOperations = (apiRef: any) => {
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
      const res = await axios.get(`/mission-template/admin`);
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
      switch (action) {
        case 'create':
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
            title:
              row.missionTemplatesOptions.find(
                (t) => t.id === row.missionTemplateId,
              )?.title ?? '',
            missionType: row.missionType,
          });
          if (apiRef?.current?.getRowMode(row.id) === 'edit') {
            apiRef.current?.stopRowEditMode({ id: row.id });
          }
          setSnackbar('미션을 생성했습니다.');
          setEditingMission(null);
          refetchMissions();
          apiRef?.current?.forceUpdate();
          return;

        case 'edit':
          if (!row.missionTemplateId) {
            return;
          }
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
            title:
              row.missionTemplatesOptions.find(
                (t) => t.id === row.missionTemplateId,
              )?.title ?? '',
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
      mode: 'normal',
      additionalContentsOptions: additionalContents,
      essentialContentsOptions: essentialContents,
      missionTemplatesOptions: missionTemplates ?? [],
      onAction,
    }));

    if (editingMission) {
      result.push({
        ...editingMission,
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
