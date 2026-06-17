import React, { ComponentType } from 'react';

interface LinkProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
  as?: ComponentType<{
    href: string;
    className?: string;
    children?: React.ReactNode;
  }>;
  [key: string]: any;
}

export function Link({
  href,
  children,
  className,
  as: Component,
  ...rest
}: LinkProps) {
  if (Component) {
    return (
      <Component href={href} className={className} {...rest}>
        {children}
      </Component>
    );
  }
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}
