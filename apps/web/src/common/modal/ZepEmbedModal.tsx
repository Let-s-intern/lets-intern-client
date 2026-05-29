'use client';

import { ZepEmbed } from '@letscareer/ui/ZepEmbed';

import BaseModal from '@/common/modal/BaseModal';

const ZEP_SPACE_URL = process.env.NEXT_PUBLIC_ZEP_SPACE_URL;
const ZEP_ENTRY_CODE = process.env.NEXT_PUBLIC_ZEP_ENTRY_CODE;
const ZEP_SPACE_NAME = process.env.NEXT_PUBLIC_ZEP_SPACE_NAME;

interface ZepEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ZepEmbedModal = ({ isOpen, onClose }: ZepEmbedModalProps) => (
  <BaseModal
    isOpen={isOpen}
    onClose={onClose}
    className="mx-2 h-[92vh] w-[1280px] max-w-full overflow-hidden rounded-2xl md:mx-4 md:h-[90vh] md:rounded-3xl"
  >
    {ZEP_SPACE_URL ? (
      <ZepEmbed
        zepUrl={ZEP_SPACE_URL}
        entryCode={ZEP_ENTRY_CODE}
        spaceName={ZEP_SPACE_NAME}
        onClose={onClose}
      />
    ) : (
      <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-500">
        ZEP 스페이스 설정이 누락되었습니다.
        <br />
        <code className="mt-2 inline-block rounded bg-neutral-100 px-2 py-1 font-mono text-xs">
          NEXT_PUBLIC_ZEP_SPACE_URL
        </code>{' '}
        환경변수를 설정해주세요.
      </div>
    )}
  </BaseModal>
);

export default ZepEmbedModal;
