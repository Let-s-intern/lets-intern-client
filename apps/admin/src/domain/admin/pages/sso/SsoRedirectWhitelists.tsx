import WarningModal from '@/common/alert/WarningModal';
import TableLayout from '@/domain/admin/ui/table/TableLayout';
import dayjs from '@/lib/dayjs';

import useSsoRedirectWhitelists from './useSsoRedirectWhitelists';

/**
 * SSO 리다이렉트 화이트리스트 목록 (LC-3208, PRD 6.3).
 *
 * "SSO 로그인 성공 후 어디로 튈 수 있는가"를 서버가 판정하는 근거 목록이다.
 * 이 화면에서 지운 URL 은 즉시 그 서비스의 SSO 로그인을 끊는다.
 */

const formatCreatedAt = (value: string | null | undefined) =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-';

const SsoRedirectWhitelists = () => {
  const {
    whitelists,
    isLoading,
    isError,
    isToggling,
    toggleActive,
    itemForDeleting,
    isDeleting,
    askDelete,
    cancelDelete,
    confirmDelete,
  } = useSsoRedirectWhitelists();

  return (
    <>
      <TableLayout
        title="SSO 리다이렉트 화이트리스트"
        headerButton={{ label: '등록', href: '/sso/redirect-whitelist/new' }}
      >
        <p className="text-neutral-40 px-3 text-sm">
          SSO 로그인 후 이동을 허용할 주소 목록입니다. 비활성화하면 해당
          서비스의 SSO 로그인이 즉시 막힙니다.
        </p>

        {/*
        못 읽은 것과 등록된 것이 없는 것을 가른다. 조회 실패를 빈 목록으로 보여주면
        운영은 "등록된 게 없다"로 읽고 이미 있는 URL 을 다시 등록한다.
      */}
        {isLoading ? (
          <p className="text-neutral-40 py-10 text-center text-sm">
            불러오는 중...
          </p>
        ) : isError ? (
          <p className="text-neutral-40 py-10 text-center text-sm">
            화이트리스트를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : whitelists.length === 0 ? (
          <p className="text-neutral-40 py-10 text-center text-sm">
            등록된 화이트리스트가 없습니다.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-neutral-100 text-left">
                <th className="px-3 py-2">서비스명</th>
                <th className="px-3 py-2">허용 URL</th>
                <th className="px-3 py-2">활성화</th>
                <th className="px-3 py-2">생성일</th>
                <th className="px-3 py-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {whitelists.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-3 py-2">{item.serviceName}</td>
                  <td className="break-all px-3 py-2">
                    {item.allowedRedirectUri}
                  </td>
                  <td className="px-3 py-2">
                    {/*
                    상태를 글자로도 적는다. 스위치 모양만으로는 켜진 쪽이 어느 쪽인지
                    사람마다 다르게 읽는데, 여기서 잘못 읽으면 살아 있는 서비스를 끈다.
                  */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.isActive}
                      aria-label={`${item.serviceName} 활성화`}
                      disabled={isToggling}
                      onClick={() => toggleActive(item)}
                      className={`rounded-xxs border px-3 py-1 text-xs disabled:opacity-50 ${
                        item.isActive
                          ? 'border-primary text-primary'
                          : 'border-neutral-300 text-neutral-500'
                      }`}
                    >
                      {item.isActive ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    {formatCreatedAt(item.createdAt)}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      aria-label={`${item.serviceName} 삭제`}
                      onClick={() => askDelete(item)}
                      className="rounded-xxs border border-red-300 px-3 py-1 text-xs text-red-500"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableLayout>

      {/*
        되돌릴 수 없는 액션이라 확인 단계를 둔다. 화이트리스트를 잘못 지우면 그 서비스의
        SSO 로그인이 즉시 끊기고, 복구하려면 URL 을 정확히 기억해 다시 등록해야 한다.
        그래서 확인 문구에 서비스명과 URL 을 그대로 적는다.
      */}
      <WarningModal
        isOpen={itemForDeleting !== null}
        isLoading={isDeleting}
        title="화이트리스트 삭제"
        content={
          itemForDeleting
            ? `${itemForDeleting.serviceName} (${itemForDeleting.allowedRedirectUri}) 을(를) 삭제하시겠습니까? 해당 서비스의 SSO 로그인이 즉시 막힙니다.`
            : ''
        }
        confirmText="삭제"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default SsoRedirectWhitelists;
