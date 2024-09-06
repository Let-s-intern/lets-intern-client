import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

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
      <HeaderButton to="/report/landing">
        서류 진단 신청하기
      </HeaderButton>
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
    <section className="mx-auto max-w-5xl px-5">
      {header}
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
    </section>
  );
};
