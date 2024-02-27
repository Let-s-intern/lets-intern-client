import { useState } from 'react';
import { useParams } from 'react-router-dom';

import ActionButton from '../../../ui/button/ActionButton';
import axios from '../../../../../utils/axios';

interface Props {
  program: any;
  sizePerPage: number;
  maxPage: number;
}

const GeneralActionDropdown = ({ program, sizePerPage, maxPage }: Props) => {
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
        <ul className="absolute -top-2 left-1/2 w-48 -translate-x-1/2 -translate-y-full overflow-hidden rounded border border-neutral-300 bg-white shadow-lg">
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
