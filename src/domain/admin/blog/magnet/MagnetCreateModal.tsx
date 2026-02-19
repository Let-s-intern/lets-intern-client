'use client';

import BaseModal from '@/common/modal/BaseModal';
import ActionButton from '@/domain/admin/ui/button/ActionButton';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { CreateMagnetReqBody, MAGNET_TYPE, MagnetTypeKey } from './types';

interface MagnetCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (body: CreateMagnetReqBody) => void;
}

const MagnetCreateModal = ({
  isOpen,
  onClose,
  onSubmit,
}: MagnetCreateModalProps) => {
  const [type, setType] = useState<MagnetTypeKey | ''>('');
  const [title, setTitle] = useState('');

  const isValid = type !== '' && title.trim() !== '';

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({ type: type as MagnetTypeKey, title: title.trim() });
    resetAndClose();
  };

  const resetAndClose = () => {
    setType('');
    setTitle('');
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={resetAndClose}
      className="max-w-md p-6"
    >
      <h2 className="mb-6 text-lg font-bold">마그넷 등록</h2>

      <div className="mb-4">
        <FormControl fullWidth size="small">
          <InputLabel>타입 선택 *</InputLabel>
          <Select
            value={type}
            label="타입 선택 *"
            onChange={(e) => setType(e.target.value as MagnetTypeKey)}
          >
            {Object.entries(MAGNET_TYPE).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="mb-6">
        <TextField
          fullWidth
          size="small"
          label="제목 *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        />
      </div>

      <div className="flex justify-end gap-2">
        <ActionButton
          type="button"
          bgColor="gray"
          width="4rem"
          onClick={resetAndClose}
        >
          취소
        </ActionButton>
        <ActionButton
          type="button"
          bgColor="blue"
          width="4rem"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          등록
        </ActionButton>
      </div>
    </BaseModal>
  );
};

export default MagnetCreateModal;
