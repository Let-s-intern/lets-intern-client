import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../../utils/axios';

interface Props {
  applicationList: any;
}

const DownloadButtonGroup = ({ applicationList }: Props) => {
  const handleDownloadCSV = (type: 'EMAIL' | 'PHONE') => {
    const csv = getCSV(type);
    downloadCSVFile(csv, type);
  };

  const getCSV = (type: 'EMAIL' | 'PHONE') => {
    const csv: any = [];
    csv.push(`이름,${type === 'EMAIL' ? '이메일' : '전화번호'}`);
    applicationList.forEach((application: any) => {
      const row = [];
      row.push(
        application.name,
        type === 'EMAIL' ? application.email : application.phoneNum,
      );
      csv.push(row.join(','));
    });
    return csv.join('\n');
  };

  const downloadCSVFile = (csv: any, type: 'EMAIL' | 'PHONE') => {
    const BOM = '\uFEFF';
    csv = BOM + csv;
    const csvFile = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(csvFile);
    link.download = `참여자 ${
      type === 'EMAIL' ? '이메일' : '전화번호'
    } 목록.csv`;
    link.click();
  };

  const isLoading = !applicationList;

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          className="rounded-xxs border border-zinc-600 px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
          onClick={() => handleDownloadCSV('EMAIL')}
        >
          이메일 다운로드
        </button>
        <button
          className="rounded-xxs border border-zinc-600 px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
          onClick={() => handleDownloadCSV('PHONE')}
        >
          전화번호 다운로드
        </button>
      </div>
    </div>
  );
};

export default DownloadButtonGroup;
