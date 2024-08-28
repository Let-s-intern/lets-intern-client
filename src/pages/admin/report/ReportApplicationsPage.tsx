import dayjs from 'dayjs';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { uploadFile } from '../../../api/file';
import {
  convertReportApplicationsStatus,
  convertReportPriceType,
  reportApplicationsForAdminInfoType,
  useGetReportApplicationOptionsForAdmin,
  useGetReportApplicationsForAdmin,
  usePatchApplicationDocument,
} from '../../../api/report';
import DragDropModule from '../../../components/admin/report/DragDropModule';
import ActionButton from '../../../components/admin/ui/button/ActionButton';
import Header from '../../../components/admin/ui/header/Header';
import Heading from '../../../components/admin/ui/heading/Heading';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';
import Table from '../../../components/admin/ui/table/regacy/Table';
import TD from '../../../components/admin/ui/table/regacy/TD';
import TH from '../../../components/admin/ui/table/regacy/TH';

const ReportApplicationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  const [applicationModal, setApplicationModal] = useState<{
    application: reportApplicationsForAdminInfoType;
    type: 'PAYMENT_INFO' | 'UPLOAD';
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

  const { mutate: patchDocument } = usePatchApplicationDocument({
    successCallback: () => {
      setApplicationModal(null);
      setUploadedFile(null);
    },
    errorCallback: (error: Error) => {
      alert(error);
    },
  });

  const handleFileAdd = async (newFile: File | null) => {
    if (!newFile) return;

    const url = await uploadFile({
      file: newFile,
      type: 'REPORT',
      name: `${applicationModal?.application.applicationId}_report.pdf`,
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

  return (
    <div className="p-8 pt-16">
      <Header>
        <Heading>서류 진단서 참여자</Heading>
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
                            setApplicationModal({
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
                            setApplicationModal({
                              application,
                              type: 'UPLOAD',
                            })
                          }
                        >
                          진단서 업로드
                        </ActionButton>
                        {application.reportFileUrl && (
                          <ActionButton
                            bgColor="blue"
                            onClick={() => {
                              window.open(
                                application.reportFileUrl || '',
                                '_blank',
                              );
                            }}
                          >
                            진단서 확인
                          </ActionButton>
                        )}
                      </div>
                    </TD>
                    <TD>
                      {convertReportApplicationsStatus(
                        application.reportApplicationStatus,
                      )}
                    </TD>
                    <TD>
                      {dayjs(application.createDate).format('YYYY.MM.DD (dd)')}
                    </TD>
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
                  <h2 className="w-20 text-neutral-40">주문번호</h2>
                  <p>{applicationModal.application.orderId || '-'}</p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">결제상품</h2>
                  <p>
                    {convertReportPriceType(
                      applicationModal.application.reportPriceType || '-',
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
                  <p>
                    {applicationModal.application.reportFeedbackStatus
                      ? 'O'
                      : 'X'}
                  </p>
                </div>
                <hr />
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">쿠폰</h2>
                  <p>{applicationModal.application.couponTitle ?? '없음'}</p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">결제금액</h2>
                  <p>
                    {applicationModal.application.finalPrice?.toLocaleString() ||
                      '-'}
                  </p>
                </div>
                <div className="flex w-full gap-x-2">
                  <h2 className="w-20 text-neutral-40">환불여부</h2>
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
      </main>
    </div>
  );
};

export default ReportApplicationsPage;
