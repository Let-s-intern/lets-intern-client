import { fireEvent, render, screen } from '@testing-library/react';

import MentorJoinClickTracker from './MentorJoinClickTracker';

const renderWithLinks = () =>
  render(
    <>
      <MentorJoinClickTracker />
      <a
        href="/mentor-apply"
        data-track-target="apply"
        data-track-location="hero"
      >
        <span>멘토 신청하기</span>
      </a>
      <a href="/somewhere">추적 안 함</a>
    </>,
  );

describe('MentorJoinClickTracker', () => {
  let clarity: jest.Mock;

  beforeEach(() => {
    window.dataLayer = [];
    clarity = jest.fn();
    (window as Window & { clarity?: jest.Mock }).clarity = clarity;
  });

  afterEach(() => {
    delete (window as Window & { clarity?: jest.Mock }).clarity;
  });

  it('data-track 을 단 링크를 누르면 dataLayer 와 Clarity 에 남긴다. 안쪽 요소를 눌러도 같다', () => {
    renderWithLinks();

    fireEvent.click(screen.getByText('멘토 신청하기'));

    expect(window.dataLayer).toEqual([
      {
        event: 'mentor_join_click',
        button_target: 'apply',
        button_location: 'hero',
        click_url: '/mentor-apply',
        page_url: window.location.pathname,
      },
    ]);
    expect(clarity).toHaveBeenCalledWith('event', 'mentor_join_click');
    expect(clarity).toHaveBeenCalledWith('set', 'button_target', 'apply');
    expect(clarity).toHaveBeenCalledWith('set', 'button_location', 'hero');
  });

  it('data-track 이 없는 링크는 남기지 않는다', () => {
    renderWithLinks();

    fireEvent.click(screen.getByText('추적 안 함'));

    expect(window.dataLayer).toEqual([]);
    expect(clarity).not.toHaveBeenCalled();
  });

  it('끌고 놓아 막힌 클릭(preventDefault)은 남기지 않는다', () => {
    renderWithLinks();
    const link = screen.getByText('멘토 신청하기');
    link.addEventListener('click', (e) => e.preventDefault());

    fireEvent.click(link);

    expect(window.dataLayer).toEqual([]);
  });

  it('Clarity 가 없어도 dataLayer 에는 남긴다', () => {
    delete (window as Window & { clarity?: jest.Mock }).clarity;
    renderWithLinks();

    fireEvent.click(screen.getByText('멘토 신청하기'));

    expect(window.dataLayer).toHaveLength(1);
  });
});
