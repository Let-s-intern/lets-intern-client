import NextImage from 'next/image';
import React from 'react';
import { Image } from '@letscareer/ui/Image';

type AppImageProps = Omit<React.ComponentProps<typeof Image>, 'as'>;

export function AppImage(props: AppImageProps) {
  const { src, alt, width, height, className, ...rest } = props;
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      as={NextImage as any}
      {...rest}
    />
  );
}
