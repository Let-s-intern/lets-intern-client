/**
 * NotionPlugin - Notion 임베드 노드 삽입 커맨드를 등록한다.
 *
 * payload(URL) 는 화이트리스트 검증을 통과해야만 노드가 삽입된다.
 * 검증 실패 시 커맨드는 false 를 반환해 무시한다.
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';

import { $createNotionNode, NotionNode } from '../../nodes/NotionNode';
import { isAllowedNotionUrl } from '../../utils/notion';

export const INSERT_NOTION_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_NOTION_COMMAND',
);

export { default as InsertNotionDialog } from './InsertNotionDialog';

export default function NotionPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([NotionNode])) {
      throw new Error('NotionPlugin: NotionNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_NOTION_COMMAND,
      (payload) => {
        if (!isAllowedNotionUrl(payload)) {
          return false;
        }
        const notionNode = $createNotionNode(payload);
        $insertNodeToNearestRoot(notionNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
