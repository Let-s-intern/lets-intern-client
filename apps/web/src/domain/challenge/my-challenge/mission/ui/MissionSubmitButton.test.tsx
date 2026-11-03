/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import MissionSubmitButton from './MissionSubmitButton';

jest.mock('@/store/useMissionStore', () => ({
  useMissionStore: () => ({ selectedMissionTh: 1 }),
}));

describe('MissionSubmitButton — 제출 중', () => {
  it('제출 중이면 내용이 있어도 제출 버튼이 꺼진다', () => {
    render(<MissionSubmitButton hasContent isSubmitting />);

    expect(screen.getByRole('button', { name: '제출하기' })).toBeDisabled();
  });

  it('수정 저장 중이면 저장 버튼이 꺼진다', () => {
    render(<MissionSubmitButton hasContent isEditing isSubmitting />);

    expect(screen.getByRole('button', { name: '저장하기' })).toBeDisabled();
  });
});
