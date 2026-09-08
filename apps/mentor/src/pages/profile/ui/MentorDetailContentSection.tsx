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
  onChange,
}: MentorDetailContentSectionProps) {
  const { data: user, isLoading } = useUserQuery();

  return (
    <section className="border-neutral-80 bg-static-100 rounded-xl border p-5 md:p-6">
      {/*
        바로가기는 여기 두지 않는다. 아직 저장하지 않은 글을 쓰는 중에 눌러 봐야 옛 페이지가
        열려서, 방금 쓴 내용이 반영되지 않은 것을 보게 된다. 저장에 성공한 뒤에 안내와 함께
        연다(LC-3277) — `ProfilePage` 의 저장 성공 처리에 있다.
      */}
      <h2 className="text-xsmall16 md:text-small18 text-neutral-0 font-medium tracking-tight">
        프로필 상세페이지 제작
      </h2>

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
            /*
             * 마운트 값은 서버 응답에서 **직접** 읽는다.
             *
             * 페이지가 들고 있는 저장본을 넘겨받으면 한 렌더 늦는다 — user 가 도착한
             * 렌더에서 에디터가 먼저 마운트되고, 그 뒤 effect 가 저장본을 채운다.
             * EditorApp 은 initialEditorStateJsonString 만 읽는 비제어 컴포넌트라
             * key 가 그대로면 늦게 온 값을 반영하지 않는다. 그래서 저장한 내용이
             * 새로고침 후 빈 화면으로 보였다.
             */
            <EditorApp
              key={resetKey}
              initialEditorStateJsonString={
                user.description || emptyEditorState
              }
              onChange={onChange}
            />
          )}
        </div>
      </div>
    </section>
  );
}
