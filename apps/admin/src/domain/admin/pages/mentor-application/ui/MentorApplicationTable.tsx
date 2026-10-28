import {
  AdminMentorApplicationListQueryKey,
  useAdminMentorApplicationListQuery,
  useDeleteAdminMentorApplication,
  usePatchAdminMentorApplicationStatus,
} from '@/api/mentor-application/mentorApplication';
import {
  CONTACT_METHOD_LABEL,
  MENTOR_APPLICATION_STATUSES,
  MENTOR_APPLICATION_STATUS_LABEL,
  type AdminMentorApplicationListItem,
  type MentorApplicationStatus,
} from '@/api/mentor-application/mentorApplicationSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { Button, MenuItem, Select } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { formatPhoneNum } from '../utils/formatPhoneNum';

const HEADERS = [
  '신청일',
  '이름',
  '소속',
  '직무',
  '전화번호',
  '이메일',
  '선호 연락 수단',
  '신청 현황',
  '삭제',
];

export default function MentorApplicationTable() {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();
  const { data: applications = [], isLoading } =
    useAdminMentorApplicationListQuery();
  const patchStatus = usePatchAdminMentorApplicationStatus();
  const deleteApplication = useDeleteAdminMentorApplication();
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);

  const handleStatusChange = async (
    id: number,
    status: MentorApplicationStatus,
  ) => {
    setStatusLoadingId(id);
    try {
      await patchStatus.mutateAsync({ id, status });
      snackbar('신청 현황이 변경되었습니다.');
    } catch (err) {
      snackbar(`문제가 발생했습니다: ${err}`);
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleDelete = async (application: AdminMentorApplicationListItem) => {
    if (!window.confirm(`${application.name}님의 신청서를 삭제하시겠습니까?`))
      return;

    try {
      await deleteApplication.mutateAsync(application.id);
      queryClient.invalidateQueries({
        queryKey: [AdminMentorApplicationListQueryKey],
      });
      snackbar('신청서가 삭제되었습니다.');
    } catch (err) {
      snackbar(`문제가 발생했습니다: ${err}`);
    }
  };

  return (
    <div className="border-neutral-80 rounded-lg border">
      {isLoading ? (
        <div className="text-xsmall14 text-neutral-40 py-16 text-center">
          불러오는 중...
        </div>
      ) : applications.length === 0 ? (
        <div className="text-xsmall14 text-neutral-40 py-16 text-center">
          접수된 신청서가 없습니다.
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-neutral-60 bg-neutral-95 border-b-2">
              {HEADERS.map((header) => (
                <th
                  key={header}
                  className="text-xsmall14 text-neutral-0 px-4 py-3 text-left font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr
                key={application.id}
                className="border-neutral-80 hover:bg-neutral-95 border-b transition-colors last:border-b-0"
              >
                <td className="text-xsmall14 px-4 py-4">
                  {dayjs(application.submittedAt).format('YYYY.MM.DD HH:mm')}
                </td>
                <td className="text-xsmall14 px-4 py-4">{application.name}</td>
                <td className="text-xsmall14 px-4 py-4">
                  {application.company}
                </td>
                <td className="text-xsmall14 px-4 py-4">
                  {application.jobTitle}
                </td>
                <td className="text-xsmall14 px-4 py-4">
                  {formatPhoneNum(application.phoneNum)}
                </td>
                <td className="text-xsmall14 px-4 py-4">{application.email}</td>
                <td className="text-xsmall14 px-4 py-4">
                  {application.preferredContactMethods
                    .map((method) => CONTACT_METHOD_LABEL[method])
                    .join(', ')}
                </td>
                <td className="px-4 py-4">
                  <Select
                    size="small"
                    value={application.status}
                    disabled={statusLoadingId === application.id}
                    inputProps={{
                      'aria-label': `${application.name} 신청 현황`,
                    }}
                    onChange={(e) =>
                      handleStatusChange(
                        application.id,
                        e.target.value as MentorApplicationStatus,
                      )
                    }
                  >
                    {MENTOR_APPLICATION_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {MENTOR_APPLICATION_STATUS_LABEL[status]}
                      </MenuItem>
                    ))}
                  </Select>
                </td>
                <td className="px-4 py-4">
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(application)}
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
