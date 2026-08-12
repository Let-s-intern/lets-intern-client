import {
  useSsoRedirectWhitelistListQuery,
  useToggleSsoRedirectWhitelistActive,
} from '@/api/sso';
import type { SsoRedirectWhitelist } from '@/api/ssoSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

/**
 * SSO 리다이렉트 화이트리스트 목록 화면의 상태 (LC-3208, PRD 6.3).
 *
 * 조회와 활성화 토글을 한 훅에 둔다. 토글은 목록을 다시 읽어야 화면이 맞으므로
 * 두 관심사가 실제로는 함께 움직인다.
 */
const useSsoRedirectWhitelists = () => {
  const { snackbar } = useAdminSnackbar();

  const { data, isLoading, isError } = useSsoRedirectWhitelistListQuery();

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

  return {
    whitelists: data ?? [],
    isLoading,
    isError,
    isToggling,
    toggleActive,
  };
};

export default useSsoRedirectWhitelists;
