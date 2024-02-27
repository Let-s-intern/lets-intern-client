import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import { useState } from 'react';
import { bankTypeToText } from '../../../../../utils/convert';

interface Props {
  mission: any;
}

const AccountDownloadButton = ({ mission }: Props) => {
  const [accountList, setAccountList] = useState<any>();

  useQuery({
    queryKey: ['attendance', 'admin', mission.id, 'refund'],
    queryFn: async () => {
      const res = await axios.get(`/attendance/admin/${mission.id}/refund`);
      const data = res.data;
      console.log(data);
      setAccountList(data.accountVoList);
      return data;
    },
  });

  const handleDownloadCSV = () => {
    const csv = getCSV(accountList);
    downloadCSVFile(csv);
  };

  const getCSV = (accountList: any) => {
    const csv: any = [];
    csv.push('이름,계좌은행,계좌번호');
    accountList.forEach((account: any) => {
      const row = [];
      row.push(
        account.name,
        bankTypeToText[account.accountType],
        account.accountNumber,
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
    link.download = `${mission.th}일차 미션 - 정상 출석 계좌번호 목록.csv`;
    link.click();
  };

  const isLoading = !accountList;

  if (isLoading) {
    return <></>;
  }

  return (
    <button
      className="rounded border border-zinc-600 px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
      onClick={handleDownloadCSV}
    >
      계좌번호 다운로드
    </button>
  );
};

export default AccountDownloadButton;
