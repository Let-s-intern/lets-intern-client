import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  convertReportFeedbackStatus,
  convertReportPriceType,
  reportApplicationsForAdminInfoType,
  ReportFeedbackStatus,
  ReportPriceType,
  useGetReportApplicationOptionsForAdmin,
  useGetReportApplicationsForAdmin,
  useGetReportDetailAdminQuery,
  usePatchReportApplicationSchedule,
} from '../../../api/report';
import ActionButton from '../../../components/admin/ui/button/ActionButton';
import Header from '../../../components/admin/ui/header/Header';
import Heading from '../../../components/admin/ui/heading/Heading';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';
import Table from '../../../components/admin/ui/table/regacy/Table';
import TD from '../../../components/admin/ui/table/regacy/TD';
import TH from '../../../components/admin/ui/table/regacy/TH';
import CheckBox from '../../../components/common/auth/ui/CheckBox';

const totalDateConverter = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD (dd) A hh:mm');
};
const dateConverter = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD');
};

const timeConverter = (date: string) => {
  return dayjs(date).format('A hh:00');
};

const getProgressDate = (application: reportApplicationsForAdminInfoType) => {
  const desiredDateType = application.desiredDateType;

  switch (desiredDateType) {
    case 'DESIRED_DATE_1':
      return application.desiredDate1
        ? totalDateConverter(application.desiredDate1)
        : '-';
    case 'DESIRED_DATE_2':
      return application.desiredDate2
        ? totalDateConverter(application.desiredDate2)
        : '-';
    case 'DESIRED_DATE_3':
      return application.desiredDate3
        ? totalDateConverter(application.desiredDate3)
        : '-';
    case 'DESIRED_DATE_ADMIN':
      return application.desiredDateAdmin
        ? totalDateConverter(application.desiredDateAdmin)
        : '-';
    default:
      return '-';
  }
};

const ReportFeedbackApplicationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  const [modal, setModal] = useState<{
    application: reportApplicationsForAdminInfoType;
    type: 'PAYMENT_INFO' | 'SCHEDULE';
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [adminChangeDate, setAdminChangeDate] = useState<Dayjs>(dayjs());
  const [adminChangeTime, setAdminChangeTime] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<{
    type:
      | 'DESIRED_DATE_1'
      | 'DESIRED_DATE_2'
      | 'DESIRED_DATE_3'
      | 'DESIRED_DATE_ADMIN';
    date: string;
  } | null>(null);

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

  const { mutate: trySubmitSchedule } = usePatchReportApplicationSchedule({
    successCallback: () => {
      setAdminChangeDate(dayjs());
      setAdminChangeTime(dayjs());
      setSelectedDate(null);
      alert('일정이 저장되었습니다.');
      setModal(null);
    },
    errorCallback: (error: Error) => {
      console.error(error);
      alert('일정 저장에 실패했습니다.');
    },
  });

  const handleSubmitSchedule = () => {
    if (!selectedDate) {
      alert('일정을 선택해주세요.');
      return;
    }

    trySubmitSchedule({
      reportId: Number(reportId),
      applicationId: modal?.application.applicationId || 0,
      desiredDateType: selectedDate.type,
      desiredDateAdmin:
        selectedDate.type === 'DESIRED_DATE_ADMIN'
          ? selectedDate.date + 'Z'
          : undefined,
    });
  };

  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);

  const { data: reportDetail } = useGetReportDetailAdminQuery(Number(reportId));

  return (
    <div className="p-8 pt-16">
      <Header>
        <Heading>[{reportDetail?.title}] 1:1 피드백 참여자</Heading>
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
                  <TH>ID</TH>
                  <TH>신청일시</TH>
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
                  <TH>진행일자</TH>
                </tr>
              </thead>
              <tbody>
                {data.reportApplicationsForAdminInfos.map((application) => (
                  <tr key={application.applicationId}>
                    <TD>{application.applicationId}</TD>
                    <TD>
                      {application.createDate ? (
                        <p>
                          {dayjs(application.createDate).format(
                            'YYYY.MM.DD (dd)',
                          )}
                          <br></br>
                          {dayjs(application.createDate).format('HH:mm')}
                        </p>
                      ) : (
                        '-'
                      )}
                    </TD>
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
                          onClick={() => {
                            setModal({
                              application,
                              type: 'SCHEDULE',
                            });
                            if (application.desiredDateAdmin) {
                              setAdminChangeDate(
                                dayjs(application.desiredDateAdmin),
                              );
                              setAdminChangeTime(
                                dayjs(application.desiredDateAdmin),
                              );
                            }
                          }}
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
                        (application.reportFeedbackStatus as ReportFeedbackStatus) ||
                          '-',
                      )}
                      <div className="mt-2 flex items-center justify-center">
                        <ActionButton
                          bgColor="blue"
                          onClick={() => {
                            trySubmitSchedule({
                              reportId: Number(reportId),
                              applicationId: application.applicationId,
                              reportFeedbackStatus: 'CONFIRMED',
                            });
                          }}
                          disabled={
                            application.reportFeedbackStatus !== 'PENDING'
                          }
                        >
                          일정 확정하기
                        </ActionButton>
                      </div>
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
                      (modal.application.reportPriceType as ReportPriceType) ||
                        '-',
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
                  <h2 className="w-20 text-neutral-40">1:1 피드백</h2>
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
        {modal?.type === 'SCHEDULE' && (
          <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black/10">
            <div className="flex min-h-64 min-w-96 flex-col justify-center gap-y-5 rounded-sm bg-white px-8 py-6">
              <h1 className="text-lg font-bold">일정 선택</h1>
              <div className="mt-5 flex w-full flex-col gap-y-5 text-xsmall14">
                <h2 className="w-20 font-semibold">제출 일정</h2>
                <div className="flex grow flex-col gap-y-4">
                  {modal.application.desiredDate1 && (
                    <div className="flex items-center justify-center gap-x-10">
                      <h3 className="w-20 text-xsmall16 font-medium text-neutral-40">
                        희망 1순위
                      </h3>
                      <div className="flex items-center justify-center gap-x-2.5">
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {dateConverter(modal.application.desiredDate1)}
                        </p>
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {timeConverter(modal.application.desiredDate1)}
                        </p>
                      </div>
                      <CheckBox
                        checked={
                          selectedDate?.type === 'DESIRED_DATE_1' &&
                          selectedDate.date === modal.application.desiredDate1
                        }
                        onClick={() =>
                          setSelectedDate({
                            type: 'DESIRED_DATE_1',
                            date: modal.application.desiredDate1 || '',
                          })
                        }
                      />
                    </div>
                  )}
                  {modal.application.desiredDate2 && (
                    <div className="flex items-center justify-center gap-x-10">
                      <h3 className="w-20 text-xsmall16 font-medium text-neutral-40">
                        희망 2순위
                      </h3>
                      <div className="flex items-center justify-center gap-x-2.5">
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {dateConverter(modal.application.desiredDate2)}
                        </p>
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {timeConverter(modal.application.desiredDate2)}
                        </p>
                      </div>
                      <CheckBox
                        checked={
                          selectedDate?.type === 'DESIRED_DATE_2' &&
                          selectedDate.date === modal.application.desiredDate2
                        }
                        onClick={() =>
                          setSelectedDate({
                            type: 'DESIRED_DATE_2',
                            date: modal.application.desiredDate2 || '',
                          })
                        }
                      />
                    </div>
                  )}
                  {modal.application.desiredDate3 && (
                    <div className="flex items-center justify-center gap-x-10">
                      <h3 className="w-20 text-xsmall16 font-medium text-neutral-40">
                        희망 3순위
                      </h3>
                      <div className="flex items-center justify-center gap-x-2.5">
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {dateConverter(modal.application.desiredDate3)}
                        </p>
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {timeConverter(modal.application.desiredDate3)}
                        </p>
                      </div>
                      <CheckBox
                        checked={
                          selectedDate?.type === 'DESIRED_DATE_3' &&
                          selectedDate.date === modal.application.desiredDate3
                        }
                        onClick={() =>
                          setSelectedDate({
                            type: 'DESIRED_DATE_3',
                            date: modal.application.desiredDate3 || '',
                          })
                        }
                      />
                    </div>
                  )}
                  {(modal.application.desiredDate1 ||
                    modal.application.desiredDate2 ||
                    modal.application.desiredDate3) && <hr />}

                  <div className="flex items-center justify-center gap-x-10">
                    <h3 className="w-20 text-xsmall16 font-medium text-neutral-40">
                      운영진 변경
                    </h3>
                    <div className="flex items-center justify-center gap-x-2.5">
                      <DatePicker
                        format="YYYY.MM.DD"
                        sx={{
                          width: '180px',
                          height: '3rem',
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#EDEEFE', // 기본 상태의 border 색상 설정
                            },
                            '&:hover fieldset': {
                              borderColor: '#A9C1FF', // 마우스 오버 상태의 border 색상 설정
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#757BFF', // 포커스 상태의 border 색상 설정
                            },
                          },
                          '& .MuiInputBase-input': {
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                            paddingTop: '0.75rem',
                            paddingBottom: '0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: 400,
                            textAlign: 'center',
                          },
                        }}
                        slotProps={{
                          textField: {
                            InputProps: {
                              sx: {
                                width: '180px',
                                height: '3rem',
                              },
                            },
                          },
                        }}
                        value={adminChangeDate}
                        onChange={(date) => {
                          if (!date) return;
                          setAdminChangeDate(date);
                        }}
                      />
                      <TimePicker
                        format="A hh:00"
                        views={['hours']}
                        sx={{
                          width: '180px',
                          height: '3rem',
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#EDEEFE', // 기본 상태의 border 색상 설정
                            },
                            '&:hover fieldset': {
                              borderColor: '#A9C1FF', // 마우스 오버 상태의 border 색상 설정
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#757BFF', // 포커스 상태의 border 색상 설정
                            },
                          },
                          '& .MuiInputBase-input': {
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                            paddingTop: '0.75rem',
                            paddingBottom: '0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: 400,
                          },
                        }}
                        slotProps={{
                          textField: {
                            InputProps: {
                              sx: {
                                width: '180px',
                                height: '3rem',
                              },
                            },
                          },
                        }}
                        value={adminChangeTime}
                        onChange={(time) => {
                          if (!time) return;
                          setAdminChangeTime(time);
                        }}
                      />
                    </div>
                    <CheckBox
                      checked={
                        selectedDate?.type === 'DESIRED_DATE_ADMIN' &&
                        selectedDate.date ===
                          adminChangeDate.format('YYYY-MM-DD') +
                            'T' +
                            adminChangeTime.format('HH:00:00.000')
                      }
                      onClick={() => {
                        setSelectedDate({
                          type: 'DESIRED_DATE_ADMIN',
                          date:
                            adminChangeDate.format('YYYY-MM-DD') +
                            'T' +
                            adminChangeTime.format('HH:00:00.000'),
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 flex w-full items-center justify-end gap-x-4">
                <button
                  onClick={() => {
                    setModal(null);
                    setAdminChangeDate(dayjs());
                    setAdminChangeTime(dayjs());
                    setSelectedDate(null);
                  }}
                  className="rounded-sm bg-neutral-80 px-4 py-2 text-xxsmall12 font-bold text-neutral-40"
                >
                  닫기
                </button>
                <button
                  onClick={handleSubmitSchedule}
                  className="rounded-sm bg-primary px-4 py-2 text-xxsmall12 font-bold text-white"
                >
                  저장
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
