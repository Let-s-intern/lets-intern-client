export { PageLayout };

import React from 'react';
import '../src/index.css';
import '../src/styles/apply.scss';
import '../src/styles/blog.css';
import '../src/styles/card.scss';
import '../src/styles/github-markdown-light.css';
import '../src/styles/modal.scss';
import '../src/styles/mypage.scss';

function PageLayout({ children }: { children: React.ReactNode }) {
  return <React.StrictMode>{children}</React.StrictMode>;
}
