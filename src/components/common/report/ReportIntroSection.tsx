import { twMerge } from '@/lib/twMerge';
import { NavLink } from 'react-router-dom';

export const HeaderButton = ({
  children,
  to,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        twMerge(
          'flex h-14 flex-1 items-center justify-center rounded-sm bg-transparent text-xsmall16 text-neutral-0/75 transition hover:bg-primary-10 sm:h-16',
          isActive && 'bg-primary-20 text-primary hover:bg-primary-30',
        )
      }
    >
      {children}
    </NavLink>
  );
};

export const ReportHeader = () => {
  return (
    <div className="sticky top-[60px] -mx-5 mb-4 flex items-center gap-2 bg-white/90 px-5 pb-2 pt-2 sm:pb-5 md:top-[70px] lg:top-[76px]">
      <HeaderButton to="/report/landing">서류 진단 신청하기</HeaderButton>
      <HeaderButton to="/report/management">MY 진단서 보기</HeaderButton>
    </div>
  );
};

export const ReportLandingIntroSection = ({
  header,
}: {
  header: React.ReactNode;
}) => {
  return (
    <section className="mx-auto max-w-3xl px-5">
      {header}
      <div className="mb-4 flex justify-center rounded-xs bg-[#4138A3]">
        <img src="/images/report-banner.jpg" width={320} height={218} />
      </div>
      <div className="rounded flex items-center justify-center bg-slate-100">
        <img
          className="h-auto w-full"
          src="/images/report-detail-page-web-1.png"
          alt="서류 첨삭 서비스 소개, 서류 피드백을 렛츠커리어에서 받아야 하는 이유"
        />
      </div>
      <div className="rounded flex items-center justify-center bg-slate-100">
        <img
          className="h-auto w-full"
          src="/images/report-detail-page-web-2.png"
          alt="피드백 리포트를 통해 개인 맞춤형 서류 진단 제공"
        />
      </div>
      <div className="rounded flex items-center justify-center bg-slate-100">
        <img
          className="h-auto w-full"
          src="/images/report-detail-page-web-3.png"
          alt="검증된 서류 진단과 피드백 효과, 서류 진단 신청 방법"
        />
      </div>
    </section>
  );
};
