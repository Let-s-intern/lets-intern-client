import { Link } from 'react-router-dom';

import WarningModal from '@/common/alert/WarningModal';
import TableLayout from '@/domain/admin/ui/table/TableLayout';
import dayjs from '@/lib/dayjs';

import useMeetingServers from './useMeetingServers';

/**
 * 회의 서버 목록 (LC-3439).
 *
 * 프론트가 헬스체크로 고른 base 가 이 목록의 사용 중 서버와 같아야 회의실 주소가 저장된다.
 */

const formatDate = (value: string | null | undefined) =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-';

const MeetingServers = () => {
  const {
    servers,
    isLoading,
    isError,
    errorMessage,
    isToggling,
    toggleActive,
    itemForDeleting,
    isDeleting,
    askDelete,
    cancelDelete,
    confirmDelete,
  } = useMeetingServers();

  return (
    <>
      <TableLayout
        title="회의 서버 관리"
        headerButton={{ label: '등록', href: '/meeting-servers/new' }}
      >
        <p className="text-neutral-40 px-3 text-sm">
          라이브 피드백과 1대1 라이브 멘토링이 쓰는 Jitsi 서버 목록입니다.
          우선순위 숫자가 작을수록 앞이고(0 이 주 서버), 앞 서버가 죽으면 다음
          순위 서버로 넘어갑니다. 사용 중이 아닌 서버의 주소로는 회의실에 들어갈
          수 없습니다.
        </p>

        {errorMessage && (
          <p role="alert" className="px-3 text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        {isLoading ? (
          <p className="text-neutral-40 py-10 text-center text-sm">
            불러오는 중...
          </p>
        ) : isError ? (
          <p className="text-neutral-40 py-10 text-center text-sm">
            회의 서버 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : servers.length === 0 ? (
          <p className="text-neutral-40 py-10 text-center text-sm">
            등록된 회의 서버가 없습니다.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-neutral-100 text-left">
                <th className="px-3 py-2">우선순위</th>
                <th className="px-3 py-2">주소</th>
                <th className="px-3 py-2">사용</th>
                <th className="px-3 py-2">수정일</th>
                <th className="px-3 py-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <tr key={server.meetingServerId} className="border-b">
                  <td className="px-3 py-2">{server.priority}</td>
                  <td className="break-all px-3 py-2">{server.baseUrl}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={server.isActive}
                      aria-label={`${server.baseUrl} 사용`}
                      disabled={isToggling}
                      onClick={() => toggleActive(server)}
                      className={`rounded-xxs border px-3 py-1 text-xs disabled:opacity-50 ${
                        server.isActive
                          ? 'border-primary text-primary'
                          : 'border-neutral-300 text-neutral-500'
                      }`}
                    >
                      {server.isActive ? '사용 중' : '사용 안 함'}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    {formatDate(server.lastModifiedDate)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <div className="flex gap-1">
                      <Link
                        to={`/meeting-servers/${server.meetingServerId}/edit`}
                        aria-label={`${server.baseUrl} 수정`}
                        className="rounded-xxs border border-neutral-300 px-3 py-1 text-xs text-neutral-600"
                      >
                        수정
                      </Link>
                      <button
                        type="button"
                        aria-label={`${server.baseUrl} 삭제`}
                        onClick={() => askDelete(server)}
                        className="rounded-xxs border border-red-300 px-3 py-1 text-xs text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableLayout>

      <WarningModal
        isOpen={itemForDeleting !== null}
        isLoading={isDeleting}
        title="회의 서버 삭제"
        content={
          itemForDeleting
            ? `${itemForDeleting.baseUrl} 을(를) 삭제하시겠습니까? 이 서버로 열린 회의실은 다음 입장 때 다른 서버로 옮겨집니다.`
            : ''
        }
        confirmText="삭제"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default MeetingServers;
