import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import {
  convertReportTypeToDisplayName,
  convertReportTypeToLandingPath,
  ReportType,
} from '../../../api/report';

export const ReportLandingNavButton = ({
  reportType,
}: {
  reportType: ReportType;
}) => {
  const title = convertReportTypeToDisplayName(reportType);
  const to = convertReportTypeToLandingPath(reportType);
  return (
    <NavLink
      to={to}
      title={title}
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

export const ReportLandingHeader = () => {
  return (
    <header className="sticky top-[60px] mb-4 flex items-center bg-neutral-10 md:top-[70px] lg:top-[76px]">
      <ReportLandingNavButton reportType="RESUME" />
      <ReportLandingNavButton reportType="PERSONAL_STATEMENT" />
      <ReportLandingNavButton reportType="PORTFOLIO" />
    </header>
  );
};

export default ReportLandingHeader;
