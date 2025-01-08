// import '../../../public/styles/font.css';
// import '../../index.css';
// import '../../styles/apply.scss';
// import '../../styles/card.scss';
// import '../../styles/github-markdown-light.css';
// import '../../styles/modal.scss';
// import '../../styles/mypage.scss';
import { ClientOnly } from './client';

export function generateStaticParams() {
  return [{ slug: [''] }];
}

export default function Page() {
  return <ClientOnly />;
}
