import React, { ComponentType } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  as?: ComponentType<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }>;
  [key: string]: any;
}

export function Image({
  src,
  alt,
  width,
  height,
  className,
  as: Component,
  ...rest
}: ImageProps) {
  if (Component) {
    return (
      <Component
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
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
      className={className}
      {...rest}
    />
  );
}
