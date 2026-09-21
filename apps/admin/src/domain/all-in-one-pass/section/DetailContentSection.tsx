import { lazy, Suspense } from 'react';

const EditorApp = lazy(() => import('@/common/lexical/EditorApp'));

interface Props {
  initialContent?: string | null;
  onChange: (json: string) => void;
}

/** 1.5 상세페이지 콘텐츠: 렉시컬 에디터 (랜딩페이지 하단 노출) */
export default function DetailContentSection({
  initialContent,
  onChange,
}: Props) {
  return (
    <section className="flex flex-col">
      <h2 className="text-small20 text-neutral-0 font-semibold">
        상세페이지 콘텐츠
      </h2>
      <div className="[&_.editor-scroller]:max-h-[480px]">
        <Suspense fallback={null}>
          <EditorApp
            initialEditorStateJsonString={initialContent ?? undefined}
            onChange={onChange}
          />
        </Suspense>
      </div>
    </section>
  );
}
