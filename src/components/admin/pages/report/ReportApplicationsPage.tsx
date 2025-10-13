'use client';

import dayjs from '@/lib/dayjs';
import { Button, MenuItem, Select } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useState } from 'react';

import { uploadFile } from '@/api/file';
import {
  convertFeedbackStatusToDisplayName,
  convertReportApplicationsStatus,
  convertReportPriceType,
  reportApplicationsForAdminInfoType,
  ReportApplicationStatus,
  ReportPriceType,
  useGetReportApplicationOptionsForAdmin,
  useGetReportApplicationsForAdmin,
  useGetReportDetailAdminQuery,
  usePatchApplicationDocument,
  usePatchApplicationStatus,
  usePatchReportApplicationSchedule,
} from '@/api/report';
import DragDropModule from '@/components/admin/report/DragDropModule';
import ActionButton from '@/components/admin/ui/button/ActionButton';
import Header from '@/components/admin/ui/header/Header';
import Heading from '@/components/admin/ui/heading/Heading';
import AdminPagination from '@/components/admin/ui/pagination/AdminPagination';
import Table from '@/components/admin/ui/table/regacy/Table';
import TD from '@/components/admin/ui/table/regacy/TD';
import TH from '@/components/admin/ui/table/regacy/TH';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { generateRandomString } from '@/utils/random';
import CheckBox from '@components/common/ui/CheckBox';
import { useSearchParams } from 'next/navigation';

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

const reportApplicatoinsStatusList: {
  value: ReportApplicationStatus;
  label: string;
}[] = [
  {
    value: 'APPLIED',
    label: '1.' + convertReportApplicationsStatus('APPLIED'),
  },
  {
    value: 'REPORTING',
    label: '2.' + convertReportApplicationsStatus('REPORTING'),
  },
  {
    value: 'REPORTED',
    label: '3.' + convertReportApplicationsStatus('REPORTED'),
  },
  {
    value: 'COMPLETED',
    label: '4.' + convertReportApplicationsStatus('COMPLETED'),
  },
];

