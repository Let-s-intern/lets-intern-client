'use client';

import { useState } from 'react';

import { usePatchUser, useUserQuery } from '@/api/user/user';
import SolidButton from '@/common/button/SolidButton';
import EditorApp, { emptyEditorState } from '@/common/lexical/EditorApp';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';

export default function MentorDetailContentSection() {
  const { data: user, isLoading } = useUserQuery();
  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  const [content, setContent] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { mutate: patchUser, isPending } = usePatchUser(
    () => {
      setIsDirty(false);
      showConfirm({
        title: '상세페이지가 저장되었습니다.',
        variant: 'success',
        confirmText: '바로가기',
        cancelText: '닫기',
        onConfirm: () => {
          if (user) {
            window.open(
              `${import.meta.env.VITE_WEB_URL ?? ''}/mentors/${user.userId}`,
              '_blank',
            );
          }
          alertProps.onClose();
        },
      });
    },
    () => showAlert({ title: '저장에 실패했습니다.', variant: 'error' }),
  );

  const initialContent = user?.description || emptyEditorState;

  const handleChange = (jsonString: string) => {
    setContent(jsonString);
    setIsDirty(jsonString !== initialContent);
  };

  const handleSave = () => {
    if (content === null) return;
    patchUser({ description: content });
  };

  return (
    <section className="border-neutral-80 bg-static-100 rounded-xl border p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xsmall16 md:text-small18 text-neutral-0 font-medium">
            프로필 상세페이지 제작
          </h2>
          {user && (
            <a
              href={`${import.meta.env.VITE_WEB_URL ?? ''}/mentors/${user.userId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-xsmall14 hover:text-primary-dark underline underline-offset-2"
            >
              바로가기
            </a>
          )}
        </div>
        <SolidButton
          size="xs"
          onClick={handleSave}
          disabled={!isDirty || isPending}
        >
          상세페이지 저장
        </SolidButton>
      </div>

      <div className="mt-4">
        {isLoading || !user ? (
          <div className="text-xsmall14 text-neutral-40 py-4">로딩 중...</div>
        ) : (
          <EditorApp
            initialEditorStateJsonString={user.description || emptyEditorState}
            onChange={handleChange}
          />
        )}
      </div>

      <MentorAlertModal {...alertProps} />
    </section>
  );
}
