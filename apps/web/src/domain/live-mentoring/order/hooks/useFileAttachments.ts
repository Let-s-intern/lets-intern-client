import { useRef, useState } from 'react';

import { uploadFileForId } from '@/api/file';
import { MAX_ATTACHMENT_FILES, type AttachedFile } from '../types';

interface Options {
  files: AttachedFile[];
  onChange: (next: AttachedFile[]) => void;
}

/**
 * 첨부 파일 여러 개를 올리고 지운다. 신청 폼과 결제 후 수정 모달이 같이 쓴다.
 *
 * 한 번에 고른 파일이 남은 자리보다 많으면 앞에서부터 남은 만큼만 올리고 안내를 남긴다.
 * 올린 뒤의 목록은 `await` 이전의 `files`·`onChange` 가 아니라 최신 값에 이어 붙인다 —
 * 올리는 동안 사용자가 질문을 고치거나 파일을 지웠을 수 있다.
 */
export const useFileAttachments = ({ files, onChange }: Options) => {
  const latestFiles = useRef(files);
  latestFiles.current = files;
  const latestOnChange = useRef(onChange);
  latestOnChange.current = onChange;

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const upload = async (selected: File[]) => {
    if (selected.length === 0) return;

    const room = MAX_ATTACHMENT_FILES - latestFiles.current.length;
    const accepted = selected.slice(0, Math.max(room, 0));
    const overLimit = accepted.length < selected.length;
    setMessage(
      overLimit
        ? `첨부 파일은 최대 ${MAX_ATTACHMENT_FILES}개까지 올릴 수 있어요.`
        : null,
    );
    if (accepted.length === 0) return;

    setIsUploading(true);
    try {
      // `LIVE_MENTORING` 은 Push 2 의 2.1 에서 zod enum 에 넣었다. 없으면 여기서 터진다.
      const results = await Promise.allSettled(
        accepted.map((file) =>
          uploadFileForId({ file, type: 'LIVE_MENTORING' }),
        ),
      );
      const uploaded = results.flatMap((result, index) =>
        result.status === 'fulfilled'
          ? [{ fileId: result.value, fileName: accepted[index].name }]
          : [],
      );
      if (uploaded.length < accepted.length) {
        setMessage('파일 업로드에 실패했습니다. 다시 시도해 주세요.');
      }
      if (uploaded.length > 0) {
        latestOnChange.current([...latestFiles.current, ...uploaded]);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const remove = (fileId: number) => {
    setMessage(null);
    latestOnChange.current(
      latestFiles.current.filter((file) => file.fileId !== fileId),
    );
  };

  const clearMessage = () => setMessage(null);

  return { isUploading, message, upload, remove, clearMessage };
};
