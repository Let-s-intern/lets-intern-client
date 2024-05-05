import { useState } from 'react';
import { useParams } from 'react-router-dom';

import ActionButton from '../../../ui/button/ActionButton';
import axios from '../../../../../utils/axios';
import parseInflowPath from '../../../../../utils/parseInflowPath';
import parseGrade from '../../../../../utils/parseGrade';
import {
  applicationStatusToText,
  wishJobToText,
} from '../../../../../utils/convert';

interface Props {
  applications: any;
  program: any;
  sizePerPage: number;
  maxPage: number;
}

const GeneralActionDropdown = ({
  applications,
  program,
  sizePerPage,
  maxPage,
}: Props) => {
  const params = useParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDownloadList = async (
    isApproved: boolean,
    column: 'EMAIL' | 'PHONE',
  ) => {
    let allApplications: any[] = [];
    for (let pageNum = 1; pageNum <= maxPage; pageNum++) {
      const res = await axios.get(`/application/admin/${params.programId}`, {
        params: {
          page: pageNum,
          size: sizePerPage,
        },
      });
      allApplications = [...allApplications, ...res.data.applicationList];
    }
    const emailList = isApproved
      ? allApplications
          .filter(
            (application: any) =>
              application.application.status === 'IN_PROGRESS',
          )
          .map((application: any) => {
            if (column === 'EMAIL') {
              return application.application.email;
            }
            return application.application.phoneNum;
          })
      : allApplications
          .filter(
            (application: any) =>
              application.application.status === 'APPLIED_NOT_APPROVED',
          )
          .map((application: any) => {
            if (column === 'EMAIL') {
              return application.application.email;
            }
            return application.application.phoneNum;
          });
    const label =
      column === 'EMAIL' ? '이메일' : column === 'PHONE' && '전화번호';
    const subject =
      (isApproved ? `참가확정 ${label} 목록` : `미선발 ${label} 목록`) +
      ' - ' +
      program.title;
    const emailString = subject + '\n' + emailList.join('\n');
    downloadFile(subject + '.txt', emailString);
    setIsMenuOpen(false);
  };

  const downloadFile = (fileName: string, fileContent: string) => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csv = getCSV();
    downloadCSVFile(csv);
  };

  const getCSV = () => {
    const csv: any = [];
    csv.push(
      `구분,유입경로,이메일 주소,이름,휴대폰 번호,학교,학년,전공,쿠폰명,입금 예정 금액,환급계좌번호,입금 여부,희망직무,희망기업형태,신청자 답변, 온/오프라인 여부,참가여부,신청일자,사전질문`,
    );
    applications.forEach((application: any) => {
      const row = [];
      row.push(
        application.application.type === 'USER'
          ? '회원'
          : application.application.type === 'GUEST' && '비회원',
        parseInflowPath(application.application.inflowPath),
        application.application.email,
        application.application.name,
        application.application.phoneNum,
        application.optionalInfo?.university,
        parseGrade(application.application.grade),
        application.optionalInfo?.major,
        application.application.couponName,
        application.application.totalFee || 0,
        application.optionalInfo
          ? `${application.optionalInfo.accountType || ''} ${
              application.optionalInfo.accountNumber || ''
            }`
          : '',
        application.application.feeIsConfirmed ? '입금완료' : '입금대기',
        wishJobToText[application.application.wishJob],
        application.application.wishCompany,
        application.application.applyMotive,
        application.application.way === 'OFFLINE'
          ? '오프라인'
          : application.application.way === 'ONLINE'
          ? '온라인'
          : '',
        applicationStatusToText[application.application.status],
        application.application.createdAt,
        application.application.preQuestions,
      );
      csv.push(row.join(','));
    });
    return csv.join('\n');
  };

  const downloadCSVFile = (csv: any) => {
    const BOM = '\uFEFF';
    csv = BOM + csv;
    const csvFile = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(csvFile);
    link.download = `${program.title} - 참여자 목록.csv`;
    link.click();
  };

  return (
    <div className="relative">
      <ActionButton
        width="5rem"
        bgColor="gray"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        일반
      </ActionButton>
      {isMenuOpen && (
        <ul className="absolute -top-2 left-1/2 w-48 -translate-x-1/2 -translate-y-full overflow-hidden rounded-xxs border border-neutral-300 bg-white shadow-lg">
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={handleDownloadCSV}
          >
            CSV 다운로드
          </li>
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={() => handleDownloadList(true, 'EMAIL')}
          >
            참가확정 이메일
          </li>
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={() => handleDownloadList(true, 'PHONE')}
          >
            참가확정 전화번호
          </li>
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={() => handleDownloadList(false, 'EMAIL')}
          >
            미선발 이메일
          </li>
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={() => handleDownloadList(false, 'PHONE')}
          >
            미선발 전화번호
          </li>
        </ul>
      )}
    </div>
  );
};

export default GeneralActionDropdown;
