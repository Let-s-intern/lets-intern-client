import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect, useState } from 'react';

import { uploadFile } from '@/api/file';
import { $createPDFNode, PDFNode } from '../../nodes/PDFNode';
import Button from '../../ui/Button';
import { DialogActions } from '../../ui/Dialog';
import FileInput from '../../ui/FileInput';

export type InsertPDFPayload = {
  url: string;
  fileName: string;
};

export const INSERT_PDF_COMMAND: LexicalCommand<InsertPDFPayload> =
  createCommand('INSERT_PDF_COMMAND');

export function InsertPDFDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: ReturnType<typeof useLexicalComposerContext>[0];
  onClose: () => void;
}): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const onClick = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile({ file, type: 'BLOG' });
      activeEditor.dispatchCommand(INSERT_PDF_COMMAND, {
        url,
        fileName: file.name,
      });
      onClose();
    } catch {
      setIsUploading(false);
    }
  };

  return (
    <>
      <FileInput
        label="PDF 파일"
        onChange={onFileChange}
        accept="application/pdf,.pdf"
        data-test-id="pdf-upload-input"
      />
      <DialogActions>
        <Button
          disabled={!file || isUploading}
          onClick={onClick}
          data-test-id="pdf-upload-confirm-btn"
        >
          {isUploading ? '업로드 중...' : '삽입'}
        </Button>
      </DialogActions>
    </>
  );
}

export default function PDFPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([PDFNode])) {
      throw new Error('PDFPlugin: PDFNode not registered on editor');
    }

    return editor.registerCommand<InsertPDFPayload>(
      INSERT_PDF_COMMAND,
      (payload) => {
        const pdfNode = $createPDFNode(payload.url, payload.fileName);
        $insertNodeToNearestRoot(pdfNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
