'use client';

import { useOneTimeFormQuery } from '@/api/one-time-form/oneTimeForm';
import FormPopupShell from './FormPopupShell';
import ProductCard from './ProductCard';

interface OneTimeFormPageProps {
  slug: string;
}

const PAID_STEP = { current: 1, total: 2 };

/** 일회성 폼 신청 팝업 1단계(정보 입력). 유료는 "신청서 작성 1/2", 무료는 단계 없이 분류 문구(categoryText)가 제목 */
const OneTimeFormPage = ({ slug }: OneTimeFormPageProps) => {
  const { data, isLoading } = useOneTimeFormQuery(slug);

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
        // 합계(7.3)와 필수 입력 검증·제출(7.4)이 이 버튼을 연결한다
        <button
          type="button"
          disabled
          className="bg-primary text-xsmall16 text-static-100 disabled:bg-neutral-85 disabled:text-neutral-45 h-14 w-full rounded-sm font-semibold"
        >
          {form.isPaid ? '다음' : '제출하기'}
        </button>
      }
    >
      <ProductCard form={form} />
      {/* 7.3 옵션 선택: data.optionGroups */}
      {/* 7.4 질문 입력: data.questions */}
    </FormPopupShell>
  );
};

export default OneTimeFormPage;