const ReportApplicationsPage = () => {
  const searchParams = useSearchParams();
  const { snackbar: setSnackbar } = useAdminSnackbar();

  const reportId = searchParams.get('reportId');
  const [applicationModal, setApplicationModal] = useState<{
    application: reportApplicationsForAdminInfoType;
    type: 'PAYMENT_INFO' | 'UPLOAD' | 'SCHEDULE';
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetReportApplicationsForAdmin({
    reportId: Number(reportId),
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
    applicationId: applicationModal?.application.applicationId,
    enabled: !!applicationModal?.application.applicationId,
  });

  const { data: reportDetail } = useGetReportDetailAdminQuery(Number(reportId));

  console.log('서류 진단 상세:', reportDetail);
  console.log('ADMIN 서류 신청:', data);

  const { mutate: patchDocument } = usePatchApplicationDocument({
    successCallback: () => {
      setApplicationModal(null);
      setUploadedFile(null);
      setSnackbar('진단서가 업로드되었습니다.');
    },
    errorCallback: (error: Error) => {
      alert(error);
    },
  });

  const { mutateAsync: patchStatus } = usePatchApplicationStatus({
    successCallback() {
      setSnackbar('상태가 변경되었습니다.');
    },
    errorCallback(error) {
      alert(error);
    },
  });

  const handleFileAdd = async (newFile: File | null) => {
    if (!newFile) return;

    const url = await uploadFile({
      file: newFile,
      type: 'REPORT',
      name: `${generateRandomString(7)}_${applicationModal?.application.applicationId}_report.pdf`,
    });

    setUploadedFile(url);
  };

  const handleDocumentPatch = () => {
    if (!uploadedFile || !applicationModal?.application) return;

    patchDocument({
      applicationId: applicationModal.application.applicationId,
      reportUrl: uploadedFile,
    });
  };

  const [adminChangeDate, setAdminChangeDate] = useState(dayjs());
  const [adminChangeTime, setAdminChangeTime] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<{
    type:
      | 'DESIRED_DATE_1'
      | 'DESIRED_DATE_2'
      | 'DESIRED_DATE_3'
      | 'DESIRED_DATE_ADMIN';
    date: string;
  } | null>(null);

  const { mutate: trySubmitSchedule } = usePatchReportApplicationSchedule({
    successCallback: () => {
      setAdminChangeDate(dayjs());
      setAdminChangeTime(dayjs());
      setSelectedDate(null);
      alert('일정이 저장되었습니다.');
      setApplicationModal(null);
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
      applicationId: applicationModal?.application.applicationId || 0,
      desiredDateType: selectedDate.type,
      desiredDateAdmin:
        selectedDate.type === 'DESIRED_DATE_ADMIN'
          ? selectedDate.date + 'Z'
          : undefined,
    });
  };

  return (
    <div className="p-8 pt-16">
      <Header>
        <Heading>[{reportDetail?.title}] 서류 진단서 참여자</Heading>
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
                  <TH colspan={13}>공통</TH>
                  <TH colspan={2} backgroundColor="#ffff00">
                    서류진단
                  </TH>
                  <TH colspan={3} backgroundColor="#00ffff">
                    1:1 온라인 상담
                  </TH>
                </tr>
                <tr>
                  <TH>주문번호</TH>
                  {/* TODO: 환불여부를 서류진단과 1:1 온라인 상담 각각 표시 */}
                  <TH>환불여부</TH>
                  <TH>ID</TH>
                  <TH>신청일시</TH>
                  <TH>이름</TH>
                  <TH>이메일</TH>
                  <TH>전화번호</TH>
                  <TH>희망직무</TH>
                  <TH>고민지점</TH>
                  <TH>서류</TH>
                  <TH>채용공고</TH>
                  <TH>결제정보</TH>
                  <TH>결제케이스</TH>
                  {/* 서류진단 전용 */}
                  <TH backgroundColor="#ffff00">관리</TH>
                  <TH backgroundColor="#ffff00">상태</TH>
                  {/* 1:1 온라인 상담 전용 */}
                  <TH backgroundColor="#00ffff">관리</TH>
                  <TH backgroundColor="#00ffff">상태</TH>
                  <TH backgroundColor="#00ffff">진행일시</TH>
                </tr>
              </thead>
              <tbody>
                {data.reportApplicationsForAdminInfos.map((application) => (
                  <tr key={application.applicationId}>
                    <TD>
                      <p>{application.orderId}</p>
                      <p>
                        {/* 운영기준 */}
                        <a
                          href={`https://dashboard.tosspayments.com/payments-browse/tm/963616/card?keyword=${application.orderId}`}
                          className="text-gray-400 underline transition hover:text-gray-300"
                          target="_blank"
                          rel="noreferrer"
                        >
                          카드검색
                        </a>{' '}
                        <a
                          href={`https://dashboard.tosspayments.com/payments-browse/tm/963616/transfer?keyword=${application.orderId}`}
                          target="_blank"
                          className="text-gray-400 underline transition hover:text-gray-300"
                          rel="noreferrer"
                        >
                          이체검색
                        </a>
                      </p>
                    </TD>
                    <TD>{application.isRefunded ? 'O' : 'X'}</TD>
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
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() =>
                          setApplicationModal({
                            application,
                            type: 'PAYMENT_INFO',
                          })
                        }
                      >
                        보기
                      </Button>
                    </TD>
                    <TD>
                      {application.submitType === 'LATE'
                        ? '후제출'
                        : '동시제출'}
                    </TD>
                    <TD>
                      <div className="flex gap-2">
                        <ActionButton
                          bgColor="green"
                          // 선결제 후제출
                          disabled={!application.applyFileUrl}
                          onClick={() =>
                            setApplicationModal({
                              application,
                              type: 'UPLOAD',
                            })
                          }
                        >
                          진단서 업로드
                        </ActionButton>
                        {application.reportFileUrl ? (
                          <ActionButton
                            bgColor="blue"
                            onClick={() => {
                              window.open(
                                application.reportFileUrl || '',
                                '_blank',
                              );
                            }}
                          >
                            진단서 보기
                          </ActionButton>
                        ) : (
                          <ActionButton disabled>진단서 보기</ActionButton>
                        )}
                      </div>
                    </TD>
                    <TD>
                      <Select
                        value={application.reportApplicationStatus}
                        onChange={async (event) => {
                          const newStatus = event.target
                            .value as ReportApplicationStatus;
                          if (
                            window.confirm(
                              `
                              ${application.name} 님의 상태를 변경합니다. \n정말로 ${convertReportApplicationsStatus(application.reportApplicationStatus)} → ${convertReportApplicationsStatus(
                                newStatus,
                              )}로 바꾸시겠습니까?`,
                            )
                          ) {
                            await patchStatus({
                              applicationId: application.applicationId,
                              reportApplicationStatus: newStatus,
                            });
                          } else {
                            event.target.value =
                              application.reportApplicationStatus;
                          }
                        }}
                        variant="outlined"
                        sx={{
                          '&': {
                            fontSize: '0.825rem',
                          },
                        }}
                        size="small"
                      >
                        {reportApplicatoinsStatusList.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </TD>

                    <TD>
                      {application.reportFeedbackStatus ? (
                        <div className="flex justify-center gap-2">
                          <ActionButton
                            bgColor="green"
                            // 선결제 후제출
                            disabled={!application.applyFileUrl}
                            onClick={() => {
                              setApplicationModal({
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
                          {application.zoomLink !== null ? (
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
                          ) : (
                            <ActionButton disabled>ZOOM</ActionButton>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TD>
                    <TD>
                      {/* TODO: 어드민 서류 제출 상태 반영하여 status 표시 */}
                      {application.reportFeedbackStatus
                        ? convertFeedbackStatusToDisplayName({
                            status: application.reportFeedbackStatus,
                            now: dayjs(),
                            // TODO: reportApplicationsForAdminInfos에 reportDesiredDate 추가
                            reportFeedback: null,
                            isAdmin: true,
                            isReportSubmitted: application.applyFileUrl !== '',
                          })
                        : null}
                      {application.reportFeedbackStatus ? (
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
                      ) : (
                        '-'
                      )}
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
        {applicationModal?.type === 'PAYMENT_INFO' && (
          <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black/10">
            <div className="flex min-h-64 min-w-96 flex-col justify-center rounded-sm bg-white px-8 py-6">
              <h1 className="text-lg font-bold">결제정보</h1>
              <div className="mt-5 flex w-full flex-col gap-y-3 text-xsmall14">
                <div className="flex w-full gap-x-2">
                  <h2 className="w-24 text-neutral-40">주문번호</h2>
                  <p>{applicationModal.application.orderId || '-'}</p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-24 text-neutral-40">결제상품</h2>
                  <p>
                    {convertReportPriceType(
                      (applicationModal.application
                        .reportPriceType as ReportPriceType) || '-',
                    )}
                  </p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-24 text-neutral-40">옵션</h2>
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
                  <h2 className="w-24 text-neutral-40">1:1 온라인 상담</h2>
                  <p>
                    {applicationModal.application.reportFeedbackStatus
                      ? 'O'
                      : 'X'}
                  </p>
                </div>
                <hr />
                <div className="flex w-full gap-x-2">
                  <h2 className="w-24 text-neutral-40">쿠폰</h2>
                  <p>{applicationModal.application.couponTitle ?? '없음'}</p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-24 text-neutral-40">결제금액</h2>
                  <p>
                    {applicationModal.application.finalPrice?.toLocaleString() ||
                      '-'}
                  </p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-24 text-neutral-40">환불여부</h2>
                  <p>{applicationModal.application.isRefunded ? 'O' : 'X'}</p>
                </div>
              </div>
              <div className="mt-5 flex w-full items-center justify-end">
                <button
                  onClick={() => setApplicationModal(null)}
                  className="text-xxsmall12 text-neutral-40"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
        {applicationModal?.type === 'UPLOAD' && (
          <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black/10">
            <div className="flex min-h-64 w-1/3 flex-col justify-center gap-y-5 rounded-sm bg-white px-8 py-6">
              <h1 className="text-lg font-bold">진단서 업로드</h1>
              {uploadedFile ? (
                <div className="flex w-full gap-x-4 rounded-sm bg-neutral-95 px-3 py-4">
                  <p className="grow truncate">
                    {applicationModal.application.name + '_진단서.pdf'}
                  </p>
                  <img
                    className="cursor-pointer"
                    src="/icons/x.svg"
                    alt="close"
                    onClick={() => setUploadedFile(null)}
                    width={24}
                    height={24}
                  />
                </div>
              ) : (
                <div className="flex w-full flex-col">
                  <DragDropModule onFileAdd={handleFileAdd} />
                </div>
              )}
              <div className="mt-5 flex w-full items-center justify-end gap-x-4">
                <button
                  onClick={() => {
                    setApplicationModal(null);
                    setUploadedFile(null);
                  }}
                  className="rounded-sm bg-neutral-80 px-4 py-2 text-xxsmall12 font-bold text-neutral-40"
                >
                  닫기
                </button>
                <button
                  onClick={handleDocumentPatch}
                  className="rounded-sm bg-primary px-4 py-2 text-xxsmall12 font-bold text-white"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}

        {applicationModal?.type === 'SCHEDULE' && (
          <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black/10">
            <div className="flex min-h-64 min-w-96 flex-col justify-center gap-y-5 rounded-sm bg-white px-8 py-6">
              <h1 className="text-lg font-bold">일정 선택</h1>
              <div className="mt-5 flex w-full flex-col gap-y-5 text-xsmall14">
                <h2 className="w-20 font-semibold">제출 일정</h2>
                <div className="flex grow flex-col gap-y-4">
                  {applicationModal.application.desiredDate1 && (
                    <div className="flex items-center justify-center gap-x-10">
                      <h3 className="w-20 text-xsmall16 font-medium text-neutral-40">
                        희망 1순위
                      </h3>
                      <div className="flex items-center justify-center gap-x-2.5">
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {dateConverter(
                            applicationModal.application.desiredDate1,
                          )}
                        </p>
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {timeConverter(
                            applicationModal.application.desiredDate1,
                          )}
                        </p>
                      </div>
                      <CheckBox
                        checked={
                          selectedDate?.type === 'DESIRED_DATE_1' &&
                          selectedDate.date ===
                            applicationModal.application.desiredDate1
                        }
                        onClick={() =>
                          setSelectedDate({
                            type: 'DESIRED_DATE_1',
                            date:
                              applicationModal.application.desiredDate1 || '',
                          })
                        }
                      />
                    </div>
                  )}
                  {applicationModal.application.desiredDate2 && (
                    <div className="flex items-center justify-center gap-x-10">
                      <h3 className="w-20 text-xsmall16 font-medium text-neutral-40">
                        희망 2순위
                      </h3>
                      <div className="flex items-center justify-center gap-x-2.5">
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {dateConverter(
                            applicationModal.application.desiredDate2,
                          )}
                        </p>
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {timeConverter(
                            applicationModal.application.desiredDate2,
                          )}
                        </p>
                      </div>
                      <CheckBox
                        checked={
                          selectedDate?.type === 'DESIRED_DATE_2' &&
                          selectedDate.date ===
                            applicationModal.application.desiredDate2
                        }
                        onClick={() =>
                          setSelectedDate({
                            type: 'DESIRED_DATE_2',
                            date:
                              applicationModal.application.desiredDate2 || '',
                          })
                        }
                      />
                    </div>
                  )}
                  {applicationModal.application.desiredDate3 && (
                    <div className="flex items-center justify-center gap-x-10">
                      <h3 className="w-20 text-xsmall16 font-medium text-neutral-40">
                        희망 3순위
                      </h3>
                      <div className="flex items-center justify-center gap-x-2.5">
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {dateConverter(
                            applicationModal.application.desiredDate3,
                          )}
                        </p>
                        <p className="w-[180px] rounded-xs border border-primary-10 px-4 py-3 text-center">
                          {timeConverter(
                            applicationModal.application.desiredDate3,
                          )}
                        </p>
                      </div>
                      <CheckBox
                        checked={
                          selectedDate?.type === 'DESIRED_DATE_3' &&
                          selectedDate.date ===
                            applicationModal.application.desiredDate3
                        }
                        onClick={() =>
                          setSelectedDate({
                            type: 'DESIRED_DATE_3',
                            date:
                              applicationModal.application.desiredDate3 || '',
                          })
                        }
                      />
                    </div>
                  )}
                  {(applicationModal.application.desiredDate1 ||
                    applicationModal.application.desiredDate2 ||
                    applicationModal.application.desiredDate3) && <hr />}

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
                    setApplicationModal(null);
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

export default ReportApplicationsPage;
