'use client';

import { CreateLeadHistoryRequest } from '@/api/lead';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import type { SelectOption } from '../types';

interface CreateLeadHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLeadHistoryRequest) => Promise<void>;
  isSubmitting: boolean;
  magnetOptions: SelectOption[];
}

const INITIAL_FORM: Record<
  keyof CreateLeadHistoryRequest | 'userId',
  string
> = {
  magnetId: '',
  userId: '',
  name: '',
  phoneNum: '',
  email: '',
  inflow: '',
  university: '',
  major: '',
  wishField: '',
  wishCompany: '',
  wishIndustry: '',
  wishJob: '',
  jobStatus: '',
  instagramId: '',
};

const CreateLeadHistoryDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  magnetOptions,
}: CreateLeadHistoryDialogProps) => {
  const [form, setForm] = useState({ ...INITIAL_FORM });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setForm({ ...INITIAL_FORM });
    onClose();
  };

  const handleSubmit = async () => {
    const payload: CreateLeadHistoryRequest = {
      magnetId: Number(form.magnetId),
      name: form.name || undefined,
      phoneNum: form.phoneNum || undefined,
      email: form.email || undefined,
      inflow: form.inflow || undefined,
      university: form.university || undefined,
      major: form.major || undefined,
      wishField: form.wishField || undefined,
      wishCompany: form.wishCompany || undefined,
      wishIndustry: form.wishIndustry || undefined,
      wishJob: form.wishJob || undefined,
      jobStatus: form.jobStatus || undefined,
      instagramId: form.instagramId || undefined,
    };
    payload.userId = form.userId ? Number(form.userId) : undefined;

    await onSubmit(payload);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>리드 등록</DialogTitle>
      <DialogContent className="flex flex-col gap-4 py-4">
        <TextField
          select
          required
          label="마그넷"
          name="magnetId"
          value={form.magnetId}
          onChange={handleChange}
          helperText="리드가 소속될 마그넷을 선택하세요."
        >
          {magnetOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="회원 ID"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            placeholder="기존 회원이라면 숫자 ID를 입력하세요."
          />
          <TextField
            label="이름"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            label="전화번호"
            name="phoneNum"
            value={form.phoneNum}
            onChange={handleChange}
          />
          <TextField
            label="이메일"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="유입 경로"
            name="inflow"
            value={form.inflow}
            onChange={handleChange}
          />
          <TextField
            label="대학"
            name="university"
            value={form.university}
            onChange={handleChange}
          />
          <TextField
            label="전공"
            name="major"
            value={form.major}
            onChange={handleChange}
          />
          <TextField
            label="희망 직무"
            name="wishJob"
            value={form.wishJob}
            onChange={handleChange}
          />
          <TextField
            label="희망 회사"
            name="wishCompany"
            value={form.wishCompany}
            onChange={handleChange}
          />
          <TextField
            label="희망 산업군"
            name="wishIndustry"
            value={form.wishIndustry}
            onChange={handleChange}
          />
          <TextField
            label="희망 분야"
            name="wishField"
            value={form.wishField}
            onChange={handleChange}
          />
          <TextField
            label="현 직무 상태"
            name="jobStatus"
            value={form.jobStatus}
            onChange={handleChange}
          />
          <TextField
            label="인스타그램 ID"
            name="instagramId"
            value={form.instagramId}
            onChange={handleChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLeadHistoryDialog;
