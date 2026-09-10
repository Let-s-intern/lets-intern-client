import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TableNode } from '@lexical/table';
import { useEffect } from 'react';

import { $repairTableNode } from '../../tableIntegrity';

/**
 * 표에 행이 아닌 자식이 들어오면 표 밖으로 빼낸다.
 *
 * 왜 필요한지는 `../../tableIntegrity.ts` 주석에 있다. 요약하면 `<TablePlugin>` 의
 * `TableNode` 트랜스폼이 그런 표를 만나면 예외를 던지고, 트랜스폼이라 표를 건드릴 때마다
 * 다시 던져 글 하나가 통째로 잠긴다.
 *
 * **이 플러그인은 `<TablePlugin>` 보다 먼저 렌더해야 한다.** 같은 노드 타입의 트랜스폼은
 * 등록 순서대로 돌고, Lexical 은 더 이상 dirty 가 없을 때까지 반복한다. 우리 것이 먼저
 * 고쳐 놓으면 뒤이어 도는 플러그인 트랜스폼은 멀쩡한 표를 본다.
 */
export default function TableIntegrityPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // 표 노드를 안 쓰는 에디터에 등록하면 Lexical 이 예외를 던진다.
    if (!editor.hasNodes([TableNode])) return;

    return editor.registerNodeTransform(TableNode, (node) => {
      if (!$repairTableNode(node)) return;

      /*
       * 삼키지 않고 남긴다. 원본 콘텐츠가 어떻게 망가졌는지는 아직 모르고, 실제 사례가
       * 쌓여야 역추적할 수 있다. admin 에는 Sentry 가 설치만 돼 있고 init 이 없어
       * console 로 남긴다.
       */
      console.error(
        '[lexical] 표에 행이 아닌 자식이 있어 표 밖으로 옮겼습니다.',
      );
    });
  }, [editor]);

  return null;
}
