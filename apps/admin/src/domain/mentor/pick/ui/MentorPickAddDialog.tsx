import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import { useAdminUserMentorListQuery } from '@/api/mentor/mentor';
import type { AdminMentorPick } from '@/api/mentor/mentorSchema';

export type PickMentor = Pick<
  AdminMentorPick,
  'mentorId' | 'name' | 'nickname' | 'isVisible'
>;

interface Props {
  /** 이미 픽인 멘토. 목록에서 뺀다 */
  pickedMentorIds: number[];
  onClose: () => void;
  /** 고른 멘토. 픽 맨 뒤에 붙는다 */
  onAdd: (mentors: PickMentor[]) => void;
}

/** 렛커 픽에 넣을 멘토 고르기. 기존 멘토 전체 목록(`GET /api/v2/admin/user/mentor`)에서 이름·닉네임으로 찾는다 */
export default function MentorPickAddDialog({
  pickedMentorIds,
  onClose,
  onAdd,
}: Props) {
  const { data, isLoading } = useAdminUserMentorListQuery();
  const [keyword, setKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const candidates = (data?.mentorList ?? [])
    .filter((mentor) => !pickedMentorIds.includes(mentor.id))
    .filter((mentor) =>
      [mentor.name, mentor.nickname ?? ''].some((value) =>
        value.toLowerCase().includes(normalizedKeyword),
      ),
    );

  const toggle = (mentorId: number) =>
    setSelectedIds((prev) =>
      prev.includes(mentorId)
        ? prev.filter((id) => id !== mentorId)
        : [...prev, mentorId],
    );

  const handleAdd = () => {
    const mentors = (data?.mentorList ?? [])
      .filter((mentor) => selectedIds.includes(mentor.id))
      .map((mentor) => ({
        mentorId: mentor.id,
        name: mentor.name,
        nickname: mentor.nickname ?? null,
        isVisible: mentor.isVisible ?? null,
      }));
    onAdd(mentors);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-base font-semibold">멘토 추가</DialogTitle>
      <DialogContent>
        <TextField
          size="small"
          fullWidth
          className="mt-2"
          placeholder="이름·닉네임 검색"
          inputProps={{ 'aria-label': '이름·닉네임 검색' }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {isLoading ? (
          <p className="text-xsmall14 text-neutral-40 py-6">불러오는 중...</p>
        ) : candidates.length === 0 ? (
          <p className="text-xsmall14 text-neutral-40 py-6">
            추가할 멘토가 없습니다.
          </p>
        ) : (
          <ul className="mt-2 flex max-h-96 flex-col overflow-y-auto">
            {candidates.map((mentor) => (
              <li key={mentor.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedIds.includes(mentor.id)}
                      onChange={() => toggle(mentor.id)}
                    />
                  }
                  label={
                    mentor.nickname
                      ? `${mentor.name} (${mentor.nickname})`
                      : mentor.name
                  }
                />
              </li>
            ))}
          </ul>
        )}
        <p className="text-xxsmall12 text-neutral-40 mt-2">
          이미 픽인 멘토는 목록에서 빠집니다. 추가하면 맨 뒤에 붙습니다.
        </p>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="contained"
          disabled={selectedIds.length === 0}
          onClick={handleAdd}
        >
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}
