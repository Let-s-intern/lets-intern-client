import { ChallengeApplication, LiveApplication } from '@/schema';
import { useState } from 'react';
import ActionButton from '../../../ui/button/ActionButton';

interface Props {
  applications: (ChallengeApplication['application'] | LiveApplication)[];
  programTitle: string;
}

const GeneralActionDropdown = ({ applications, programTitle }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDownloadList = async (
    isConfirmed: boolean,
    column: 'EMAIL' | 'PHONE',
  ) => {
    const emailList = applications.map((application) =>
      column === 'EMAIL' ? application.email : application.phoneNum,
    );
    const label =
      column === 'EMAIL' ? '이메일' : column === 'PHONE' && '전화번호';
    const subject =
      (isConfirmed ? `참가확정 ${label} 목록` : `미선발 ${label} 목록`) +
      ' - ' +
      programTitle;
    downloadFile(subject + '.txt', emailList.join('\n'));
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
    csv.push(`이름,이메일,휴대폰 번호,쿠폰명,결제금액,환불여부,신청일자`);
    applications.forEach((application) => {
      const row = [];
      const createDate =
        'createDate' in application
          ? application.createDate
          : application.created_date;

      const amount =
        application.couponDiscount === -1
          ? 0
          : application.isCanceled
            ? (application.programPrice ?? 0) -
              (application.programDiscount ?? 0) -
              (application.finalPrice ?? 0) -
              (application.couponDiscount ?? 0)
            : (application.finalPrice ?? 0);

      row.push(
        application.name,
        application.email,
        application.phoneNum,
        application.couponName || '없음',
        amount,
        application.isCanceled ? 'Y' : 'N',
        createDate.format('YYYY년 MM월 DD일 a h시 m분'),
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
    link.download = `${programTitle} - 참여자 목록.csv`;
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
