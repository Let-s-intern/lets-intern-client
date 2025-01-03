import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { useControlScroll } from '@/hooks/useControlScroll';
import { Attendance, UpdateAttendanceReq } from '@/schema';
import axios from '@/utils/axios';
import { challengeSubmitDetailCellWidthList } from '@/utils/tableCellWidthList';

interface Props {
  attendance: Attendance;
  cellWidthListIndex: number;
}

const CommentCell = ({ attendance, cellWidthListIndex }: Props) => {
  const cursorPositionRef = useRef<number>();
  const selectionRef = useRef<string>();
  const queryClient = useQueryClient();

  const [modalShown, setModalShown] = useState(false);
  const [editingComment, setEditingComment] = useState(
    attendance.comments || '',
  );

  useControlScroll(modalShown);

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const editComment = useMutation({
    mutationFn: async (req: UpdateAttendanceReq) => {
      return axios.patch(`/attendance/${attendance.id}`, req);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      setModalShown(false);
    },
  });

  const handleCommentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    editComment.mutate({
      comments: editingComment,
    });
  };

  /** 링크 삽입 후 커서가 맨 마지막으로 이동하는 것을 방지 */
  useEffect(() => {
    if (!cursorPositionRef.current) return;

    const textarea = document.activeElement; // focused element
    (textarea as HTMLTextAreaElement).setSelectionRange(
      cursorPositionRef.current,
      cursorPositionRef.current,
    );
    cursorPositionRef.current = undefined;
  }, [editingComment]);

  return (
    <>
      <div
        className={clsx(
          'cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap px-2 py-3 text-center text-sm',
          cellWidthList[cellWidthListIndex],
        )}
        onClick={() => setModalShown(true)}
      >
        {attendance.comments || ''}
      </div>

      {modalShown && (
        <div className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-end bg-[rgb(0,0,0,0.5)]">
          <div className="flex w-[calc(100%-16rem)] items-center justify-center">
            <form
              className="w-full max-w-[80rem] rounded-xl bg-white px-12 py-10"
              onSubmit={handleCommentEdit}
            >
              <h2 className="text-xl font-semibold">코멘트 등록</h2>
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center">
                  <label htmlFor="user" className="w-20">
                    To.
                  </label>
                  <div className="flex-1 rounded-md border border-neutral-400 px-4 py-2 text-sm outline-none">
                    {attendance.name}
                  </div>
                </div>
                <div className="flex items-start">
                  <label htmlFor="comments" className="mt-1 w-20">
                    코멘트
                  </label>
                  <textarea
                    className="flex-1 resize-none rounded-md border border-neutral-400 px-4 py-2 text-sm outline-none"
                    name="comments"
                    maxLength={1200}
                    rows={12}
                    value={editingComment || ''}
                    placeholder="코멘트를 입력해주세요."
                    onSelect={() => {
                      const selected = window.getSelection()?.toString().trim();
                      if (!selected || selected === '') return;

                      selectionRef.current = selected;
                    }}
                    onChange={(e) => {
                      try {
                        const input = (e.nativeEvent as InputEvent).data;
                        new URL(input ?? '');
                        // URL이면 링크 삽입
                        const inputLength = input?.length ?? 0;
                        const link = `<a>${input}</a>`;
                        const cursorPosition =
                          e.currentTarget.selectionStart - inputLength;
                        setEditingComment(
                          (prev) =>
                            prev.substring(0, cursorPosition) +
                            link +
                            prev.substring(cursorPosition),
                        );
                        // 커서 위치 되돌리기
                        cursorPositionRef.current =
                          cursorPosition + inputLength + 7;
                      } catch (error) {
                        // URL이 아니면
                        setEditingComment(e.target.value);
                      }
                    }}
                    autoComplete="off"
                  />
                </div>
                <span className="text-right text-xsmall14 text-neutral-40">
                  {editingComment.length <= 1200 ? editingComment.length : 1200}
                  / 1200자
                </span>
              </div>
              <div className="mt-12 flex justify-end gap-2">
                <button className="rounded bg-neutral-700 px-5 py-[2px] text-sm text-white">
                  등록
                </button>
                <button
                  type="button"
                  className="rounded bg-stone-300 px-5 py-[2px] text-sm"
                  onClick={() => setModalShown(false)}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentCell;
