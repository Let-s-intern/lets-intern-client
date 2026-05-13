/**
 * InsertNotionDialog - 운영자가 직접 노션 publish URL 을 입력해서 임베드를 삽입할 때 쓰는 다이얼로그.
 *
 * AutoEmbed 흐름은 자동 인식 보너스이고, 명시적 진입점은 본 다이얼로그다.
 * URL 입력 시 실시간 검증 + 사용자에게 잘못된 케이스(특히 `www.notion.so`)를 한국어로 안내한다.
 */

import { LexicalEditor } from 'lexical';
import { useState } from 'react';

import Button from '../../ui/Button';
import { DialogActions } from '../../ui/Dialog';
import TextInput from '../../ui/TextInput';
import { parseNotionUrl } from '../../utils/notion';
import { INSERT_NOTION_COMMAND } from './index';

type Props = {
  activeEditor: LexicalEditor;
  onClose: () => void;
};

const HELPER_DEFAULT =
  '노션 공개(Publish) 페이지 URL 만 사용할 수 있습니다. 예: https://your-workspace.notion.site/page-id';

const ERROR_GENERIC =
  '노션 공개(Publish) 페이지 URL 만 가능합니다. 예: https://your-workspace.notion.site/page-id';

const ERROR_NOTION_SO =
  '`www.notion.so` URL 은 노션 측에서 임베드를 차단합니다. 페이지를 "웹에 게시(Publish)" 한 뒤 발급되는 publish 링크(`<workspace>.notion.site/...`)를 사용하세요.';

function getValidationError(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (parseNotionUrl(trimmed) !== null) {
    return null;
  }

  // URL 자체는 파싱 가능하지만 화이트리스트 통과 못 한 경우 분기 메시지.
  try {
    const parsed = new URL(trimmed);
    if (parsed.host === 'www.notion.so' || parsed.host === 'notion.so') {
      return ERROR_NOTION_SO;
    }
  } catch {
    // URL 파싱 실패 → 일반 메시지로 폴백.
  }

  return ERROR_GENERIC;
}

export default function InsertNotionDialog({
  activeEditor,
  onClose,
}: Props): JSX.Element {
  const [url, setUrl] = useState('');

  const error = getValidationError(url);
  const trimmed = url.trim();
  const canSubmit =
    error === null && trimmed.length > 0 && parseNotionUrl(trimmed) !== null;

  const handleSubmit = () => {
    const parsed = parseNotionUrl(trimmed);
    if (parsed === null) {
      return;
    }
    activeEditor.dispatchCommand(INSERT_NOTION_COMMAND, parsed);
    onClose();
  };

  return (
    <>
      <TextInput
        label="Notion publish URL"
        placeholder="https://your-workspace.notion.site/page-id"
        onChange={setUrl}
        value={url}
        data-test-id="notion-modal-url-input"
      />
      <div
        style={{
          color: error ? '#d00' : '#666',
          fontSize: '12px',
          marginTop: '4px',
          marginBottom: '8px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {error ?? HELPER_DEFAULT}
      </div>
      <DialogActions>
        <Button
          data-test-id="notion-modal-confirm-btn"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          삽입
        </Button>
      </DialogActions>
    </>
  );
}
