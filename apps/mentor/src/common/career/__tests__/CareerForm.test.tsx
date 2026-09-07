import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { CareerFormType } from '@/api/career/careerSchema';
import CareerForm from '../CareerForm';

/*
 * LC-3278 회귀 테스트.
 *
 * 「재직 중」을 켜면 종료일이 없다. 그런데 시작일을 고르고 나면 종료 기간 선택 모달이
 * 떠서, 종료일 입력칸은 비활성인 채로 끌 방법 없는 화면을 하나 더 지나야 했다.
 */

const EMPTY_CAREER = {
  company: '',
  job: '',
  employmentType: '',
  employmentTypeOther: '',
  startDate: '',
  endDate: '',
  isRepresentative: false,
} as unknown as CareerFormType;

const renderForm = () =>
  render(
    <CareerForm
      initialCareer={EMPTY_CAREER}
      handleCancel={vi.fn()}
      handleSubmit={vi.fn()}
    />,
  );

/** 근무 기간의 시작 칸을 눌러 기간 선택 모달을 연다. */
const openStartPeriod = () =>
  fireEvent.click(screen.getByRole('button', { name: /시작 연도,월/ }));

/** 열려 있는 기간 모달에서 연·월을 고르고 확정한다. */
const pickPeriod = (year: string, month: string) => {
  fireEvent.click(screen.getByRole('button', { name: year }));
  fireEvent.click(screen.getByRole('button', { name: month }));
  fireEvent.click(screen.getByRole('button', { name: '선택 완료' }));
};

const toggleCurrentlyWorking = () =>
  fireEvent.click(screen.getByText('재직 중'));

describe('CareerForm — 근무 기간', () => {
  it('재직 중이면 시작일을 고른 뒤 종료 기간 모달을 띄우지 않는다', () => {
    renderForm();
    toggleCurrentlyWorking();

    openStartPeriod();
    expect(screen.getByText('시작 기간 선택')).toBeInTheDocument();

    pickPeriod('2020년', '3월');

    // 모달이 통째로 닫힌다 — 종료 기간 선택으로 넘어가지 않는다.
    expect(screen.queryByText('종료 기간 선택')).not.toBeInTheDocument();
    expect(screen.queryByText('시작 기간 선택')).not.toBeInTheDocument();
    expect(screen.getByText('2020.03')).toBeInTheDocument();
  });

  it('재직 중이 아니면 시작일 다음에 종료 기간을 묻는다', () => {
    renderForm();

    openStartPeriod();
    pickPeriod('2020년', '3월');

    expect(screen.getByText('종료 기간 선택')).toBeInTheDocument();
  });

  it('재직 중을 켜면 종료일 칸이 비활성이다', () => {
    renderForm();
    toggleCurrentlyWorking();

    expect(screen.getByRole('button', { name: /종료 연도,월/ })).toBeDisabled();
  });
});
