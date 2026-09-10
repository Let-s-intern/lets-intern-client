/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $createLinkNode } from '@lexical/link';
import { $createListItemNode, $createListNode } from '@lexical/list';
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
  SerializedEditorState,
} from 'lexical';
import { useCallback, useEffect } from 'react';
import { FlashMessageContext } from './context/FlashMessageContext';
import { SettingsContext, useSettings } from './context/SettingsContext';
import { SharedAutocompleteContext } from './context/SharedAutocompleteContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import Editor from './Editor';
import './index.css';
import nodes from './nodes';
import { TableContext } from './plugins/TablePlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import setupEnv from './setupEnv';
import {
  isTableIntegrityError,
  repairSerializedTables,
} from './tableIntegrity';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

export const emptyEditorState = JSON.stringify({
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});

if (setupEnv.disableBeforeInput) {
  // vite is really aggressive about tree-shaking, this
  // ensures that the side-effects of importing setupEnv happens
}

const showErrorOverlay = (err: Event) => {
  const ErrorOverlay = customElements.get('vite-error-overlay');
  if (!ErrorOverlay) {
    return;
  }
  const overlay = new ErrorOverlay(err);
  const body = document.body;
  if (body !== null) {
    body.appendChild(overlay);
  }
};

function $prepopulatedRichText() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode('h1');
    heading.append($createTextNode('Welcome to the playground'));
    root.append(heading);
    const quote = $createQuoteNode();
    quote.append(
      $createTextNode(
        `In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. ` +
          `You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.`,
      ),
    );
    root.append(quote);
    const paragraph = $createParagraphNode();
    paragraph.append(
      $createTextNode('The playground is a demo environment built with '),
      $createTextNode('@lexical/react').toggleFormat('code'),
      $createTextNode('.'),
      $createTextNode(' Try typing in '),
      $createTextNode('some text').toggleFormat('bold'),
      $createTextNode(' with '),
      $createTextNode('different').toggleFormat('italic'),
      $createTextNode(' formats.'),
    );
    root.append(paragraph);
    const paragraph2 = $createParagraphNode();
    paragraph2.append(
      $createTextNode(
        'Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!',
      ),
    );
    root.append(paragraph2);
    const paragraph3 = $createParagraphNode();
    paragraph3.append(
      $createTextNode(`If you'd like to find out more about Lexical, you can:`),
    );
    root.append(paragraph3);
    const list = $createListNode('bullet');
    list.append(
      $createListItemNode().append(
        $createTextNode(`Visit the `),
        $createLinkNode('https://lexical.dev/').append(
          $createTextNode('Lexical website'),
        ),
        $createTextNode(` for documentation and more information.`),
      ),
      $createListItemNode().append(
        $createTextNode(`Check out the code on our `),
        $createLinkNode('https://github.com/facebook/lexical').append(
          $createTextNode('GitHub repository'),
        ),
        $createTextNode(`.`),
      ),
      $createListItemNode().append(
        $createTextNode(`Playground code can be found `),
        $createLinkNode(
          'https://github.com/facebook/lexical/tree/main/packages/lexical-playground',
        ).append($createTextNode('here')),
        $createTextNode(`.`),
      ),
      $createListItemNode().append(
        $createTextNode(`Join our `),
        $createLinkNode('https://discord.com/invite/KmG4wQnnD9').append(
          $createTextNode('Discord Server'),
        ),
        $createTextNode(` and chat with the team.`),
      ),
    );
    root.append(list);
    const paragraph4 = $createParagraphNode();
    paragraph4.append(
      $createTextNode(
        `Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance :).`,
      ),
    );
    root.append(paragraph4);
  }
}

