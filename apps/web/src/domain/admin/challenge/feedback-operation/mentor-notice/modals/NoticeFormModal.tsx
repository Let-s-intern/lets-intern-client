'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import type { SelectChangeEvent as MuiSelectChangeEvent } from '@mui/material';
import EditorApp from '@/common/lexical/EditorApp';
import type {
  ChallengeScopeType,
  MentorScopeType,
  DateType,
} from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';
import { ContentSizeIndicator } from '../ui/ContentSizeIndicator';
import { toLexicalJson } from '../utils/lexical';
import { INITIAL_FORM, type NoticeForm, type ContentType } from '../types';

interface NoticeFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialForm?: NoticeForm;
  challengeList: Array<{ id: number; title?: string | null }>;
  mentorList: Array<{ challengeMentorId: number; name: string }>;
  onClose: () => void;
  onSubmit: (form: NoticeForm) => Promise<void>;
  onChallengeIdChange: (challengeId: string) => void;
}

export function NoticeFormModal({
  open,
  mode,
  initialForm,
  challengeList,
  mentorList,
  onClose,
  onSubmit,
  onChallengeIdChange,
}: NoticeFormModalProps) {
  const [form, setForm] = useState<NoticeForm>(initialForm ?? INITIAL_FORM);

  useEffect(() => {
    if (open) {
      setForm(initialForm ?? INITIAL_FORM);
    }
  }, [open, initialForm]);

  const isCreateMode = mode === 'create';
  const isFormEmpty = !form.title;

  const handleSubmit = async () => {
    await onSubmit(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .dropdown': { zIndex: 1500, position: 'fixed' },
        '& .color-picker-wrapper': { zIndex: 1500, position: 'fixed' },
      }}
    >
      <DialogTitle>{isCreateMode ? '공지 작성' : '공지 수정'}</DialogTitle>
      <DialogContent>
        <div className="mt-4 flex flex-col gap-4">
          {/* 제목 */}
          <div>
            <label className="mb-1 block text-sm font-medium">제목</label>
            <input
              type="text"
              className="border-neutral-80 w-full rounded border px-3 py-2 text-sm"
              placeholder="공지 제목"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          {/* 공지 전달 범위 */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              공지 전달 범위
            </label>
            <Select
              size="small"
              fullWidth
              value={form.challengeScopeType}
              onChange={(e: SelectChangeEvent) =>
                setForm((prev) => ({
                  ...prev,
                  challengeScopeType: e.target.value as ChallengeScopeType,
                  challengeId: '',
                  challengeMentorId: '',
                }))
              }
            >
              <MenuItem value="ALL">전체 챌린지</MenuItem>
              <MenuItem value="SPECIFIC">특정 챌린지</MenuItem>
            </Select>
          </div>

          {/* 챌린지 선택 (범위=SPECIFIC) */}
          {form.challengeScopeType === 'SPECIFIC' && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                챌린지 선택
              </label>
              <Select
                size="small"
                fullWidth
                value={form.challengeId}
                onChange={(e: MuiSelectChangeEvent) => {
                  setForm((prev) => ({
                    ...prev,
                    challengeId: e.target.value,
                    challengeMentorId: '',
                  }));
                  onChallengeIdChange(e.target.value);
                }}
                displayEmpty
              >
                <MenuItem value="">챌린지를 선택하세요</MenuItem>
                {challengeList.map((p) => (
                  <MenuItem key={p.id} value={String(p.id)}>
                    {p.title}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}

          {/* 전달 대상 */}
          <div>
            <label className="mb-1 block text-sm font-medium">전달 대상</label>
            <Select
              size="small"
              fullWidth
              value={form.mentorScopeType}
              onChange={(e: SelectChangeEvent) =>
                setForm((prev) => ({
                  ...prev,
                  mentorScopeType: e.target.value as MentorScopeType,
                  challengeMentorId: '',
                }))
              }
            >
              <MenuItem value="ALL_MENTOR">모든 멘토</MenuItem>
              <MenuItem value="SPECIFIC_MENTOR">특정 멘토</MenuItem>
            </Select>
          </div>

          {/* 멘토 선택 (대상=SPECIFIC_MENTOR) */}
          {form.mentorScopeType === 'SPECIFIC_MENTOR' && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                멘토 선택
              </label>
              <Select
                size="small"
                fullWidth
                value={form.challengeMentorId}
                onChange={(e: SelectChangeEvent) =>
                  setForm((prev) => ({
                    ...prev,
                    challengeMentorId: e.target.value,
                  }))
                }
                displayEmpty
                disabled={
                  form.challengeScopeType === 'SPECIFIC' && !form.challengeId
                }
              >
                <MenuItem value="">멘토를 선택하세요</MenuItem>
                {mentorList.map((m) => (
                  <MenuItem
                    key={m.challengeMentorId}
                    value={String(m.challengeMentorId)}
                  >
                    {m.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}

          {/* 내용 유형 */}
          <div>
            <label className="mb-1 block text-sm font-medium">내용 유형</label>
            <Select
              size="small"
              fullWidth
              value={form.contentType}
              onChange={(e: SelectChangeEvent) =>
                setForm((prev) => ({
                  ...prev,
                  contentType: e.target.value as ContentType,
                }))
              }
            >
              <MenuItem value="URL">URL 링크</MenuItem>
              <MenuItem value="EDITOR">에디터 (리치 텍스트)</MenuItem>
              <MenuItem value="MARKDOWN">마크다운 (텍스트)</MenuItem>
            </Select>
          </div>

          {/* 노출 기간 */}
          <div>
            <label className="mb-1 block text-sm font-medium">노출 기간</label>
            <Select
              size="small"
              fullWidth
              value={form.dateType}
              onChange={(e: SelectChangeEvent) =>
                setForm((prev) => ({
                  ...prev,
                  dateType: e.target.value as DateType,
                  startDate: '',
                  endDate: '',
                }))
              }
            >
              <MenuItem value="INFINITE">무기한</MenuItem>
              <MenuItem value="CHALLENGE">챌린지 기간</MenuItem>
              <MenuItem value="CUSTOM">기간 지정</MenuItem>
            </Select>
          </div>

          {/* 기간 지정 (CUSTOM) */}
          {form.dateType === 'CUSTOM' && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium">시작일</label>
                <input
                  type="datetime-local"
                  className="border-neutral-80 w-full rounded border px-3 py-2 text-sm"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium">종료일</label>
                <input
                  type="datetime-local"
                  className="border-neutral-80 w-full rounded border px-3 py-2 text-sm"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
          )}

          {/* 중요 고정 */}
          <FormControlLabel
            control={
              <Checkbox
                checked={form.isFixed}
                onChange={(_, checked) =>
                  setForm((prev) => ({ ...prev, isFixed: checked }))
                }
              />
            }
            label="중요 공지로 고정"
          />

          {/* URL 입력 */}
          {form.contentType === 'URL' && (
            <div>
              <label className="mb-1 block text-sm font-medium">링크</label>
              <input
                type="text"
                className="border-neutral-80 w-full rounded border px-3 py-2 text-sm"
                placeholder="https://"
                value={form.link}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, link: e.target.value }))
                }
              />
            </div>
          )}

          {/* 리치 텍스트 입력 (Lexical 에디터) */}
          {form.contentType === 'EDITOR' && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                내용 (에디터)
              </label>
              <EditorApp
                initialEditorStateJsonString={
                  toLexicalJson(form.contents) || undefined
                }
                onChange={(jsonString) =>
                  setForm((prev) => ({ ...prev, contents: jsonString }))
                }
              />
            </div>
          )}

          {/* 마크다운 텍스트 입력 */}
          {form.contentType === 'MARKDOWN' && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                내용 (마크다운)
              </label>
              <textarea
                className="border-neutral-80 w-full rounded border px-3 py-2 font-mono text-sm"
                rows={10}
                placeholder="마크다운 형식으로 입력하세요"
                value={form.contents}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contents: e.target.value }))
                }
              />
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions
        sx={{
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 1,
          px: 3,
          pb: 2,
        }}
      >
        {form.contentType !== 'URL' && (
          <ContentSizeIndicator content={form.contents} />
        )}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} color="inherit">
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isFormEmpty}
          >
            {isCreateMode ? '등록' : '수정'}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
