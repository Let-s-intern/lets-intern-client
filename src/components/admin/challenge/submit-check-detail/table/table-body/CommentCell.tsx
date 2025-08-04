import { usePatchAdminAttendance } from '@/api/attendance';
import { useControlScroll } from '@/hooks/useControlScroll';
import { AttendanceItem } from '@/schema';
import { challengeSubmitDetailCellWidthList } from '@/utils/tableCellWidthList';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

interface Props {
  attendance: AttendanceItem['attendance'];
  cellWidthListIndex: number;
}

const CommentCell = ({ attendance, cellWidthListIndex }: Props) => {
  const cursorPositionRef = useRef<number>();
  const selectionRef = useRef<string>();

  const [modalShown, setModalShown] = useState(false);
  const [editingComment, setEditingComment] = useState(
    attendance.comments || '',
  );

  useControlScroll(modalShown);

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const patchAdminAttendance = usePatchAdminAttendance();

  const handleCommentEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await patchAdminAttendance.mutateAsync({
      attendanceId: attendance.id,
      comments: editingComment,
    });
    setModalShown(false);
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
          'my-auto cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap border-r border-[#D9D9D9] px-2 py-3 text-center text-sm',
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
                      // 사용자가 선택한 텍스트 저장
                      const selected = window.getSelection()?.toString();

                      if (selected) selectionRef.current = selected;
                      if (selected?.trim() === '') {
                        selectionRef.current = undefined;
                      }
                    }}
                    onChange={(e) => {
                      try {
                        const input = (e.nativeEvent as InputEvent).data;
                        new URL(input ?? '');

                        // URL이면 링크 삽입
                        const inputLength = input?.length ?? 0;
                        const cursorPosition =
                          e.currentTarget.selectionStart - inputLength;
                        let link = '';

                        if (selectionRef.current) {
                          link = `(${selectionRef.current})[${input}]`;
                          // 이전 커서 위치 저장
                          cursorPositionRef.current =
                            cursorPosition +
                            inputLength +
                            selectionRef.current.length +
                            4;
                        } else {
                          link = `(${input})[${input}]`;
                          cursorPositionRef.current =
                            cursorPosition + inputLength * 2 + 4;
                        }

                        setEditingComment(
                          (prev) =>
                            prev.substring(0, cursorPosition) +
                            link +
                            prev.substring(
                              cursorPosition +
                                (selectionRef.current?.length ?? 0),
                            ),
                        );
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
