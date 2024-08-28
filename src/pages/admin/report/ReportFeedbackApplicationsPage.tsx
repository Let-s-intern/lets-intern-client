import dayjs from 'dayjs';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  convertReportFeedbackStatus,
  convertReportPriceType,
  reportApplicationsForAdminInfoType,
  useGetReportApplicationOptionsForAdmin,
  useGetReportApplicationsForAdmin,
} from '../../../api/report';
import ActionButton from '../../../components/admin/ui/button/ActionButton';
import Header from '../../../components/admin/ui/header/Header';
import Heading from '../../../components/admin/ui/heading/Heading';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';
import Table from '../../../components/admin/ui/table/regacy/Table';
import TD from '../../../components/admin/ui/table/regacy/TD';
import TH from '../../../components/admin/ui/table/regacy/TH';

const dateConverter = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD (dd) A HH:mm');
};

const ReportFeedbackApplicationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  const [modal, setModal] = useState<{
    application: reportApplicationsForAdminInfoType;
    type: 'PAYMENT_INFO' | 'SCHEDULE';
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetReportApplicationsForAdmin({
    reportId: Number(reportId),
    isApplyFeedback: true,
    pageable: {
      page: currentPage,
      size: 10,
    },
    enabled: !!reportId,
  });

  const {
    data: optionsData,
    isLoading: optionsDataIsLoading,
    isError: optionsDataIsError,
  } = useGetReportApplicationOptionsForAdmin({
    applicationId: modal?.application.applicationId,
    enabled: !!modal?.application.applicationId,
  });

  const getProgressDate = (application: reportApplicationsForAdminInfoType) => {
    const desiredDateType = application.desiredDateType;

    switch (desiredDateType) {
      case 'DESIRED_DATE_1':
        return application.desiredDate1
          ? dateConverter(application.desiredDate1)
          : '-';
      case 'DESIRED_DATE_2':
        return application.desiredDate2
          ? dateConverter(application.desiredDate2)
          : '-';
      case 'DESIRED_DATE_3':
        return application.desiredDate3
          ? dateConverter(application.desiredDate3)
          : '-';
      case 'DESIRED_DATE_ADMIN':
        return application.desiredDateAdmin
          ? dateConverter(application.desiredDateAdmin)
          : '-';
      default:
        return '-';
    }
  };

  return (
    <div className="p-8 pt-16">
      <Header>
        <Heading>1:1 첨삭 참여자</Heading>
      </Header>
      <main>
        {isLoading ? (
          <div className="py-4 text-center">로딩 중...</div>
        ) : isError ? (
          <div className="py-4 text-center">에러 발생</div>
        ) : !data || data.pageInfo.totalElements === 0 ? (
          <div className="py-4 text-center">참여자가 없습니다.</div>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <TH>환불여부</TH>
                  <TH>이름</TH>
                  <TH>이메일</TH>
                  <TH>전화번호</TH>
                  <TH>희망직무</TH>
                  <TH>고민지점</TH>
                  <TH>서류</TH>
                  <TH>채용공고</TH>
                  <TH>관리</TH>
                  <TH>상태</TH>
                  <TH>신청일자</TH>
                  <TH>진행일자</TH>
                </tr>
              </thead>
              <tbody>
                {data.reportApplicationsForAdminInfos.map((application) => (
                  <tr key={application.applicationId}>
                    <TD>{application.isRefunded ? 'O' : 'X'}</TD>
                    <TD>{application.name}</TD>
                    <TD>{application.contactEmail}</TD>
                    <TD>{application.phoneNumber}</TD>
                    <TD>{application.wishJob || '-'}</TD>
                    <TD>
                      <p className="whitespace-normal break-all">
                        {application.message || '-'}
                      </p>
                    </TD>
                    <TD>
                      {application.applyFileUrl ? (
                        <a
                          className={`${application.applyFileUrl ? 'text-blue-500 underline-offset-4 hover:underline' : 'text-gray-400'}`}
                          href={application.applyFileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          서류
                        </a>
                      ) : (
                        '-'
                      )}
                    </TD>
                    <TD>
                      {application.recruitmentFileUrl ? (
                        <a
                          className={`${application.recruitmentFileUrl ? 'text-blue-500 underline-offset-4 hover:underline' : 'text-gray-400'}`}
                          href={application.recruitmentFileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          채용공고
                        </a>
                      ) : (
                        '-'
                      )}
                    </TD>
                    <TD>
                      <div className="flex justify-center gap-2">
                        <ActionButton
                          bgColor="lightBlue"
                          onClick={() =>
                            setModal({
                              application,
                              type: 'PAYMENT_INFO',
                            })
                          }
                        >
                          결제정보
                        </ActionButton>
                        <ActionButton
                          bgColor="green"
                          onClick={() =>
                            setModal({
                              application,
                              type: 'SCHEDULE',
                            })
                          }
                        >
                          일정선택
                        </ActionButton>
                        {application.zoomLink !== null && (
                          <ActionButton
                            bgColor="blue"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                application.zoomLink || '',
                              );
                              alert('클립보드에 복사되었습니다.');
                            }}
                          >
                            ZOOM
                          </ActionButton>
                        )}
                      </div>
                    </TD>
                    <TD>
                      {convertReportFeedbackStatus(
                        application.reportFeedbackStatus || '-',
                      )}
                    </TD>
                    <TD>
                      {application.createDate
                        ? dayjs(application.createDate).format(
                            'YYYY.MM.DD (dd)',
                          )
                        : '-'}
                    </TD>
                    <TD>{getProgressDate(application)}</TD>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="mt-4">
              <AdminPagination
                maxPage={data.pageInfo.totalPages}
                pageNum={currentPage}
                setPageNum={setCurrentPage}
              />
            </div>
          </>
        )}
        {modal?.type === 'PAYMENT_INFO' && (
          <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black/10">
            <div className="flex min-h-64 min-w-96 flex-col justify-center rounded-sm bg-white px-8 py-6">
              <h1 className="text-lg font-bold">결제정보</h1>
              <div className="mt-5 flex w-full flex-col gap-y-3 text-xsmall14">
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">주문번호</h2>
                  <p>{modal.application.orderId || '-'}</p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">결제상품</h2>
                  <p>
                    {convertReportPriceType(
                      modal.application.reportPriceType || '-',
                    )}
                  </p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">옵션</h2>
                  <div>
                    {optionsDataIsLoading
                      ? '로딩 중...'
                      : optionsDataIsError
                        ? '에러 발생'
                        : !optionsData ||
                            optionsData.reportApplicationOptionForAdminInfos
                              .length === 0
                          ? '없음'
                          : optionsData.reportApplicationOptionForAdminInfos.map(
                              (option) => (
                                <p key={option.reportApplicationOptionId}>
                                  {option.title}
                                </p>
                              ),
                            )}
                  </div>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">1:1 첨삭</h2>
                  <p>{modal.application.reportFeedbackStatus ? 'O' : 'X'}</p>
                </div>
                <hr />
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">쿠폰</h2>
                  <p>{modal.application.couponTitle ?? '-'}</p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">결제금액</h2>
                  <p>{modal.application.finalPrice?.toLocaleString() || '-'}</p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">환불여부</h2>
                  <p>{modal.application.isRefunded ? 'O' : 'X'}</p>
                </div>
              </div>
              <div className="mt-5 flex w-full items-center justify-end">
                <button
                  onClick={() => setModal(null)}
                  className="text-xxsmall12 text-neutral-40"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportFeedbackApplicationsPage;
