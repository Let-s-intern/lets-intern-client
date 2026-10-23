import { useSeminarVods } from '@/api/all-in-one-pass/useSeminarVods';
import { PassLandingVod } from '@/domain/all-in-one-pass/types';
import { DEFAULT_VOD_IDS } from '@/domain/all-in-one-pass/util/useVodDefaults';
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const REQUIRED_COUNT = 3;

interface Props {
  open: boolean;
  initialVods: PassLandingVod[];
  /** 선택 3개 + 전체 VOD 수(목록 길이, 랜딩 "VOD N종" 표기용) */
  onSave: (vods: PassLandingVod[], totalCount: number) => void;
  onClose: () => void;
}

export default function VodExposureModal({
  open,
  initialVods,
  onSave,
  onClose,
}: Props) {
  const { data, isLoading } = useSeminarVods();
  const vods = data ?? [];
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 열릴 때 저장된 VOD(title 매칭)로 프리필
  useEffect(() => {
    if (!open) return;
    const savedTitles = new Set(initialVods.map((v) => v.title));
    setSelectedIds(
      vods.filter((v) => savedTitles.has(v.title)).map((v) => v.id),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data]);

  const toggle = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= REQUIRED_COUNT
          ? prev // 3개 초과 선택 금지
          : [...prev, id],
    );

  const handleSave = () => {
    // 3개를 다 고르면 그대로, 아니면(0·1·2) 기본 VOD(25·27·34)로 대체한다.
    const ids =
      selectedIds.length === REQUIRED_COUNT ? selectedIds : DEFAULT_VOD_IDS;
    const picked = ids.flatMap((id) => {
      const v = vods.find((x) => x.id === id);
      return v ? [v] : [];
    });
    onSave(
      picked.map((v) => ({
        title: v.title,
        thumbnail: v.thumbnailUrl,
        description: v.description,
      })),
      vods.length, // 전체 VOD 수
    );
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        노출 VOD 선택
        <span className="text-xsmall14 text-neutral-40 ml-2 font-normal">
          {selectedIds.length}/{REQUIRED_COUNT} 선택 · {REQUIRED_COUNT}개 필수
          (선택하지 않으면 자동 선택되어 노출됩니다.)
        </span>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <CircularProgress size={28} />
          </div>
        ) : vods.length === 0 ? (
          <p className="text-neutral-40 py-16 text-center">
            불러온 VOD가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {vods.map((vod) => {
              const checked = selectedIds.includes(vod.id);
              const disabled = !checked && selectedIds.length >= REQUIRED_COUNT;
              return (
                <button
                  key={vod.id}
                  type="button"
                  onClick={() => toggle(vod.id)}
                  disabled={disabled}
                  className={clsx(
                    'flex items-center gap-2 rounded-md border p-2 text-left transition',
                    checked
                      ? 'border-primary bg-primary-5'
                      : 'border-neutral-80 hover:border-neutral-60',
                    disabled && 'cursor-not-allowed opacity-40',
                  )}
                >
                  <Checkbox
                    checked={checked}
                    disabled={disabled}
                    size="small"
                    sx={{ p: 0 }}
                  />
                  <img
                    src={vod.thumbnailUrl}
                    alt=""
                    className="h-14 w-24 shrink-0 rounded object-cover"
                  />
                  <span className="text-xsmall14 text-neutral-0 line-clamp-2 flex-1 font-medium">
                    {vod.title}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button onClick={handleSave} variant="contained">
          선택 완료
        </Button>
      </DialogActions>
    </Dialog>
  );
}
