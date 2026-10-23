import EditorApp, { emptyEditorState } from '@/common/lexical/EditorApp';

interface Props {
  /** 서버에 저장된 본문(Lexical JSON). 마운트할 때만 읽는다 */
  initialDescription: string | null;
  onChange: (jsonString: string) => void;
}

/**
 * 멘토 프로필 상세페이지 본문(`User.description`). 멘토 앱 「프로필 상세페이지 제작」 과 같은 내용이다.
 *
 * `EditorApp` 은 초기값만 읽는 비제어 컴포넌트라, 다른 멘토로 바뀌었을 때 다시 그리려면 부모가
 * `key` 를 바꿔 다시 마운트해야 한다.
 */
export default function MentorDescriptionField({
  initialDescription,
  onChange,
}: Props) {
  return (
    <div className="mt-4">
      <label className="text-xsmall14 text-neutral-30 mb-1 block font-medium">
        프로필 상세페이지
      </label>
      <EditorApp
        initialEditorStateJsonString={initialDescription || emptyEditorState}
        onChange={onChange}
      />
      <p className="text-xxsmall12 text-neutral-40 mt-1">
        본문을 고치지 않으면 저장할 때 본문은 보내지 않습니다.
      </p>
    </div>
  );
}
