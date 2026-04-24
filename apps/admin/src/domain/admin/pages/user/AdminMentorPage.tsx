import { Link, useNavigate } from 'react-router-dom';
import {
  usePatchUserAdminMutation,
  useUserAdminQuery,
  UseUserAdminQueryKey,
} from '@/api/user/user';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button, Tab, Tabs } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

const PAGE_SIZE = 1000;

function MentorManagementTable() {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();
  const { data, isLoading } = useUserAdminQuery({
    isMentor: true,
    pageable: { page: 1, size: PAGE_SIZE },
  });

  const mentors = useMemo(
    () =>
      (data?.userAdminList ?? [])
        .filter((u) => u.userInfo.isMentor === true)
        .map((u) => ({
          id: u.userInfo.id,
          name: u.userInfo.name,
          email: u.userInfo.email,
          phoneNum: u.userInfo.phoneNum,
        })),
    [data],
  );

  const patchUser = usePatchUserAdminMutation({});

  const handleDelete = async (
    e: React.MouseEvent,
    mentorId: number,
    mentorName: string,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm(`${mentorName} 멘토를 삭제하시겠습니까?`)) return;

    try {
      await patchUser.mutateAsync({ id: mentorId, isMentor: false });
      queryClient.invalidateQueries({
        queryKey: [UseUserAdminQueryKey],
      });
      snackbar('멘토가 삭제되었습니다.');
    } catch (err) {
      snackbar(`문제가 발생했습니다: ${err}`);
    }
  };

  return (
    <div>
      <div className="rounded-lg border border-neutral-80">
        {isLoading ? (
          <div className="py-16 text-center text-xsmall14 text-neutral-40">
            불러오는 중...
          </div>
        ) : mentors.length === 0 ? (
          <div className="py-16 text-center text-xsmall14 text-neutral-40">
            등록된 멘토가 없습니다.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-60 bg-neutral-95">
                <th className="px-6 py-3 text-left text-xsmall14 font-semibold text-neutral-0">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xsmall14 font-semibold text-neutral-0">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xsmall14 font-semibold text-neutral-0">
                  전화번호
                </th>
                <th className="px-6 py-3 text-center text-xsmall14 font-semibold text-neutral-0">
                  멘토 삭제
                </th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((mentor) => (
                <tr
                  key={mentor.id}
                  className="cursor-pointer border-b border-neutral-80 transition-colors hover:bg-neutral-95 last:border-b-0"
                >
                  <td className="px-6 py-4 text-xsmall14">
                    <Link
                      to={`/mentors/${mentor.id}`}
                      className="text-neutral-0 underline hover:text-primary-30"
                    >
                      {mentor.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-xsmall14">
                    {mentor.email ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-xsmall14">
                    {mentor.phoneNum ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={(e) => handleDelete(e, mentor.id, mentor.name)}
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
    </div>
  );
}

export default function AdminMentorPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1) {
      navigate('/mentors/register');
    } else {
      setTab(newValue);
    }
  };

  return (
    <section className="p-5">
      <Heading className="mb-4">멘토 관리</Heading>

      <Tabs value={tab} onChange={handleTabChange} className="mb-4">
        <Tab label="멘토 관리" />
        <Tab label="멘토 등록" />
      </Tabs>

      <MentorManagementTable />
    </section>
  );
}
