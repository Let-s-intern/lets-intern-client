import LexicalContent from '@/domain/blog/ui/LexicalContent';
import { ChallengeIdPrimitive } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { useMemo } from 'react';

interface ChallengeIntroEditorContentProps {
  challenge: ChallengeIdPrimitive;
}

/**
 * 챌린지 인트로 에디터 콘텐츠를 렌더링하는 공통 컴포넌트
 * challenge.desc를 파싱하여 intro 콘텐츠를 자동으로 렌더링합니다.
 */
function ChallengeIntroEditorContent({
  challenge,
}: ChallengeIntroEditorContentProps) {
  const receivedContent = useMemo<ChallengeContent>(() => {
    if (!challenge?.desc) {
      return { initialized: false };
    }
    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return { initialized: false };
    }
  }, [challenge.desc]);

  const intro = receivedContent.intro;

  if (!intro?.root) {
    return null;
  }

  if (typeof intro.root !== 'object' || !('type' in intro.root)) {
    return null;
  }

  return (
    <section className="flex w-full flex-col items-center">
      <LexicalContent node={intro.root} />
    </section>
  );
}

export default ChallengeIntroEditorContent;
