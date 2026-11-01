import { render, screen } from '@testing-library/react';
import { ILineBanner } from '@/types/Banner.interface';
import TopBannerImage from './TopBannerImage';

const S3 =
  'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/banner/line';

const banner = (overrides: Partial<ILineBanner> = {}): ILineBanner => ({
  id: 1,
  title: '렛츠콘 신청',
  colorCode: '#000000',
  contents: '내용',
  startDate: '2026-11-01T00:00:00',
  endDate: '2026-11-30T00:00:00',
  isValid: true,
  link: '/band-link',
  textColorCode: '#FFFFFF',
  imgUrl: `${S3}/desktop.webp`,
  mobileImgUrl: `${S3}/mobile.webp`,
  imageLink: '/letscon?utm_source=letscareer',
  ...overrides,
});

describe('TopBannerImage', () => {
  it('이미지가 하나도 없으면 아무것도 그리지 않는다', () => {
    const { container } = render(
      <TopBannerImage banner={banner({ imgUrl: null, mobileImgUrl: null })} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('PC 와 모바일 이미지를 함께 그린다', () => {
    render(<TopBannerImage banner={banner()} />);
    expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(2);
  });

  it('PC 이미지만 있으면 모바일에서 링크째 숨긴다', () => {
    render(<TopBannerImage banner={banner({ mobileImgUrl: null })} />);
    expect(screen.getByRole('link', { hidden: true })).toHaveClass(
      'hidden',
      'md:block',
    );
  });

  it('모바일 이미지만 있으면 PC 에서 링크째 숨긴다', () => {
    render(<TopBannerImage banner={banner({ imgUrl: null })} />);
    expect(screen.getByRole('link', { hidden: true })).toHaveClass('md:hidden');
  });

  it('이미지 링크로 이동하고 사이트 안쪽 경로는 같은 탭에서 연다', () => {
    render(<TopBannerImage banner={banner()} />);
    const link = screen.getByRole('link', { hidden: true });
    expect(link).toHaveAttribute('href', '/letscon?utm_source=letscareer');
    expect(link).toHaveAttribute('target', '_self');
  });

  it('이미지 링크가 비어 있으면 띠 배너 링크로 이동한다', () => {
    render(<TopBannerImage banner={banner({ imageLink: '' })} />);
    expect(screen.getByRole('link', { hidden: true })).toHaveAttribute(
      'href',
      '/band-link',
    );
  });

  it('외부 링크는 새 탭에서 연다', () => {
    render(
      <TopBannerImage
        banner={banner({ imageLink: 'https://example.com/event' })}
      />,
    );
    expect(screen.getByRole('link', { hidden: true })).toHaveAttribute(
      'target',
      '_blank',
    );
  });
});
