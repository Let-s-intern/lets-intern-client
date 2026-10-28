// 첨부 섹션이 서류 정리 조회로 `@/api/user/user` 를 물고 오므로 네트워크 계층(`import.meta`)을 막는다
jest.mock('@/utils/axios', () => ({ __esModule: true, default: {} }));
jest.mock('@/utils/axiosV2', () => ({ __esModule: true, default: {} }));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider } from 'react-hook-form';

import type { MentorApplyFormValues } from '../schema';
import AdditionalInfoSection from '../section/AdditionalInfoSection';
import AttachmentSection from '../section/AttachmentSection';
import BasicInfoSection from '../section/BasicInfoSection';
import MentoringFieldSection from '../section/MentoringFieldSection';
import PrivacyAgreementSection from '../section/PrivacyAgreementSection';
import { useMentorApplyForm } from './useMentorApplyForm';

/* 첨부 섹션이 서류 정리 쿼리를 쓴다. 비로그인이라 실제로 부르지는 않는다 */
const queryClient = new QueryClient();

function Harness({
  onValid,
}: {
  onValid: (values: MentorApplyFormValues) => void;
}) {
  const { form, onSubmit } = useMentorApplyForm(onValid);
  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...form}>
        <form noValidate onSubmit={onSubmit}>
          <BasicInfoSection />
          <MentoringFieldSection />
          <AdditionalInfoSection />
          <AttachmentSection />
          <PrivacyAgreementSection />
          <button type="submit">제출</button>
        </form>
      </FormProvider>
    </QueryClientProvider>
  );
}

/* 칩 라벨(`전화번호`, `직무 Q&A`)과 겹치지 않도록 필수 표시까지 맞춘다 */
const requiredField = (label: string) =>
  screen.getByLabelText(new RegExp(`^${label}\\s*\\*`));

const scrollIntoView = jest.fn();

beforeAll(() => {
  Element.prototype.scrollIntoView = scrollIntoView;
});

beforeEach(() => scrollIntoView.mockClear());

const fillRequired = async () => {
  await userEvent.type(requiredField('성함'), '홍길동');
  await userEvent.type(requiredField('소속'), '렛츠커리어');
  await userEvent.type(requiredField('직무'), '백엔드 개발');
  await userEvent.type(requiredField('연차'), '5');
  await userEvent.type(requiredField('전화번호'), '01012345678');
  await userEvent.type(requiredField('이메일'), 'mentor@example.com');
  await userEvent.click(screen.getByRole('checkbox', { name: '이메일' }));
  await userEvent.click(screen.getByLabelText('개발·IT'));
  await userEvent.click(screen.getByLabelText('모의 면접'));
  await userEvent.click(
    screen.getByLabelText(/개인정보 수집·이용에 동의합니다/),
  );
};

describe('useMentorApplyForm', () => {
  it('필수 항목이 비면 에러를 띄우고 제출하지 않는다', async () => {
    const onValid = jest.fn();
    render(<Harness onValid={onValid} />);

    await userEvent.click(screen.getByRole('button', { name: '제출' }));

    for (const message of [
      '성함을 입력해 주세요.',
      '소속을 입력해 주세요.',
      '직무를 입력해 주세요.',
      '연차를 입력해 주세요.',
      '전화번호를 입력해 주세요.',
      '이메일을 입력해 주세요.',
      '선호 연락 수단을 선택해 주세요.',
      '멘토링 가능 분야를 선택해 주세요.',
      '가능한 멘토링 형태를 선택해 주세요.',
      '개인정보 수집·이용에 동의해 주세요.',
    ]) {
      expect(await screen.findByText(message)).toBeInTheDocument();
    }
    expect(requiredField('성함')).toHaveAttribute('aria-invalid', 'true');
    expect(onValid).not.toHaveBeenCalled();
  });

  it('첫 에러 필드로 스크롤하고 포커스를 옮긴다', async () => {
    render(<Harness onValid={jest.fn()} />);
    await userEvent.type(requiredField('성함'), '홍길동');
    await userEvent.type(requiredField('소속'), '렛츠커리어');

    await userEvent.click(screen.getByRole('button', { name: '제출' }));
    await screen.findByText('직무를 입력해 주세요.');

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.contexts[0]).toHaveAttribute(
      'data-field',
      'jobTitle',
    );
    expect(requiredField('직무')).toHaveFocus();
  });

  it('전화번호는 입력하면서 하이픈이 붙는다', async () => {
    render(<Harness onValid={jest.fn()} />);
    const phone = requiredField('전화번호');
    await userEvent.type(phone, '01012345678');
    expect(phone).toHaveValue('010-1234-5678');
  });

  it('SNS 는 3칸이고, 형식이 틀린 칸만 에러로 표시한다', async () => {
    const onValid = jest.fn();
    render(<Harness onValid={onValid} />);
    expect(screen.getAllByPlaceholderText('https://')).toHaveLength(3);

    await fillRequired();
    await userEvent.type(screen.getByLabelText('SNS 2'), 'blog');
    await userEvent.click(screen.getByRole('button', { name: '제출' }));

    expect(
      await screen.findByText('올바른 주소를 입력해 주세요.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('SNS 1')).toHaveAttribute(
      'aria-invalid',
      'false',
    );
    expect(screen.getByLabelText('SNS 2')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(scrollIntoView.mock.contexts[0]).toHaveAttribute(
      'data-field',
      'snsLinks',
    );
    expect(onValid).not.toHaveBeenCalled();
  });

  it('모두 채우면 폼 값을 넘긴다', async () => {
    const onValid = jest.fn();
    render(<Harness onValid={onValid} />);
    await fillRequired();
    await userEvent.type(
      screen.getByLabelText('SNS 1'),
      'https://linkedin.com/in/a',
    );

    await userEvent.click(screen.getByRole('button', { name: '제출' }));

    expect(onValid).toHaveBeenCalledTimes(1);
    expect(onValid.mock.calls[0][0]).toMatchObject({
      name: '홍길동',
      yearsOfExperience: '5',
      phoneNum: '010-1234-5678',
      preferredContactMethods: ['EMAIL'],
      jobFields: ['DEVELOPMENT'],
      mentoringTypes: ['MOCK_INTERVIEW'],
      snsLinks: ['https://linkedin.com/in/a', '', ''],
      privacyAgreed: true,
      attachment: null,
    });
  });
});
