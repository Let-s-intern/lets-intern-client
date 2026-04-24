import { ImgHTMLAttributes } from 'react';

interface ImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'width' | 'height' | 'src' | 'alt' | 'loading' | 'placeholder'
  > {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty' | string;
  blurDataURL?: string;
  unoptimized?: boolean;
  loader?: unknown;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  style?: React.CSSProperties;
}

/**
 * next/image의 간이 대체 컴포넌트. admin 앱(Vite) 환경에서 사용.
 * - fill 모드: position absolute + inset 0 (부모 relative 필요)
 * - 일반 모드: <img width height>
 */
export default function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority: _priority,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  unoptimized: _unoptimized,
  loader: _loader,
  loading,
  sizes: _sizes,
  style,
  ...rest
}: ImageProps) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        loading={loading ?? 'lazy'}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...style,
        }}
        {...rest}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading ?? 'lazy'}
      style={style}
      {...rest}
    />
  );
}
