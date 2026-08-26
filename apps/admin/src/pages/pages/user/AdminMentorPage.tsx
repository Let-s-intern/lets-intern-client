import {
  useAdminUserMentorListQuery,
  UseAdminUserMentorListQueryKey,
} from '@/api/mentor/mentor';
import type { AdminUserMentorList } from '@/api/mentor/mentorSchema';
import {
  usePatchUserAdminMutation,
  UseUserAdminQueryKey,
} from '@/api/user/user';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  Tab,
  Tabs,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

const PAGE_SIZE = 1000;

type Mentor = AdminUserMentorList['mentorList'][number];
type MentorHashTag = Mentor['hashTagList'][number];

function MentorManagementTable() {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();
  const { data, isLoading } = useAdminUserMentorListQuery({
    page: 1,
    size: PAGE_SIZE,
  });

  const mentors = data?.mentorList ?? [];

  const patchUser = usePatchUserAdminMutation({});
  const [viewingMentor, setViewingMentor] = useState<Mentor | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const closeViewDialog = () => setIsViewDialogOpen(false);
  const [visibleLoadingId, setVisibleLoadingId] = useState<number | null>(
    null,
  );

  const handleVisibleChange = async (mentorId: number, checked: boolean) => {
    setVisibleLoadingId(mentorId);
    try {
      await patchUser.mutateAsync({ id: mentorId, isVisible: checked });
      queryClient.invalidateQueries({
        queryKey: [UseAdminUserMentorListQueryKey],
      });
    } catch (err) {
      snackbar(`문제가 발생했습니다: ${err}`);
    } finally {
      setVisibleLoadingId(null);
    }
  };

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
        predicate: ({ queryKey }) =>
          queryKey[0] === UseAdminUserMentorListQueryKey ||
          queryKey[0] === UseUserAdminQueryKey,
      });
      snackbar('멘토가 삭제되었습니다.');
    } catch (err) {
      snackbar(`문제가 발생했습니다: ${err}`);
    }
  };

  return (
    <div>
      <div className="border-neutral-80 rounded-lg border">
        {isLoading ? (
          <div className="text-xsmall14 text-neutral-40 py-16 text-center">
            불러오는 중...
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-xsmall14 text-neutral-40 py-16 text-center">
            등록된 멘토가 없습니다.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-neutral-60 bg-neutral-95 border-b-2">
                <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-left font-semibold">
                  이름
                </th>
                <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-left font-semibold">
                  닉네임
                </th>
                <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-left font-semibold">
                  전화번호
                </th>
                <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-left font-semibold">
                  이메일
                </th>
                <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-left font-semibold">
                  키워드
                </th>
                <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-center font-semibold">
                  노출여부
                </th>
                <th className="text-xsmall14 text-neutral-0 px-6 py-3 text-center font-semibold">
                  멘토 삭제
                </th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((mentor) => (
                <tr
                  key={mentor.id}
                  className="border-neutral-80 hover:bg-neutral-95 cursor-pointer border-b transition-colors last:border-b-0"
                >
                  <td className="text-xsmall14 px-6 py-4">
                    <Link
                      to={`/mentors/${mentor.id}`}
                      className="text-neutral-0 hover:text-primary-30 underline"
                    >
                      {mentor.name}
                    </Link>
                  </td>
                  <td className="text-xsmall14 px-6 py-4">
                    {mentor.nickname ?? '-'}
                  </td>
                  <td className="text-xsmall14 px-6 py-4">
                    {mentor.phoneNum ?? '-'}
                  </td>
                  <td className="text-xsmall14 px-6 py-4">
                    {mentor.email ?? '-'}
                  </td>
                  <td className="text-xsmall14 px-6 py-4">
                    {mentor.hashTagList.length === 0 ? (
                      '-'
                    ) : (
                      <button
                        type="button"
                        className="text-blue-500 underline transition hover:text-blue-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingMentor(mentor);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        조회
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={mentor.isVisible ?? false}
                      disabled={visibleLoadingId === mentor.id}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleVisibleChange(mentor.id, e.target.checked)
                      }
                    />
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

      <Dialog
        open={isViewDialogOpen}
        onClose={closeViewDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="border-neutral-80 border-b">
          {viewingMentor?.name}님 멘토키워드
        </DialogTitle>
        <IconButton
          aria-label="닫기"
          onClick={closeViewDialog}
          sx={{ position: 'absolute', right: 10, top: 12 }}
        >
          <IoCloseOutline size={20} />
        </IconButton>
        <DialogContent>
          <div className="flex flex-wrap gap-2">
            {viewingMentor?.hashTagList.map((tag: MentorHashTag) => (
              <span
                key={tag.id}
                className="border-neutral-80 text-xsmall14 text-neutral-30 rounded-full border px-3 py-1.5"
              >
                # {tag.title}
              </span>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminMentorPage() {
  const navigate = useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1) {
      navigate('/mentors/register');
    } else if (newValue === 2) {
      navigate('/mentors/keywords');
    }
  };

  return (
    <section className="p-5">
      <Heading className="mb-4">멘토 관리</Heading>

      <Tabs value={0} onChange={handleTabChange} className="mb-4">
        <Tab label="멘토 관리" />
        <Tab label="멘토 등록" />
        <Tab label="멘토 키워드" />
      </Tabs>

      <MentorManagementTable />
    </section>
  );
}
