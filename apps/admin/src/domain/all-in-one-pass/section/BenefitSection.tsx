import { PassBenefit } from '@/domain/all-in-one-pass/types';
import {
  FIXED_BENEFIT_CATEGORIES,
  isFixedBenefitCategory,
} from '@/domain/all-in-one-pass/ui/benefit/benefitCategories';
import BenefitModal from '@/domain/all-in-one-pass/ui/benefit/BenefitModal';
import { CategoryTabs } from '@letscareer/ui';
import { Button } from '@mui/material';
import { Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';
import { FiImage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const createEmptyBenefit = (): PassBenefit => ({
  id: crypto.randomUUID(),
  isVisible: true,
  category: '',
  thumbnailUrl: null,
  title: '',
  link: '',
  coupon: null,
});

const ALL = '';

interface Props {
  benefits: PassBenefit[];
  onChange: (benefits: PassBenefit[]) => void;
}

/** 1.6 혜택: 카테고리 탭 + 리스트(노출 토글·썸네일·제목·링크·수정/삭제) + 추가/수정 모달 */
export default function BenefitSection({ benefits, onChange }: Props) {
  const [editing, setEditing] = useState<{
    benefit: PassBenefit;
    isEdit: boolean;
  } | null>(null);
  const [tab, setTab] = useState<string>(ALL);
  const navigate = useNavigate();

  // 등록된 혜택에서 파생되는 유형(고정 카테고리는 제외해 중복 방지)
  const dynamicCategories = useMemo(
    () =>
      Array.from(
        new Set(benefits.map((b) => b.category).filter(Boolean)),
      ).filter((c) => !isFixedBenefitCategory(c)),
    [benefits],
  );
  // 고정 카테고리(1:1 LIVE 멘토링)는 등록 여부와 무관하게 항상 탭으로 노출
  const categories = [...FIXED_BENEFIT_CATEGORIES, ...dynamicCategories];
  const tabOptions = [
    { value: ALL, label: '전체' },
    ...categories.map((c) => ({ value: c, label: c })),
  ];
  const visibleTab = categories.includes(tab) ? tab : ALL;
  const filtered =
    visibleTab === ALL
      ? benefits
      : benefits.filter((b) => b.category === visibleTab);

  // 노출 토글(isVisible) 보류로 현재 미사용. 백엔드 지원되면 해제.
  // const update = (id: string, partial: Partial<PassBenefit>) =>
  //   onChange(benefits.map((b) => (b.id === id ? { ...b, ...partial } : b)));

  const handleSave = (saved: PassBenefit) => {
    onChange(
      benefits.some((b) => b.id === saved.id)
        ? benefits.map((b) => (b.id === saved.id ? saved : b))
        : [...benefits, saved],
    );
    setEditing(null);
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-small20 text-neutral-0 font-semibold">기타 혜택</h2>

      <div className="flex items-center justify-between gap-3">
        <CategoryTabs
          options={tabOptions}
          selected={visibleTab}
          onChange={setTab}
        />
        <Button
          variant="outlined"
          size="medium"
          className="shrink-0"
          sx={{ borderStyle: 'dashed' }}
          startIcon={<FaPlus size={12} />}
          onClick={() =>
            setEditing({ benefit: createEmptyBenefit(), isEdit: false })
          }
        >
          혜택 추가
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xsmall14 text-neutral-40 py-20 text-center">
          {visibleTab === ALL
            ? '기타 혜택이 존재하지 않습니다.'
            : `${visibleTab} 혜택이 존재하지 않습니다.`}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((benefit) => (
            <div
              key={benefit.id}
              className="border-neutral-80 flex overflow-hidden rounded-md border"
            >
              <div className="flex flex-1 gap-3 p-4">
                <div className="bg-neutral-95 flex aspect-[4/3] w-32 shrink-0 items-center justify-center overflow-hidden rounded">
                  {benefit.thumbnailUrl ? (
                    <img
                      src={benefit.thumbnailUrl}
                      alt="썸네일"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <FiImage className="text-neutral-40 text-2xl" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xsmall16 text-neutral-0 truncate font-medium">
                      {benefit.title || '(제목 없음)'}
                    </span>
                    {(benefit.coupon || benefit.link) && (
                      <ul className="text-xxsmall12 text-neutral-40 list-disc space-y-1 pl-4">
                        {benefit.coupon ? (
                          <>
                            {benefit.coupon.couponId != null && (
                              <>
                                <li>쿠폰 ID : {benefit.coupon.couponId}</li>
                                <li className="break-all">
                                  쿠폰 코드 : {benefit.coupon.couponCode}
                                </li>
                                <li>
                                  사용 가능 횟수 :{' '}
                                  {benefit.coupon.count < 0
                                    ? '무제한'
                                    : `${benefit.coupon.count}회`}
                                </li>
                              </>
                            )}
                          </>
                        ) : (
                          <li className="break-all">
                            연결 링크 :{' '}
                            <a
                              href={benefit.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-primary hover:underline"
                            >
                              {benefit.link}
                            </a>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  {/* 노출 토글: 멤버십 혜택 API에 isVisible 필드가 없어 일단 보류(주석).
                      백엔드 지원되면 해제.
                  {!benefit.coupon && (
                    <Switch
                      size="small"
                      className="-mr-1.5 self-end"
                      checked={benefit.isVisible}
                      onChange={(e) =>
                        update(benefit.id, { isVisible: e.target.checked })
                      }
                    />
                  )} */}
                </div>
              </div>

              {/* 오른쪽 세로 스트립: 위 수정 · 아래 삭제 */}
              <div className="divide-neutral-80 border-neutral-80 flex w-11 shrink-0 flex-col divide-y border-l">
                {/*
                  생성된 멘토링 쿠폰(couponId 있음)은 클릭 시 쿠폰 편집 페이지로 딥링크
                  (쿠폰 페이지가 주인 — 수정·삭제는 거기서, seed & forget).
                  미생성 씨앗(개설 중)·일반 혜택은 기존 편집 모달을 연다.
                  TODO(실제 쿠폰 API): 수정 화면에선 멘토링 카드 전체를 읽기전용으로.
                */}
                <button
                  type="button"
                  aria-label={benefit.coupon ? '쿠폰 관리' : '수정'}
                  onClick={() =>
                    benefit.coupon?.couponId != null
                      ? navigate(`/coupons/${benefit.coupon.couponId}/edit`)
                      : setEditing({ benefit, isEdit: true })
                  }
                  className="text-neutral-40 hover:bg-neutral-95 hover:text-neutral-0 flex flex-1 items-center justify-center transition-colors"
                >
                  <Pencil size={16} />
                </button>
                {/*
                  생성된 멘토링 쿠폰은 삭제도 쿠폰 목록 페이지에서(미사용만 삭제, seed & forget).
                  미생성 씨앗·일반 혜택은 로컬에서 바로 제거.
                */}
                <button
                  type="button"
                  aria-label="삭제"
                  onClick={() =>
                    benefit.coupon?.couponId != null
                      ? navigate('/coupons')
                      : onChange(benefits.filter((b) => b.id !== benefit.id))
                  }
                  className="text-neutral-40 hover:bg-system-error/10 hover:text-system-error flex flex-1 items-center justify-center transition-colors"
                >
                  <FaTrashCan size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BenefitModal
        benefit={editing?.benefit ?? null}
        isEdit={editing?.isEdit ?? false}
        existingCategories={benefits.map((b) => b.category)}
        onSave={handleSave}
        onClose={() => setEditing(null)}
      />
    </section>
  );
}
