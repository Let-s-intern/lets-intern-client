import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

interface ContextPluginProps {
  editorStateJsonString: string;
}

const ContextPlugin = ({ editorStateJsonString }: ContextPluginProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(function initLexical() {
    if (editorStateJsonString === '') return;

    const editorState = editor.parseEditorState(editorStateJsonString);
    editor.setEditorState(editorState);
  }, []);

  return null;
};

export default ContextPlugin;
