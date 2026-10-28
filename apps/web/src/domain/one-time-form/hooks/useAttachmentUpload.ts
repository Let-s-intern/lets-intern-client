import {
  fetchOneTimeFormUploadUrl,
  getOneTimeFormErrorCode,
} from '@/api/one-time-form/oneTimeForm';
import type { OneTimeFormAttachmentAnswer } from '@/api/one-time-form/oneTimeFormSchema';
import { useEffect, useRef, useState } from 'react';
import { putAttachmentFile } from '../api/putAttachmentFile';
import {
  isRetryableUploadError,
  precheckAttachmentFile,
  uploadErrorMessage,
  type AttachmentKind,
} from '../utils/attachmentUpload';

export type AttachmentUploadState =
  | { status: 'idle' }
  | { status: 'uploading'; file: File; progress: number }
  | { status: 'done'; file: File; value: OneTimeFormAttachmentAnswer }
  /** retryFile 이 있으면 같은 파일로 다시 시도할 수 있다 */
  | { status: 'error'; message: string; retryFile: File | null };

interface UseAttachmentUploadParams {
  slug: string;
  questionId: number;
  kind: AttachmentKind;
  onUploaded: (value: OneTimeFormAttachmentAnswer) => void;
}

/**
 * 첨부 하나 올리기(계약 8절 U4).
 * 사전 검사 → 업로드 URL 발급 → 서명 URL 로 PUT(진행률) → `{ key, name: 원본 파일명 }`.
 * 새 파일을 고르거나 reset 하면 진행 중이던 업로드는 버린다.
 */
export const useAttachmentUpload = ({
  slug,
  questionId,
  kind,
  onUploaded,
}: UseAttachmentUploadParams) => {
  const [state, setState] = useState<AttachmentUploadState>({
    status: 'idle',
  });
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const upload = async (file: File) => {
    controllerRef.current?.abort();

    const precheckError = precheckAttachmentFile(kind, file);
    if (precheckError) {
      setState({ status: 'error', message: precheckError, retryFile: null });
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ status: 'uploading', file, progress: 0 });

    try {
      const { uploadUrl, key } = await fetchOneTimeFormUploadUrl({
        slug,
        questionId,
        filename: file.name,
      });
      if (controller.signal.aborted) return;

      await putAttachmentFile({
        uploadUrl,
        file,
        signal: controller.signal,
        onProgress: (progress) =>
          setState((prev) =>
            prev.status === 'uploading' && prev.file === file
              ? { ...prev, progress }
              : prev,
          ),
      });
      if (controller.signal.aborted) return;

      const value = { key, name: file.name };
      setState({ status: 'done', file, value });
      onUploaded(value);
    } catch (error) {
      if (controller.signal.aborted) return;
      const code = getOneTimeFormErrorCode(error);
      setState({
        status: 'error',
        message: uploadErrorMessage(kind, code),
        retryFile: isRetryableUploadError(code) ? file : null,
      });
    }
  };

  const retry = () => {
    if (state.status === 'error' && state.retryFile) {
      void upload(state.retryFile);
    }
  };

  const reset = () => {
    controllerRef.current?.abort();
    setState({ status: 'idle' });
  };

  return { state, upload, retry, reset };
};
