'use client';

interface OneTimeFormPageProps {
  slug: string;
}

/** 일회성 폼 신청 팝업 컨테이너. 팝업 틀·옵션·질문은 이후 작업(7.2~7.6)에서 채운다 */
const OneTimeFormPage = ({ slug }: OneTimeFormPageProps) => {
  return <main data-slug={slug} />;
};

export default OneTimeFormPage;
