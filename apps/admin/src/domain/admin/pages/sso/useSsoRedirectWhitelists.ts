import { useState } from 'react';

import {
  useDeleteSsoRedirectWhitelist,
  useSsoRedirectWhitelistListQuery,
  useToggleSsoRedirectWhitelistActive,
} from '@/api/sso';
import type { SsoRedirectWhitelist } from '@/api/ssoSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

/**
 * SSO 리다이렉트 화이트리스트 목록 화면의 상태 (LC-3208, PRD 6.3).
 *
 * 조회·활성화 토글·삭제를 한 훅에 둔다. 셋 다 같은 목록을 다시 읽어야 화면이 맞으므로
 * 실제로는 함께 움직인다.
 */
const useSsoRedirectWhitelists = () => {
  const { snackbar } = useAdminSnackbar();

  const { data, isLoading, isError } = useSsoRedirectWhitelistListQuery();

  /**
   * 삭제 확인 중인 항목.
   *
   * id 가 아니라 항목을 통째로 들고 있는다. 확인 모달에 어떤 서비스의 어떤 URL 을 지우는지
   * 적어야 하는데, 이 화면의 실수는 "지울 생각이 없던 행을 지운" 쪽으로 난다.
   */
  const [itemForDeleting, setItemForDeleting] =
    useState<SsoRedirectWhitelist | null>(null);

  const { mutate: toggle, isPending: isToggling } =
    useToggleSsoRedirectWhitelistActive({
      /*
        실패를 조용히 넘기지 않는다. 낙관적 갱신을 하지 않으므로 화면은 원래 상태 그대로
        남는데, 알림이 없으면 운영은 눌렀는데 안 바뀌는 이유를 알 수 없고 계속 다시 누른다.
      */
      errorCallback: (error) => {
        console.error('[useSsoRedirectWhitelists] toggle failed', error);
        snackbar('활성화 상태를 변경하지 못했습니다.');
      },
    });

  /**
   * 활성화 여부를 뒤집는다.
   *
   * **삭제 대신 이 토글을 쓰는 것이 기본이다.** 특정 서비스의 SSO 를 잠시 막아야 할 때
   * 행을 지웠다 다시 만들면 URI 를 그대로 복원했는지 확인할 방법이 없다(PRD 5.2).
   */
  const toggleActive = (item: SsoRedirectWhitelist) =>
    toggle({ id: item.id, isActive: !item.isActive });

  const { mutate: remove, isPending: isDeleting } =
    useDeleteSsoRedirectWhitelist({
      successCallback: () => {
        setItemForDeleting(null);
        snackbar('화이트리스트에서 삭제했습니다.');
      },
      errorCallback: (error) => {
        console.error('[useSsoRedirectWhitelists] delete failed', error);
        // 모달을 닫지 않는다. 닫아 버리면 지워진 줄 알고 넘어간다.
        snackbar(`삭제하지 못했습니다: ${error.message}`);
      },
    });

  const confirmDelete = () => {
    if (!itemForDeleting) return;
    remove(itemForDeleting.id);
  };

  return {
    whitelists: data ?? [],
    isLoading,
    isError,
    isToggling,
    toggleActive,
    itemForDeleting,
    isDeleting,
    askDelete: setItemForDeleting,
    cancelDelete: () => setItemForDeleting(null),
    confirmDelete,
  };
};

export default useSsoRedirectWhitelists;
