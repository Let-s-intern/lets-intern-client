'use client';

import React, { useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormState = {
  org: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  msg: string;
  agree: boolean;
};

const initial: FormState = {
  org: '',
  name: '',
  email: '',
  phone: '',
  interest: '',
  msg: '',
  agree: false,
};

export default function LeadModal({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.body.classList.add('non-scroll');
    } else {
      document.body.classList.remove('non-scroll');
      setForm(initial);
      setResult(null);
      setLoading(false);
    }
  }, [open]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) {
      setResult('개인정보 수집·이용에 동의가 필요합니다.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/b2b-introduce/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      setResult('제출 완료! 콘솔/응답에서 확인 가능합니다.');
      // eslint-disable-next-line no-console
      console.log('B2B lead submit response:', json);
    } catch (err) {
      setResult('전송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="rounded-2xl w-full max-w-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-1.375-semibold">맞춤 견적 및 상담 요청</h3>
          <button
            aria-label="Close"
            className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-0.875-medium">
              기관명
              <input
                required
                value={form.org}
                onChange={(e) => setForm({ ...form, org: e.target.value })}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#6E7AFF] focus:outline-none"
                placeholder="예) 렛츠대학교 산학협력단"
              />
            </label>
            <label className="text-0.875-medium">
              담당자명
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#6E7AFF] focus:outline-none"
                placeholder="홍길동"
              />
            </label>
            <label className="text-0.875-medium">
              이메일
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#6E7AFF] focus:outline-none"
                placeholder="you@example.com"
              />
            </label>
            <label className="text-0.875-medium">
              연락처
              <input
                required
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#6E7AFF] focus:outline-none"
                placeholder="010-0000-0000"
              />
            </label>
          </div>

          <label className="text-0.875-medium block">
            희망 교육(선택)
            <select
              value={form.interest}
              onChange={(e) => setForm({ ...form, interest: e.target.value })}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#6E7AFF] focus:outline-none"
            >
              <option value="">선택하세요</option>
              <option value="취업준비 종합">취업준비 종합</option>
              <option value="이력서/자소서">이력서/자소서</option>
              <option value="직무탐색/멘토링">직무탐색/멘토링</option>
              <option value="기타">기타</option>
            </select>
          </label>

          <label className="text-0.875-medium block">
            전달 사항
            <textarea
              value={form.msg}
              onChange={(e) => setForm({ ...form, msg: e.target.value })}
              rows={4}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-[#6E7AFF] focus:outline-none"
              placeholder="교육 대상/규모, 일정, 예산 등 자유롭게 적어주세요"
            />
          </label>

          <label className="text-0.875 flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => setForm({ ...form, agree: e.target.checked })}
              className="h-4 w-4"
            />
            개인정보 수집·이용에 동의합니다.
          </label>

          <div className="mt-2 flex items-center justify-between gap-4">
            <button
              type="button"
              className="text-1-medium rounded-lg border border-neutral-300 bg-white px-4 py-2.5 hover:bg-neutral-50"
              onClick={onClose}
            >
              취소
            </button>
            <button
              disabled={loading}
              className="text-1-medium rounded-lg bg-[#6E7AFF] px-5 py-2.5 text-white disabled:opacity-60"
            >
              {loading ? '전송 중...' : '상담 요청 보내기'}
            </button>
          </div>

          {result && <p className="text-0.875 mt-3 text-[#375D3B]">{result}</p>}
        </form>
      </div>
    </div>
  );
}
