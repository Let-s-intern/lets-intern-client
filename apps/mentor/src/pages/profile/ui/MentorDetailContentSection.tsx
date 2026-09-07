'use client';

import { useUserQuery } from '@/api/user/user';
import EditorApp, { emptyEditorState } from '@/common/lexical/EditorApp';

interface MentorDetailContentSectionProps {
  /**
   * 에디터를 다시 그릴 때 쓰는 키. 값이 바뀌면 초기 내용부터 다시 마운트된다.
   *
   * `EditorApp` 은 `initialEditorStateJsonString` 만 받는 비제어 컴포넌트라
   * 바깥에서 값을 되돌려도 화면이 따라오지 않는다. "취소" 를 눌렀을 때 본문만
   * 옛 내용으로 남는 것을 막으려면 이 방법뿐이다.
   */
  resetKey: number;
  /** 마운트 시 에디터에 넣을 내용. 저장된 값이다. */
  initialContent: string;
  onChange: (jsonString: string) => void;
}

/**
 * 프로필 상세페이지 제작(Lexical 에디터).
 *
 * 저장 버튼이 없다 — 프로필 화면의 저장은 하단 플로팅 바 하나뿐이다(LC-3266).
 * 본문은 `PATCH /user` 의 `description` 이라 기본 정보와 같은 요청으로 나간다.
 */
export default function MentorDetailContentSection({
  resetKey,
  initialContent,
  onChange,
}: MentorDetailContentSectionProps) {
  const { data: user, isLoading } = useUserQuery();

  return (
    <section className="border-neutral-80 bg-static-100 rounded-xl border p-5 md:p-6">
      <div className="flex w-full items-center justify-between md:w-auto md:justify-normal md:gap-2.5">
        <h2 className="text-xsmall16 md:text-small18 text-neutral-0 font-medium tracking-tight">
          프로필 상세페이지 제작
        </h2>
        {user && (
          <a
            href={`${import.meta.env.VITE_WEB_URL ?? ''}/mentors/${user.userId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-xsmall14 hover:text-primary-dark tracking-tight underline underline-offset-2"
          >
            바로가기
          </a>
        )}
      </div>

      <div className="mt-4">
        <div className="flex flex-col items-center justify-center py-20 md:hidden">
          <p className="text-xsmall14 text-neutral-40 whitespace-pre-line text-center">
            상세페이지 제작은{'\n'}데스크탑을 이용해주세요.
          </p>
        </div>

        <div className="hidden md:block">
          {isLoading || !user ? (
            <div className="text-xsmall14 text-neutral-40 py-4">로딩 중...</div>
          ) : (
            <EditorApp
              key={resetKey}
              initialEditorStateJsonString={initialContent || emptyEditorState}
              onChange={onChange}
            />
          )}
        </div>
      </div>
    </section>
  );
}
