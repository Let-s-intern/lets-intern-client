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

  const initialConfig: InitialConfigType = {
    editorState: initialEditorStateJsonString,
    namespace: 'LetsCareerBlog',
    nodes: [...nodes],
    onError: (error: Error) => {
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
