import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import {
  convertReportTypeToDisplayName,
  convertReportTypeToLandingPath,
  ReportType,
  useGetActiveReports,
} from '../../../api/report';

export const ReportLandingNavButton = ({
  reportType,
}: {
  reportType: ReportType;
}) => {
  const title = convertReportTypeToDisplayName(reportType);
  // const to = convertReportTypeToLandingPath(reportType) + '?from=nav';
  const to = convertReportTypeToLandingPath(reportType) + '#content';

  return (
    <NavLink
      to={to}
      title={title}
      preventScrollReset
      className={({ isActive }) =>
        twMerge(
          'flex h-14 flex-1 items-center justify-center border-b-2 border-transparent text-center text-white/30 transition hover:text-primary-light',
          isActive && 'border-b-primary-light text-primary-light',
        )
      }
    >
      {title}
    </NavLink>
  );
};

export const ReportLandingNav = () => {
  const { data, isSuccess } = useGetActiveReports();

  const showResume = isSuccess ? data?.resumeInfo : true;
  const showPersonalStatement = isSuccess ? data?.personalStatementInfo : true;
  const showPortfolio = isSuccess ? data?.portfolioInfo : true;

  const showNav = showResume || showPersonalStatement || showPortfolio;

  return showNav ? (
    <nav className="sticky top-[60px] mb-4 flex items-center bg-neutral-10 md:top-[70px] lg:top-[76px]">
      {showResume ? <ReportLandingNavButton reportType="RESUME" /> : null}
      {showPersonalStatement ? (
        <ReportLandingNavButton reportType="PERSONAL_STATEMENT" />
      ) : null}
      {showPortfolio ? <ReportLandingNavButton reportType="PORTFOLIO" /> : null}
    </nav>
  ) : null;
};

export default ReportLandingNav;
