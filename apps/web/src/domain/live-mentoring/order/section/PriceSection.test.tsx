import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { useLiveMentoringCoupon } from '../hooks/useLiveMentoringCoupon';
import { validateQuestionInput } from '../utils';
import CouponSection from './CouponSection';
import PriceSection from './PriceSection';

describe('PriceSection', () => {
  it('결제 상품과 결제금액을 보여준다', () => {
    render(<PriceSection price={60000} appliedCouponCode={null} />);

    expect(screen.getByText('결제 상품')).toBeInTheDocument();
    expect(screen.getAllByText('60,000원')).toHaveLength(2);
  });

  /*
    서버 productDiscount 가 0 고정이다. 0 인 할인 행을 그리면 "0원 할인"이 붙어
    보이므로 감춘다. PRD 4-5 로 값이 생기면 자동으로 나타난다.
  */
  it('상품 할인이 0 이면 할인 행을 감춘다', () => {
    render(<PriceSection price={60000} appliedCouponCode={null} />);

    expect(screen.queryByText('할인')).not.toBeInTheDocument();
  });

  it('상품 할인이 있으면 할인 행이 나타나고 결제금액에서 빠진다', () => {
    render(
      <PriceSection
        price={60000}
        productDiscount={9000}
        appliedCouponCode={null}
      />,
    );

    expect(screen.getByText('할인')).toBeInTheDocument();
    expect(screen.getByText('-9,000원')).toBeInTheDocument();
    expect(screen.getByText('51,000원')).toBeInTheDocument();
  });

  /*
    할인 계산은 서버가 신청 생성 시점에 한다. 사전 조회 API 가 없어 이 화면에서는
    얼마가 빠질지 알 수 없다. 시안처럼 -10,000원 을 적으려면 숫자를 지어내야 한다.
  */
  it('쿠폰을 등록해도 할인액을 숫자로 지어내지 않는다', () => {
    render(<PriceSection price={60000} appliedCouponCode="LETS-1234" />);

    expect(screen.getByText('쿠폰할인')).toBeInTheDocument();
    expect(screen.getByText('결제 단계에서 적용')).toBeInTheDocument();
    // 결제금액은 쿠폰 적용 전 금액 그대로다
    expect(screen.getAllByText('60,000원')).toHaveLength(2);
  });

  it('쿠폰이 없으면 쿠폰할인 행 자체가 없다', () => {
    render(<PriceSection price={35000} appliedCouponCode={null} />);

    expect(screen.queryByText('쿠폰할인')).not.toBeInTheDocument();
  });
});

/** `OrderPage` 와 같은 배선. 쿠폰 코드가 신청 페이로드로 넘어갈 값이다. */
function CouponHarness({ onCode }: { onCode: (code: string | null) => void }) {
  const coupon = useLiveMentoringCoupon();
  onCode(coupon.appliedCode);
  return (
    <CouponSection
      inputValue={coupon.inputValue}
      onInputChange={coupon.setInputValue}
      appliedCode={coupon.appliedCode}
      onRegister={coupon.register}
      onClear={coupon.clear}
    />
  );
}

describe('CouponSection', () => {
  it('코드를 등록하면 신청에 실을 값으로 들고 있는다', () => {
    let code: string | null = null;
    render(<CouponHarness onCode={(next) => (code = next)} />);

    fireEvent.change(screen.getByLabelText('쿠폰 번호'), {
      target: { value: ' LETS-1234 ' },
    });
    fireEvent.click(screen.getByRole('button', { name: '쿠폰 등록' }));

    // 앞뒤 공백은 서버로 나가기 전에 털어낸다
    expect(code).toBe('LETS-1234');
    expect(screen.getByText('LETS-1234')).toBeInTheDocument();
  });

  it('빈 코드로는 등록할 수 없다', () => {
    render(<CouponHarness onCode={() => {}} />);

    expect(screen.getByRole('button', { name: '쿠폰 등록' })).toBeDisabled();
  });

  /*
    사전 검증 엔드포인트가 없다. 잘못된 코드는 결제하기를 누를 때 서버가 거른다 —
    조용히 넘겼다가 결제 직전에 튕기면 무엇이 잘못됐는지 알 수 없으므로 미리 알린다.
  */
  it('이 화면에서는 검증하지 않는다는 것을 문구로 알린다', () => {
    render(<CouponHarness onCode={() => {}} />);

    expect(screen.getByText(/결제하기를 누를 때 확인됩니다/)).toBeInTheDocument();
  });

  it('해제하면 코드가 사라진다', () => {
    let code: string | null = null;
    render(<CouponHarness onCode={(next) => (code = next)} />);

    fireEvent.change(screen.getByLabelText('쿠폰 번호'), {
      target: { value: 'LETS-1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: '쿠폰 등록' }));
    fireEvent.click(screen.getByRole('button', { name: '해제' }));

    expect(code).toBeNull();
    expect(screen.getByLabelText('쿠폰 번호')).toHaveValue('');
  });
});

/*
  서버 `LiveMentoringApplicationValidator.validateQuestion` 과 같은 규칙이다.
  여기서 못 걸러내면 결제하기를 누른 뒤 LIVE_MENTORING_INVALID_QUESTION 400 만
  돌아오는데, 그 문구로는 무엇을 고쳐야 하는지 알 수 없다.
*/
describe('validateQuestionInput — 서버 질문 검증 미러', () => {
  const base = {
    deferred: false,
    content: '이력서 피드백 부탁드립니다',
    attachmentType: 'NONE' as const,
    fileId: null,
    url: '',
    mentorShareAgreed: false,
  };

  it('나중에 작성하기면 아무것도 보지 않는다', () => {
    expect(
      validateQuestionInput({ ...base, deferred: true, content: '' }),
    ).toBeNull();
  });

  it('작성하기로 두고 본문이 비면 막는다', () => {
    expect(validateQuestionInput({ ...base, content: '   ' })).toMatch(
      /작성하거나/,
    );
  });

  it('첨부 없음이면 본문만 있으면 통과한다', () => {
    expect(validateQuestionInput(base)).toBeNull();
  });

  it('파일을 고르고 올리지 않으면 막는다', () => {
    expect(
      validateQuestionInput({ ...base, attachmentType: 'FILE' }),
    ).toMatch(/파일을 업로드/);
  });

  /* 서버가 절대 https URI 에 호스트까지 있는지 본다. */
  it('http 나 형식이 아닌 URL 은 막는다', () => {
    expect(
      validateQuestionInput({
        ...base,
        attachmentType: 'URL',
        url: 'http://example.test',
        mentorShareAgreed: true,
      }),
    ).toMatch(/https/);
    expect(
      validateQuestionInput({
        ...base,
        attachmentType: 'URL',
        url: 'example.test',
        mentorShareAgreed: true,
      }),
    ).toMatch(/https/);
  });

  it('https URL 과 전달 동의가 있으면 통과한다', () => {
    expect(
      validateQuestionInput({
        ...base,
        attachmentType: 'URL',
        url: 'https://example.test/resume',
        mentorShareAgreed: true,
      }),
    ).toBeNull();
  });

  /* 서버 `validateAttachmentCanBeSharedWithMentor`. */
  it('첨부가 있는데 전달 동의가 없으면 막는다', () => {
    expect(
      validateQuestionInput({
        ...base,
        attachmentType: 'FILE',
        fileId: 9001,
        mentorShareAgreed: false,
      }),
    ).toMatch(/동의/);
  });
});
