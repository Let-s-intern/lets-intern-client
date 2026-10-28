'use client';

import { useOneTimeFormQuery } from '@/api/one-time-form/oneTimeForm';
import type { OneTimeFormOptionGroup } from '@/api/one-time-form/oneTimeFormSchema';
import useOptionSelection from '../hooks/useOptionSelection';
import FormPopupShell from './FormPopupShell';
import OptionGroupList from './OptionGroupList';
import ProductCard from './ProductCard';

interface OneTimeFormPageProps {
  slug: string;
}

const PAID_STEP = { current: 1, total: 2 };
const NO_OPTION_GROUPS: OneTimeFormOptionGroup[] = [];

/** 일회성 폼 신청 팝업 1단계(정보 입력). 유료는 "신청서 작성 1/2", 무료는 단계 없이 분류 문구(categoryText)가 제목 */
const OneTimeFormPage = ({ slug }: OneTimeFormPageProps) => {
  const { data, isLoading } = useOneTimeFormQuery(slug);
  const { selectedOptionIds, totalPrice, toggleOption } = useOptionSelection({
    basePrice: data?.form.basePrice ?? 0,
    optionGroups: data?.optionGroups ?? NO_OPTION_GROUPS,
  });

  if (isLoading) {
    return (
      <FormPopupShell title="신청서 작성">
        <p className="text-xsmall14 text-neutral-40 py-10 text-center">
          불러오는 중이에요
        </p>
      </FormPopupShell>
    );
  }

  // 없는 폼·비공개·기간 밖 등 예외 화면은 7.6 에서 그린다
  if (!data) return null;

  const { form } = data;

  return (
    <FormPopupShell
      title={form.isPaid ? '신청서 작성' : form.categoryText}
      step={form.isPaid ? PAID_STEP : undefined}
      footer={
        <>
          {form.isPaid ? (
            <div className="text-xsmall14 text-neutral-40 mb-2.5 flex items-baseline justify-between">
              <span>선택한 금액</span>
              <b className="text-small18 text-neutral-0">
                {totalPrice.toLocaleString('ko-KR')}원
              </b>
            </div>
          ) : null}
          {/* 필수 입력 검증·제출(7.4)이 이 버튼을 연결한다 */}
          <button
            type="button"
            disabled
            className="bg-primary text-xsmall16 text-static-100 disabled:bg-neutral-85 disabled:text-neutral-45 h-14 w-full rounded-sm font-semibold"
          >
            {form.isPaid ? '다음' : '제출하기'}
          </button>
        </>
      }
    >
      <ProductCard form={form} />
      <OptionGroupList
        optionGroups={data.optionGroups}
        selectedOptionIds={selectedOptionIds}
        onSelect={toggleOption}
      />
      {/* 7.4 질문 입력: data.questions */}
    </FormPopupShell>
  );
};

export default OneTimeFormPage;
