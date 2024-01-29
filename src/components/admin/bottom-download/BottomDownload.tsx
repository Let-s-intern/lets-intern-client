import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import axios from '../../../utils/axios';
import ActionButton from '../../../pages/admin/ActionButton';

interface BottomDownloadProps {
  program: any;
  sizePerPage: number;
  maxPage: number;
}

const BottomDownload = ({
  program,
  sizePerPage,
  maxPage,
}: BottomDownloadProps) => {
  const params = useParams();

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
    <BottomDownloadBlock>
      <ActionButton
        width="10rem"
        bgColor="green"
        onClick={() => handleDownloadList(true, 'EMAIL')}
      >
        참가확정 이메일
      </ActionButton>
      <ActionButton
        width="10rem"
        bgColor="red"
        onClick={() => handleDownloadList(false, 'EMAIL')}
      >
        미선발 이메일
      </ActionButton>
      <ActionButton
        width="10rem"
        bgColor="green"
        onClick={() => handleDownloadList(true, 'PHONE')}
      >
        참가확정 전화번호
      </ActionButton>
      <ActionButton
        width="10rem"
        bgColor="red"
        onClick={() => handleDownloadList(false, 'PHONE')}
      >
        미선발 전화번호
      </ActionButton>
    </BottomDownloadBlock>
  );
};

export default BottomDownload;

const BottomDownloadBlock = styled.div`
  width: calc(100vw - 250px);
  position: fixed;
  bottom: 3rem;
  left: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