function App({
  initialEditorStateJsonString,
  onChange,
  onChangeSerializedEditorState,
}: {
  initialEditorStateJsonString: string;
  onChange: (jsonString: string) => void;
  onChangeSerializedEditorState?: (serialized: SerializedEditorState) => void;
}): JSX.Element {
  useEffect(() => {
    const handleError = (error: Event) => {
      showErrorOverlay(error);
    };

    const handleUnhandledRejection = ({ reason }: { reason: unknown }) => {
      showErrorOverlay(reason as Event);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection,
      );
    };
  }, []);

  const handleChange = useCallback(
    (editorState: EditorState) => {
      const json = editorState.toJSON();
      onChangeSerializedEditorState?.(json);
      onChange(JSON.stringify(json));
    },
    [onChange, onChangeSerializedEditorState],
  );

  const {
    settings: { measureTypingPerf },
    setOption,
  } = useSettings();

  // 유효한 Lexical JSON만 editorState에 전달, 아니면 빈 에디터
  // root.children 이 비어있으면 Lexical 이 "editor state is empty" 로 폭발하므로 함께 검증한다.
  const safeEditorState = (() => {
    if (!initialEditorStateJsonString) return emptyEditorState;
    try {
      const parsed = JSON.parse(initialEditorStateJsonString);
      if (!(parsed?.root?.children?.length > 0)) return emptyEditorState;

      /*
       * 표에 행이 아닌 자식이 있으면 여는 순간 에디터가 죽는다(LC-3292).
       * 편집 중 트랜스폼(TableIntegrityPlugin)만으로는 늦다 — 문제가 되는 표는
       * 이미 저장된 글 안에 있어서, 초기 상태를 넣는 시점에 이미 안전해야 한다.
       * 이유와 규칙은 `tableIntegrity.ts` 주석에 있다.
       */
      if (repairSerializedTables(parsed.root)) {
        console.error(
          '[lexical] 불러온 콘텐츠의 표에 행이 아닌 자식이 있어 표 밖으로 옮겼습니다.',
        );
        return JSON.stringify(parsed);
      }

      return initialEditorStateJsonString;
    } catch {
      // JSON이 아닌 평문
    }
    return emptyEditorState;
  })();

  const initialConfig: InitialConfigType = {
    editorState: safeEditorState,
    namespace: 'LetsCareerBlog',
    nodes: [...nodes],
    onError: (error: Error) => {
      /*
       * 표 무결성 에러만 좁게 삼킨다(LC-3292).
       *
       * TableIntegrityPlugin 이 표를 고쳐도, 같은 업데이트 안에서 TablePlugin 트랜스폼이
       * 먼저 도는 경우가 남는다. 그때 던지는 것을 그대로 밖으로 흘려보내면 앱이 죽고,
       * 다음 타이핑에서 또 죽는다. 고칠 수 있는 상태이므로 기록만 남기고 진행한다.
       *
       * 전부 삼키면 다른 버그가 숨는다. 아는 것만 잡고 나머지는 지금처럼 던진다.
       */
      if (isTableIntegrityError(error)) {
        console.error('[lexical] 표 구조 오류를 복구했습니다.', error);
        return;
      }
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  const debug =
    new URLSearchParams(window.location.search).get('debug') === 'true';

  useEffect(() => {
    if (debug) {
      setOption('showTreeView', true);
    }
  }, [debug, setOption]);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <TableContext>
          <SharedAutocompleteContext>
            <div className="editor-shell">
              <Editor />
            </div>
            {/* <Settings /> */}
            {/* {isDevPlayground ? <DocsPlugin /> : null} */}
            {/* {isDevPlayground ? <PasteLogPlugin /> : null} */}
            {/* {isDevPlayground ? <TestRecorderPlugin /> : null} */}
            {measureTypingPerf ? <TypingPerfPlugin /> : null}
            <OnChangePlugin onChange={handleChange} />
          </SharedAutocompleteContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}

export default function EditorApp({
  initialEditorStateJsonString = emptyEditorState,
  onChange = () => {},
  onChangeSerializedEditorState,
}: {
  initialEditorStateJsonString?: string;
  onChange?: (jsonString: string) => void;
  onChangeSerializedEditorState?: (serialized: SerializedEditorState) => void;
}): JSX.Element {
  return (
    <SettingsContext>
      <FlashMessageContext>
        <App
          initialEditorStateJsonString={initialEditorStateJsonString}
          onChangeSerializedEditorState={onChangeSerializedEditorState}
          onChange={onChange}
        />
      </FlashMessageContext>
    </SettingsContext>
  );
}
