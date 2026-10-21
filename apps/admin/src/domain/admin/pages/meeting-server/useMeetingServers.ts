import { useState } from 'react';

import {
  useDeleteMeetingServer,
  useMeetingServerListQuery,
  useUpdateMeetingServer,
} from '@/api/meetingServer';
import type { MeetingServer } from '@/api/meetingServerSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

import { toMeetingServerErrorMessage } from './toMeetingServerErrorMessage';

/**
 * 회의 서버 목록 화면의 상태. 조회·사용 토글·삭제는 같은 목록을 다시 읽으므로 한 훅에 둔다.
 */
const useMeetingServers = () => {
  const { snackbar } = useAdminSnackbar();
  const { data, isLoading, isError } = useMeetingServerListQuery();

  /**
   * 서버가 거절한 사유. 스낵바는 몇 초 뒤 사라지는데, 마지막 사용 중 서버 같은 사유는 읽고
   * 다음 행동을 정해야 하므로 화면에 남겨 둔다.
   */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [itemForDeleting, setItemForDeleting] = useState<MeetingServer | null>(
    null,
  );

  const { mutate: update, isPending: isToggling } = useUpdateMeetingServer({
    successCallback: () => setErrorMessage(null),
    errorCallback: (error) => {
      console.error('[useMeetingServers] toggle failed', error);
      setErrorMessage(
        toMeetingServerErrorMessage(error, '사용 여부를 변경하지 못했습니다.'),
      );
    },
  });

  const toggleActive = (item: MeetingServer) =>
    update({ meetingServerId: item.meetingServerId, isActive: !item.isActive });

  const { mutate: remove, isPending: isDeleting } = useDeleteMeetingServer({
    successCallback: () => {
      setItemForDeleting(null);
      setErrorMessage(null);
      snackbar('회의 서버를 삭제했습니다.');
    },
    errorCallback: (error) => {
      console.error('[useMeetingServers] delete failed', error);
      setItemForDeleting(null);
      setErrorMessage(
        toMeetingServerErrorMessage(error, '회의 서버를 삭제하지 못했습니다.'),
      );
    },
  });

  const confirmDelete = () => {
    if (!itemForDeleting) return;
    remove(itemForDeleting.meetingServerId);
  };

  return {
    servers: data ?? [],
    isLoading,
    isError,
    errorMessage,
    isToggling,
    toggleActive,
    itemForDeleting,
    isDeleting,
    askDelete: setItemForDeleting,
    cancelDelete: () => setItemForDeleting(null),
    confirmDelete,
  };
};

export default useMeetingServers;
