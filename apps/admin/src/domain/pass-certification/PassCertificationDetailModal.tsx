import { usePatchPassCertificationStatusMutation } from '@/api/pass-certification/passCertification';
import type { AdminPassCertificationItem } from '@/api/pass-certification/passCertificationSchema';
import CheckboxActive from '@/assets/icons/checkbox-active.svg?react';
import CheckboxInActive from '@/assets/icons/checkbox-inactive.svg?react';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  convertTypeToBank,
  getProgramTypeLabel,
  PASS_TYPE_LABEL,
} from '@letscareer/utils';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';

import PassStatusBadge from './PassStatusBadge';

const passTypeLabel = (item: AdminPassCertificationItem) => {
  const label =
    PASS_TYPE_LABEL[item.passType as keyof typeof PASS_TYPE_LABEL] ??
    item.passType;
  return item.passType === 'ETC' && item.passTypeEtc
    ? `${label} (${item.passTypeEtc})`
    : label;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xsmall14 text-neutral-40">{label}</span>
      <span className="text-xsmall16 text-neutral-0">{children}</span>
    </div>
  );
}

interface Props {
  item: AdminPassCertificationItem | null;
  onClose: () => void;
}

/** 합격 인증 상세 + 승인/반려 모달 */
export default function PassCertificationDetailModal({ item, onClose }: Props) {
  const { snackbar } = useAdminSnackbar();
  const patchStatus = usePatchPassCertificationStatusMutation();

  const handleStatus = async (status: 'APPROVED' | 'REJECTED') => {
    if (!item) return;
    const actionText = status === 'APPROVED' ? '승인' : '반려';
    if (
      !window.confirm(
        `${item.name} 님의 합격 인증을 ${actionText}하시겠습니까?`,
      )
    )
      return;
    try {
      await patchStatus.mutateAsync({ id: item.passCertificationId, status });
      snackbar(`${actionText} 처리되었습니다.`);
      onClose();
    } catch (err) {
      snackbar(`문제가 발생했습니다: ${err}`);
    }
  };

  return (
    <Dialog
      open={!!item}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { maxHeight: '80vh' } }}
    >
      {item && (
        <>
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span className="flex items-center gap-2 text-lg font-bold">
              합격 인증 상세
              <PassStatusBadge status={item.status} />
            </span>
            <IconButton onClick={onClose} aria-label="닫기" size="small">
              <IoCloseOutline className="text-neutral-40 h-6 w-6" />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <div className="flex flex-col gap-6">
              <section className="grid grid-cols-2 gap-4">
                <Field label="이름">{item.name}</Field>
                <Field label="연락처">{item.phoneNum}</Field>
                <Field label="이메일">{item.email}</Field>
                <Field label="회원 여부 / 정보">
                  {item.matchedUserId != null ? (
                    <span className="flex items-center gap-1">
                      <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        label="회원"
                      />
                      <span>
                        / {item.matchedUserName} (#{item.matchedUserId})
                      </span>
                    </span>
                  ) : (
                    <Chip size="small" variant="outlined" label="비회원" />
                  )}
                </Field>
              </section>

              <hr className="border-neutral-90" />

              <section className="grid grid-cols-2 gap-4">
                <Field label="합격 회사">{item.companyName}</Field>
                <Field label="직무">{item.jobName}</Field>
                <div className="col-span-2">
                  <Field label="합격 형태">{passTypeLabel(item)}</Field>
                </div>
              </section>

              <hr className="border-neutral-90" />

              <section className="flex flex-col gap-4">
                <Field label="참여 프로그램">
                  <span className="flex flex-wrap gap-1.5">
                    {item.programTypeList.map((t) => (
                      <span
                        key={t}
                        className="bg-neutral-95 border-neutral-75 text-neutral-30 text-xsmall14 rounded-full border px-3 py-1"
                      >
                        {t === 'ETC' && item.programTypeEtc
                          ? `기타(${item.programTypeEtc})`
                          : getProgramTypeLabel(t)}
                      </span>
                    ))}
                  </span>
                </Field>
                <Field label="프로그램 후기">
                  {item.programFeedback ? (
                    <span className="bg-neutral-95 border-neutral-90 block whitespace-pre-wrap rounded-md border p-3 leading-relaxed">
                      {item.programFeedback}
                    </span>
                  ) : (
                    <span className="text-neutral-30 text-xsmall14">
                      작성된 후기가 없습니다.
                    </span>
                  )}
                </Field>
              </section>

              <hr className="border-neutral-90" />

              <section className="flex flex-col gap-2">
                <span className="text-xsmall14 text-neutral-40">증빙 자료</span>
                <a
                  href={item.certificationImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border-neutral-90 bg-neutral-95 block overflow-hidden rounded-md border"
                >
                  <img
                    src={item.certificationImageUrl}
                    alt="합격 증빙"
                    className="max-h-[260px] w-full object-contain"
                  />
                </a>
              </section>

              <hr className="border-neutral-90" />

              <section className="grid grid-cols-2 gap-4">
                <Field label="은행">
                  {convertTypeToBank(item.bankName) ?? item.bankName}
                </Field>
                <Field label="계좌번호">{item.accountNumber}</Field>
              </section>

              <section className="flex flex-col gap-1">
                <span className="text-xsmall14 text-neutral-40">동의 여부</span>
                <div className="flex gap-5">
                  {[
                    {
                      agreed: item.privacyAgree,
                      label: '개인정보 수집·이용 동의',
                    },
                    {
                      agreed: item.virtuousCycleAgree,
                      label: '선순환 활용 동의',
                    },
                  ].map((a) => (
                    <div key={a.label} className="flex items-center gap-0.5">
                      {a.agreed ? (
                        <CheckboxActive className="h-5 w-5" />
                      ) : (
                        <CheckboxInActive className="h-5 w-5" />
                      )}
                      <span
                        className={`text-xsmall14 ${a.agreed ? 'text-primary' : 'text-neutral-40'}`}
                      >
                        {a.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button
              size="large"
              color="error"
              variant="contained"
              disabled={patchStatus.isPending}
              onClick={() => handleStatus('REJECTED')}
              sx={{ px: 4 }}
            >
              반려
            </Button>
            <Button
              size="large"
              variant="contained"
              disabled={patchStatus.isPending}
              onClick={() => handleStatus('APPROVED')}
              sx={{ px: 4 }}
            >
              승인
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
