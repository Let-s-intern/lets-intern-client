'use client';

import Link from 'next/link';
import { useAdminUserMentorListQuery } from '@/api/mentor/mentor';
import {
  usePatchUserAdminMutation,
  UseUserAdminQueryKey,
} from '@/api/user/user';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminMentorPage() {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();
  const { data, isLoading } = useAdminUserMentorListQuery();
  const mentors = data?.mentorList ?? [];

  const patchUser = usePatchUserAdminMutation({});

  const handleDelete = async (mentorId: number, mentorName: string) => {
    if (!window.confirm(`${mentorName} 멘토를 삭제하시겠습니까?`)) return;

    try {
      await patchUser.mutateAsync({ id: mentorId, isMentor: false });
      queryClient.invalidateQueries({
        queryKey: ['useAdminUserMentorListQuery'],
      });
      queryClient.invalidateQueries({
        queryKey: [UseUserAdminQueryKey],
      });
      snackbar('멘토가 삭제되었습니다.');
    } catch (err) {
      snackbar(`문제가 발생했습니다: ${err}`);
    }
  };

  return (
    <section className="p-5">
      <Heading className="mb-4">멘토 관리</Heading>

      <div className="mb-4">
        <Button variant="outlined" component={Link} href="/admin/mentors/register">
          멘토 등록
        </Button>
      </div>

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
                  닉네임
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
                  className="border-b border-neutral-80 last:border-b-0"
                >
                  <td className="px-6 py-4 text-xsmall14">{mentor.name}</td>
                  <td className="px-6 py-4 text-xsmall14">
                    {mentor.nickname ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-xsmall14">
                    {mentor.phoneNum ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(mentor.id, mentor.name)}
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
    </section>
  );
}
