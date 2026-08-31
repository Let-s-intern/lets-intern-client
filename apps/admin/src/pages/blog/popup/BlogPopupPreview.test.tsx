import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BlogPopupPreview, {
  BLOG_POPUP_IMAGE_NOTICE,
  BlogPopupImageNotice,
} from './BlogPopupPreview';

describe('BlogPopupPreview', () => {
  it('이미지가 있으면 그 이미지를 그린다', () => {
    render(<BlogPopupPreview imageUrl="https://cdn.test/popup.png" />);

    expect(document.querySelector('img')).toHaveAttribute(
      'src',
      'https://cdn.test/popup.png',
    );
  });

  it('이미지가 없으면 플레이스홀더를 그린다', () => {
    render(<BlogPopupPreview />);

    expect(document.querySelector('img')).toBeNull();
    expect(
      screen.getByText('이미지를 업로드하면 여기에 미리보기가 표시됩니다'),
    ).toBeInTheDocument();
  });

  it('하단 두 버튼을 실제 팝업과 같은 문구로 둔다', () => {
    render(<BlogPopupPreview imageUrl="https://cdn.test/popup.png" />);

    expect(
      screen.getByRole('button', { name: '하루 동안 보지 않기' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
  });

  it('폭 400px, 모서리 16px 로 그린다', () => {
    const { container } = render(
      <BlogPopupPreview imageUrl="https://cdn.test/popup.png" />,
    );

    // 실제 팝업이 max-w-[400px] / borderRadius 16px 다. 이 값이 어긋나면 미리보기가 거짓이 된다.
    expect(container.firstElementChild).toHaveClass('w-[400px]');
    expect(container.querySelector('[style]')).toHaveStyle({
      borderRadius: '16px',
    });
  });
});

describe('BlogPopupImageNotice', () => {
  it('권장 사이즈 고지를 그린다', () => {
    render(<BlogPopupImageNotice />);

    expect(screen.getByText(BLOG_POPUP_IMAGE_NOTICE)).toBeInTheDocument();
  });

  it('고지 문구에 권장 폭과 파일 형식이 들어 있다', () => {
    expect(BLOG_POPUP_IMAGE_NOTICE).toContain('800px');
    expect(BLOG_POPUP_IMAGE_NOTICE).toContain('400px');
    expect(BLOG_POPUP_IMAGE_NOTICE).toContain('PNG 또는 JPG');
  });
});
