import { Helmet } from 'react-helmet';
import { ReportHeader } from '../../../components/common/report/ReportHeader';

const ReportPage = () => {
  const title = `서류 진단 프로그램 - 렛츠커리어`;
  const url = `${window.location.origin}/report`;
  // TODO: 설명 추가
  const description = '서류 진단 프로그램입니다. ...';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={url} />
        {description ? <meta name="description" content={description} /> : null}
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />

        {description ? (
          <meta property="og:description" content={description} />
        ) : null}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:url" content={url} />
        {description ? (
          <meta name="twitter:description" content={description} />
        ) : null}
      </Helmet>

      <div className="mx-auto max-w-5xl px-5">
        <ReportHeader />
        <div className="flex h-[218px] justify-center rounded-xs bg-[#4138A3]">
          <img src="/images/report-banner.png" />
        </div>
        <div className="rounded my-4 flex h-80 items-center justify-center bg-slate-100">
          서류 진단 서비스 간략 소개 ...
        </div>
        <div className="rounded my-4 flex h-80 items-center justify-center bg-slate-100">
          서류 진단 서비스 간략 소개 ...
        </div>
        <div className="rounded my-4 flex h-80 items-center justify-center bg-slate-100">
          서류 진단 서비스 간략 소개 ...
        </div>
        <div className="rounded my-4 flex h-80 items-center justify-center bg-slate-100">
          서류 진단 서비스 간략 소개 ...
        </div>
        <div className="rounded my-4 flex h-80 items-center justify-center bg-slate-100">
          서류 진단 서비스 간략 소개 ...
        </div>
      </div>
    </>
  );
};

export default ReportPage;
