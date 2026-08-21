'use client';

import { X } from 'lucide-react';

const PanelCloseButton = ({ onClose }: { onClose: () => void }) => (
  <button
    type="button"
    aria-label="닫기"
    onClick={onClose}
    className="text-neutral-40 hover:text-neutral-0 shrink-0"
  >
    <X className="h-5 w-5" />
  </button>
);

export default PanelCloseButton;
