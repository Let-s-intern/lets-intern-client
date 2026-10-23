import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  CreateMeetingServerReq,
  meetingServerListSchema,
  UpdateMeetingServerReq,
} from './meetingServerSchema';

/**
 * 회의 서버 어드민 API.
 *
 * `/api/v1/admin/**` 경로라 서버 시큐리티가 ADMIN 권한을 요구한다.
 */
const MEETING_SERVER_PATH = '/admin/meeting-servers';

export const meetingServerQueryKey = ['meeting-servers'];

export const useMeetingServerListQuery = () =>
  useQuery({
    queryKey: meetingServerQueryKey,
    queryFn: async () => {
      const res = await axios.get(MEETING_SERVER_PATH);
      return meetingServerListSchema.parse(res.data.data).meetingServerList;
    },
  });

interface MutationCallbacks {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}

export const useCreateMeetingServer = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateMeetingServerReq) => {
      const res = await axios.post(MEETING_SERVER_PATH, req);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingServerQueryKey });
      successCallback?.();
    },
    onError: (error: Error) => errorCallback?.(error),
  });
};

export const useUpdateMeetingServer = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ meetingServerId, ...req }: UpdateMeetingServerReq) => {
      const res = await axios.patch(
        `${MEETING_SERVER_PATH}/${meetingServerId}`,
        req,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingServerQueryKey });
      successCallback?.();
    },
    onError: (error: Error) => errorCallback?.(error),
  });
};

export const useDeleteMeetingServer = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (meetingServerId: number) => {
      const res = await axios.delete(
        `${MEETING_SERVER_PATH}/${meetingServerId}`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingServerQueryKey });
      successCallback?.();
    },
    onError: (error: Error) => errorCallback?.(error),
  });
};
