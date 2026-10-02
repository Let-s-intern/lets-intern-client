import ChallengeLecture from '@/pages/program/challenge/ChallengeLecture';
import ChallengeCurriculumEditor from '@/domain/admin/program/challenge/ChallengeCurriculum';
import ChallengePointEditor from '@/domain/admin/program/challenge/ChallengePoint';
import ChallengeBlogReviewSection from '@/domain/admin/program/ChallengeBlogReviewSection';
import ProgramBestReview from '@/domain/admin/program/ProgramBestReview';
import Heading3 from '@/domain/admin/ui/heading/Heading3';
import ProgramRecommendEditor from '@/domain/program-recommend/ProgramRecommendEditor';
import { ChallengeType } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const EditorApp = lazy(() => import('@/common/lexical/EditorApp'));

interface Props {
  /** 버전 상세 본문 JSON. 챌린지 desc 와 같은 모양 */
  description: string;
  challengeType?: ChallengeType;
  onChange: (description: string) => void;
}

/**
 * 버전 상세 본문 편집기. 챌린지 수정 화면의 본문 편집부와 같은 컴포넌트를 쓴다.
 * 편집 중 상태는 여기 두고 바뀔 때마다 JSON 으로 올린다. 다른 버전을 열면 key 로 새로 만든다.
 * FAQ 는 챌린지 값을 그대로 쓰므로 없다.
 */
function ChallengeVersionContentEditor({
  description,
  challengeType,
  onChange,
}: Props) {
  const [content, setContent] = useState<ChallengeContent>(() =>
    JSON.parse(description),
  );
  const lastSent = useRef(description);

  useEffect(() => {
    const next = JSON.stringify(content);
    if (next === lastSent.current) return;
    lastSent.current = next;
    onChange(next);
  }, [content, onChange]);

  if (content.isFreeTemplate) {
    return (
      <Suspense fallback={null}>
        <EditorApp
          initialEditorStateJsonString={
            content.freeContent
              ? JSON.stringify(content.freeContent)
              : undefined
          }
          onChangeSerializedEditorState={(json) =>
            setContent((prev) => ({ ...prev, freeContent: json }))
          }
        />
      </Suspense>
    );
  }

  return (
    <>
      <Heading3>인트로</Heading3>
      <Suspense fallback={null}>
        <EditorApp
          initialEditorStateJsonString={JSON.stringify(content.intro)}
          onChangeSerializedEditorState={(json) =>
            setContent((prev) => ({ ...prev, intro: json }))
          }
        />
      </Suspense>

      <ChallengePointEditor
        challengePoint={content.challengePoint}
        setContent={setContent}
      />

      {challengeType && (
        <ChallengeLecture
          challengeType={challengeType}
          content={content}
          setContent={setContent}
        />
      )}

      <Heading3>상세 설명 (특별 챌린지 및 합격자 후기)</Heading3>
      <Suspense fallback={null}>
        <EditorApp
          initialEditorStateJsonString={JSON.stringify(content.mainDescription)}
          onChangeSerializedEditorState={(json) =>
            setContent((prev) => ({ ...prev, mainDescription: json }))
          }
        />
      </Suspense>

      <section className="mb-6">
        <ProgramRecommendEditor
          programRecommend={content.programRecommend ?? { list: [] }}
          setProgramRecommend={(programRecommend) =>
            setContent((prev) => ({ ...prev, programRecommend }))
          }
          maxCount={(content.curationCard?.visible ?? true) ? 2 : undefined}
        />
      </section>

      <ChallengeCurriculumEditor
        curriculum={content.curriculum}
        setContent={setContent}
        curriculumImage={content.curriculumImage}
        weekText={content.challengePoint?.weekText}
        content={content}
      />

      <ProgramBestReview
        reviewFields={content.challengeReview ?? []}
        setReviewFields={(reviewFields) =>
          setContent((prev) => ({ ...prev, challengeReview: reviewFields }))
        }
      />
      <ChallengeBlogReviewSection
        externalBlogReviews={content.externalBlogReviews ?? []}
        onExternalChange={(externalBlogReviews) =>
          setContent((prev) => ({ ...prev, externalBlogReviews }))
        }
        blogReview={content.blogReview ?? { list: [] }}
        onBlogReviewChange={(blogReview) =>
          setContent((prev) => ({ ...prev, blogReview }))
        }
      />
    </>
  );
}

export default ChallengeVersionContentEditor;
