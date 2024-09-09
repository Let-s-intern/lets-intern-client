import {
  convertFeedbackStatusToBadgeStatus,
  convertFeedbackStatusToDisplayName,
  convertReportStatusToBadgeStatus,
  convertReportStatusToUserDisplayName,
  convertReportTypeToDisplayName,
  useGetMyReports,
} from '@/api/report';
import { download } from '@/lib/download';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import { ReportHeader } from '@components/common/report/ReportIntroSection';
import Tooltip from '@components/common/report/Tooltip';
import Badge from '@components/common/ui/Badge';
import {
  ComponentPropsWithoutRef,
  ElementType,
  forwardRef,
  MouseEvent,
  useEffect,
  useRef,
} from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';

type ReportFilter = {
  status: 'all' | 'active' | 'inactive';
  type: 'all' | 'resume' | 'personal_statement' | 'portfolio';
};

const filters: {
  label: string;
  value: ReportFilter['type'];
}[] = [
  { label: '전체', value: 'all' },
  { label: '이력서', value: 'resume' },
  { label: '자기소개서', value: 'personal_statement' },
  { label: '포트폴리오', value: 'portfolio' },
];

function isDownloadable(url: string | null | undefined): url is string {
  if (!url) {
    return false;
  }

  try {
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;

    if (
      pathname.endsWith('.pdf') ||
      pathname.endsWith('.doc') ||
      pathname.endsWith('.docx')
    ) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

function handleDownloadOrOpen(url: string | null | undefined) {
  if (isDownloadable(url)) {
    download(url);
  } else if (url) {
    window.open(url, '_blank');
  } else {
    window.alert('오류: 파일이 없습니다.');
  }
}

// TODO: 공통화
const DocIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
  >
    <path
      d="M11.3333 17.166C11.2542 17.1667 11.1654 17.1667 11.0641 17.1667H6.49734C5.56575 17.1667 5.09925 17.1667 4.74308 16.9852C4.42948 16.8254 4.1747 16.5702 4.01491 16.2566C3.83325 15.9001 3.83325 15.4336 3.83325 14.5002V6.50017C3.83325 5.56675 3.83325 5.09969 4.01491 4.74317C4.1747 4.42957 4.42948 4.17479 4.74308 4.015C5.0996 3.83334 5.56666 3.83334 6.50008 3.83334H14.5001C15.4335 3.83334 15.8996 3.83334 16.2561 4.015C16.5697 4.17479 16.8253 4.42957 16.9851 4.74317C17.1666 5.09935 17.1666 5.56584 17.1666 6.49744V11.0623C17.1666 11.1644 17.1666 11.2538 17.1658 11.3333M11.3333 17.166C11.5713 17.1638 11.7219 17.1552 11.8656 17.1207C12.0357 17.0799 12.1981 17.0123 12.3472 16.9209C12.5154 16.8178 12.6596 16.6741 12.9478 16.3858L16.3857 12.9479C16.674 12.6597 16.8173 12.5155 16.9204 12.3473C17.0118 12.1982 17.0794 12.0354 17.1202 11.8653C17.1547 11.7216 17.1635 11.5712 17.1658 11.3333M11.3333 17.166V12.6668C11.3333 12.2 11.3333 11.9665 11.4241 11.7883C11.504 11.6315 11.6314 11.5041 11.7882 11.4242C11.9664 11.3333 12.1995 11.3333 12.6663 11.3333H17.1658"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// TODO: 공통화
const CompanyBagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      d="M7.16675 17.5V5.83333C7.16675 5.05836 7.16675 4.67087 7.25193 4.35295C7.4831 3.49022 8.15697 2.81635 9.0197 2.58519C9.33762 2.5 9.72511 2.5 10.5001 2.5C11.2751 2.5 11.6625 2.5 11.9805 2.58519C12.8432 2.81635 13.5171 3.49022 13.7482 4.35295C13.8334 4.67087 13.8334 5.05836 13.8334 5.83333V17.5M4.83342 17.5H16.1667C17.1002 17.5 17.5669 17.5 17.9234 17.3183C18.237 17.1586 18.492 16.9036 18.6518 16.59C18.8334 16.2335 18.8334 15.7668 18.8334 14.8333V8.5C18.8334 7.56658 18.8334 7.09987 18.6518 6.74335C18.492 6.42975 18.237 6.17478 17.9234 6.01499C17.5669 5.83333 17.1002 5.83333 16.1667 5.83333H4.83341C3.89999 5.83333 3.43328 5.83333 3.07676 6.01499C2.76316 6.17478 2.50819 6.42975 2.3484 6.74335C2.16675 7.09987 2.16675 7.56658 2.16675 8.5V14.8333C2.16675 15.7668 2.16675 16.2335 2.3484 16.59C2.50819 16.9036 2.76316 17.1586 3.07676 17.3183C3.43328 17.5 3.89999 17.5 4.83342 17.5Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type ReportManagementButtonProps<T extends ElementType> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
} & Omit<ComponentPropsWithoutRef<T>, 'disabled' | 'type'>;

type ReportManageButtonComponent = {
  <T extends ElementType = 'button'>(
    props: ReportManagementButtonProps<T>,
  ): React.ReactNode;
  displayName?: string | undefined;
};

export const ReportManagementButton: ReportManageButtonComponent = forwardRef(
  <T extends ElementType = 'button'>(
    {
      as,
      children,
      className,
      disabled = false,
      type = 'button',
      ...props
    }: ReportManagementButtonProps<T>,
    ref: React.Ref<Element>,
  ) => {
    const Component = (as || 'button') as JSX.ElementType;
    return (
      <Component
        ref={ref}
        className={twMerge(
          'flex h-10 w-full items-center justify-center rounded-sm bg-primary-light text-xsmall14 font-semibold text-white shadow-sm outline-none outline-2 outline-offset-2 transition-all hover:bg-primary focus:outline focus:outline-primary',

          disabled &&
            'cursor-not-allowed bg-neutral-95 text-neutral-60 hover:bg-neutral-95 focus:outline-none',
          className,
        )}
        disabled={disabled}
        type={type}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

ReportManagementButton.displayName = 'ReportManagementButton';

const ReportManagementPage = () => {
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      // TODO: Router 구조 리팩토링 후 setTimeout 제거
      setTimeout(() => {
        const searchParams = new URLSearchParams();
        searchParams.set('redirect', '/report/management');
        navigate('/login?' + searchParams.toString());
      }, 100);
    }
  }, [isLoggedIn, navigate]);

  const filterStatus = (searchParams.get('status') ??
    'all') as ReportFilter['status'];
  const filterType = (searchParams.get('type') ??
    'all') as ReportFilter['type'];

  const { data, status } = useGetMyReports();

  const filteredApplications = data?.myReportInfos.filter((report) => {
    switch (filterType) {
      case 'all':
        return true;
      case 'resume':
        return report.reportType === 'RESUME';
      case 'personal_statement':
        return report.reportType === 'PERSONAL_STATEMENT';
      case 'portfolio':
        return report.reportType === 'PORTFOLIO';
    }
  });

  const alerted = useRef(false);

  useEffect(() => {
    if (status === 'success' && data.myReportInfos.length === 0) {
      if (alerted.current) {
        return;
      }
      alerted.current = true;
      window.alert(
        '서류 진단서 신청내역이 없습니다. 서류 진단서 신청페이지로 이동합니다.',
      );
      navigate('/report/landing');
    }
  }, [data?.myReportInfos.length, navigate, status]);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-10">
      <ReportHeader />
      <header className="my-3 flex items-center gap-2 text-xsmall16 font-bold">
        <h1>서류 진단서</h1>
        <Tooltip className="text-xxsmall12 font-normal">
          <p className="mb-1">진단서 발급 예상 소요기간</p>
          <ul className="mb-3 list-disc pl-4">
            <li>서류 진단서 (베이직): 최대 2일</li>
            <li>서류 진단서 (프리미엄) 최대 3일</li>
            <li>옵션 (현직자 피드백): 최대 5일</li>
          </ul>
          <p>
            *1:1 피드백은 진단서 발급 이후 진행됩니다. 일정확정 이후 변경이
            필요하실 경우, 우측 아래 &lt;채팅문의&gt;로 연락 주시길 바랍니다.
          </p>
        </Tooltip>
      </header>
      <div className="my-3 -ml-2 flex gap-2">
        {filters.map((filter) => (
          <NavLink
            key={filter.value}
            to={`?status=${filterStatus}&type=${filter.value}`}
            className={twMerge(
              'inline-flex h-9 items-center justify-center px-2 text-xsmall14 text-neutral-0/45 transition hover:text-neutral-0/85 active:text-neutral-0/85',
              filterType === filter.value && 'font-medium text-neutral-0',
            )}
          >
            {filter.label}
          </NavLink>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filteredApplications?.map((item) => {
          return (
            <div
              className="flex flex-col rounded-md border border-neutral-80 p-4"
              key={item.applicationId}
              data-application-id={item.applicationId}
              data-report-id={item.reportId}
              data-report-name={item.title}
            >
              <div>
                <header className="mb-3 flex items-center gap-2">
                  <Badge
                    status={convertReportStatusToBadgeStatus(
                      item.applicationStatus,
                    )}
                  >
                    {convertReportStatusToUserDisplayName(
                      item.applicationStatus,
                    )}
                  </Badge>
                  <h2 className="text-xsmall14 font-medium">{item.title}</h2>
                </header>
                <table className="mb-5">
                  <tbody>
                    <tr>
                      <td className="py-0.5 text-xxsmall12 font-medium text-neutral-30">
                        진단유형
                      </td>
                      <td className="py-0.5 pl-4 text-xxsmall12 font-medium text-neutral-50">
                        {convertReportTypeToDisplayName(item.reportType)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-0.5 text-xxsmall12 font-medium text-neutral-30">
                        신청일자
                      </td>
                      <td className="py-0.5 pl-4 text-xxsmall12 font-medium text-neutral-50">
                        {item.applicationTime.format('YYYY.MM.DD HH:mm')}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex items-center justify-between gap-4">
                  <div className="-ml-1 flex items-center gap-1">
                    {item.applyUrl ? (
                      <Link
                        to={item.applyUrl}
                        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          handleDownloadOrOpen(item.applyUrl);
                        }}
                        className="flex flex-col items-center gap-1 rounded-sm px-1 py-0.5 text-xxsmall12 text-neutral-40 transition hover:bg-neutral-0/5"
                      >
                        <DocIcon />
                        <span>제출서류</span>
                      </Link>
                    ) : null}

                    {item.recruitmentUrl ? (
                      <Link
                        to={item.recruitmentUrl}
                        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          handleDownloadOrOpen(item.applyUrl);
                        }}
                        className="flex flex-col items-center gap-1 rounded-sm px-1 py-0.5 text-xxsmall12 text-neutral-40 transition hover:bg-neutral-0/5"
                      >
                        <CompanyBagIcon />
                        <span>채용공고</span>
                      </Link>
                    ) : null}
                  </div>
                  {item.applicationStatus === 'APPLIED' ||
                  item.applicationStatus === 'REPORTING' ||
                  item.applicationStatus === 'REPORTED' ? (
                    <ReportManagementButton
                      className="max-w-40 flex-1"
                      disabled
                    >
                      진단서 확인하기
                    </ReportManagementButton>
                  ) : (
                    <ReportManagementButton
                      as={Link}
                      to={item.reportUrl || ''}
                      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        handleDownloadOrOpen(item.reportUrl);
                      }}
                      download
                      className="report_button_click max-w-40 flex-1"
                    >
                      진단서 확인하기
                    </ReportManagementButton>
                  )}
                </div>
              </div>
              {item.feedbackStatus ? (
                <>
                  <hr className="my-4 border-dashed border-neutral-80" />
                  <div>
                    <header className="mb-3 flex items-center gap-2">
                      <Badge
                        status={convertFeedbackStatusToBadgeStatus(
                          item.feedbackStatus,
                        )}
                      >
                        {convertFeedbackStatusToDisplayName(
                          item.feedbackStatus,
                        )}
                      </Badge>
                      <h3 className="text-xsmall14 font-medium text-primary-dark">
                        1:1 피드백 현황
                      </h3>
                    </header>
                    <table className="mb-5">
                      <tbody>
                        {/* 확인중 단계 일정 확인 */}
                        {item.feedbackStatus === 'PENDING' ||
                        item.feedbackStatus === 'APPLIED' ? (
                          <tr>
                            <td className="py-0.5 align-top text-xxsmall12 font-medium leading-5 text-neutral-30">
                              희망일자
                            </td>
                            <td className="py-0.5 pl-4 text-xxsmall12 font-medium leading-5 text-neutral-50">
                              {item.desiredDate1 ? (
                                <p>
                                  (1순위){' '}
                                  {item.desiredDate1.format('YYYY.MM.DD HH:mm')}
                                </p>
                              ) : null}
                              {item.desiredDate2 ? (
                                <p>
                                  (2순위){' '}
                                  {item.desiredDate2.format('YYYY.MM.DD HH:mm')}
                                </p>
                              ) : null}

                              {item.desiredDate3 ? (
                                <p>
                                  (3순위){' '}
                                  {item.desiredDate3.format('YYYY.MM.DD HH:mm')}
                                </p>
                              ) : null}
                            </td>
                          </tr>
                        ) : null}

                        {item.feedbackStatus === 'CONFIRMED' ||
                        item.feedbackStatus === 'COMPLETED' ? (
                          <tr>
                            <td className="py-0.5 align-top text-xxsmall12 font-medium leading-5 text-neutral-30">
                              {item.feedbackStatus === 'CONFIRMED'
                                ? '확정일자'
                                : '완료일자'}
                            </td>
                            <td className="py-0.5 pl-4 text-xxsmall12 font-medium leading-5 text-primary">
                              {item.confirmedTime?.format('YYYY.MM.DD HH:mm')}
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                    {item.feedbackStatus === 'APPLIED' ||
                    item.feedbackStatus === 'PENDING' ||
                    item.feedbackStatus === 'COMPLETED' ? (
                      <ReportManagementButton
                        className="feedback_button_click"
                        disabled
                      >
                        피드백 참여하기
                      </ReportManagementButton>
                    ) : (
                      <ReportManagementButton
                        className="feedback_button_click"
                        as={Link}
                        target="_blank"
                        to={item.zoomLink || ''}
                        rel="noreferrer"
                      >
                        피드백 참여하기
                      </ReportManagementButton>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="my-3">
        <Link
          to="/report/landing"
          className="add_button_click flex h-12 w-full items-center justify-center rounded-md border-2 border-primary bg-neutral-100 font-medium text-primary-dark transition hover:border-primary-light hover:bg-white"
        >
          추가 신청하기
        </Link>
      </div>
    </div>
  );
};

export default ReportManagementPage;
