'use client';

import { useState } from 'react';

import { usePatchUser, useUserQuery } from '@/api/user/user';
import SolidButton from '@/common/button/SolidButton';
import EditorApp, { emptyEditorState } from '@/common/lexical/EditorApp';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';

export default function MentorDetailContentSection() {
  const { data: user, isLoading } = useUserQuery();
  const { alertProps, showAlert } = useMentorAlert();

  const [content, setContent] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { mutate: patchUser, isPending } = usePatchUser(
    () => {
      setIsDirty(false);
      showAlert({ title: '상세페이지가 저장되었습니다.', variant: 'success' });
    },
    () => showAlert({ title: '저장에 실패했습니다.', variant: 'error' }),
  );

  const handleChange = (jsonString: string) => {
    setContent(jsonString);
    setIsDirty(true);
  };

  const handleSave = () => {
    if (content === null) return;
    patchUser({ description: content });
  };

  return (
    <section className="border-neutral-80 bg-static-100 rounded-xl border p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xsmall16 md:text-small18 text-neutral-0 font-medium">
          상세페이지 제작
        </h2>
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
