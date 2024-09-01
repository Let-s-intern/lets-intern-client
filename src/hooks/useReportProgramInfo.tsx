import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  convertReportPriceType,
  useGetReportDetail,
  useGetReportPriceDetail,
} from '../api/report';
import useReportApplicationStore from '../store/useReportApplicationStore';

export default function useReportProgramInfo() {
  const { reportId } = useParams();

  const [options, setOptions] = useState<string[]>([]);

  const { data: reportDetailData } = useGetReportDetail(Number(reportId));
  const { data: reportPriceDetailData } = useGetReportPriceDetail(
    Number(reportId),
  );
  const { data: reportApplication } = useReportApplicationStore();

  // optionIds로 옵션 제목 불러오기
  useEffect(() => {
    setOptions(() => []); // 초기화

    const optionIds = reportApplication.optionIds;
    if (optionIds.length === 0) return;

    for (const id of optionIds) {
      const optionInfo = reportPriceDetailData?.reportOptionInfos?.find(
        (info) => info.reportOptionId === id,
      );
      if (optionInfo === undefined) continue;
      setOptions((prev) => [...prev, optionInfo?.title as string]);
    }
  }, [reportPriceDetailData, reportApplication]);

  return {
    title: reportDetailData?.title,
    product: reportApplication.isFeedbackApplied
      ? `서류 진단서 (${convertReportPriceType(reportApplication.reportPriceType)}), 1:1 피드백`
      : `서류 진단서 (${convertReportPriceType(reportApplication.reportPriceType)})`,
    option:
      reportApplication.optionIds.length === 0 ? '없음' : options.join(', '),
  };
}
