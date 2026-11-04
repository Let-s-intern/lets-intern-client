import { fireEvent, render, screen } from '@testing-library/react';
import Link from 'next/link';

import BigfirmClickTracker from './BigfirmClickTracker';

type ClarityWindow = Window & { clarity?: jest.Mock };

describe('BigfirmClickTracker', () => {
  beforeEach(() => {
    window.dataLayer = [];
    delete (window as ClarityWindow).clarity;
    window.history.pushState({}, '', '/bigfirm');
  });

  it('속성을 단 링크를 누르면 bigfirm_click 을 남긴다', () => {
    render(
      <>
        <BigfirmClickTracker />
        <a
          href="/program?catalog=mentoring"
          data-track-target="mentoring_list"
          data-track-location="hero"
        >
          전체 멘토 보기
        </a>
      </>,
    );

    fireEvent.click(screen.getByText('전체 멘토 보기'));

    expect(window.dataLayer).toEqual([
      {
        event: 'bigfirm_click',
        button_target: 'mentoring_list',
        button_location: 'hero',
        click_url: '/program?catalog=mentoring',
        page_url: '/bigfirm',
        mentor_id: '',
        tab: '',
      },
    ]);
  });

  it('멘토 카드 안쪽 요소를 눌러도 멘토 id 와 함께 남긴다', () => {
    render(
      <>
        <BigfirmClickTracker />
        <Link
          href="/live-mentoring/12"
          data-track-target="mentor_detail"
          data-track-location="mentor_finder"
          data-track-mentor-id="12"
        >
          <span>상세페이지 보러가기</span>
        </Link>
      </>,
    );

    fireEvent.click(screen.getByText('상세페이지 보러가기'));

    expect(window.dataLayer).toEqual([
      expect.objectContaining({
        button_target: 'mentor_detail',
        click_url: '/live-mentoring/12',
        mentor_id: '12',
      }),
    ]);
  });

  it('이동이 없는 버튼은 click_url 을 비우고 탭 키를 싣는다', () => {
    render(
      <>
        <BigfirmClickTracker />
        <button
          type="button"
          data-track-target="company_tab"
          data-track-location="mentor_finder"
          data-track-tab="top100"
        >
          100대 기업
        </button>
      </>,
    );

    fireEvent.click(screen.getByText('100대 기업'));

    expect(window.dataLayer).toEqual([
      expect.objectContaining({
        button_target: 'company_tab',
        click_url: '',
        tab: 'top100',
      }),
    ]);
  });

  it('next/link 처럼 onClick 에서 preventDefault 해도 남긴다', () => {
    render(
      <>
        <BigfirmClickTracker />
        <a
          href="/review/program"
          data-track-target="review_list"
          data-track-location="reviews"
          onClick={(e) => e.preventDefault()}
        >
          더 자세한 후기
        </a>
      </>,
    );

    fireEvent.click(screen.getByText('더 자세한 후기'));

    expect(window.dataLayer).toHaveLength(1);
  });

  it('속성이 없는 링크는 남기지 않는다', () => {
    render(
      <>
        <BigfirmClickTracker />
        <Link href="/blog/list">블로그</Link>
      </>,
    );

    fireEvent.click(screen.getByText('블로그'));

    expect(window.dataLayer).toEqual([]);
  });

  it('Clarity 가 있으면 이벤트와 태그를 남긴다', () => {
    const clarity = jest.fn();
    (window as ClarityWindow).clarity = clarity;
    render(
      <>
        <BigfirmClickTracker />
        <a
          href="#coupon"
          data-track-target="find_mentor"
          data-track-location="hero"
        >
          대기업 멘토 찾기
        </a>
      </>,
    );

    fireEvent.click(screen.getByText('대기업 멘토 찾기'));

    expect(clarity).toHaveBeenCalledWith('event', 'bigfirm_click');
    expect(clarity).toHaveBeenCalledWith('set', 'button_target', 'find_mentor');
    expect(clarity).toHaveBeenCalledWith('set', 'button_location', 'hero');
  });
});
