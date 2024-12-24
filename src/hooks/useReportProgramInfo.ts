import { useEffect, useState } from 'react';

import {
  convertReportPriceType,
  useGetReportDetailQuery,
  useGetReportPriceDetail,
} from '../api/report';
import useReportApplicationStore from '../store/useReportApplicationStore';

export default function useReportProgramInfo() {
  const [options, setOptions] = useState<string[]>([]);

  const { data: reportApplication } = useReportApplicationStore();
  const { data: reportDetailData } = useGetReportDetailQuery(
    reportApplication.reportId!,
  );
  const { data: reportPriceDetailData } = useGetReportPriceDetail(
    reportApplication.reportId!,
  );

  // optionIds로 옵션 제목 불러오기
  useEffect(() => {
    const optionTitleList = [];
    const optionIds = reportApplication.optionIds;

    // 선택한 옵션이 없으면 종료
    if (optionIds.length === 0) return;

    for (const id of optionIds) {
      const optionInfo = reportPriceDetailData?.reportOptionInfos?.find(
        (info) => info.reportOptionId === id,
      );

      if (optionInfo === undefined) continue;

      // 선택한 옵션의 제목을 담은 배열 생성
      optionTitleList.push(
        optionInfo?.optionTitle?.startsWith('+')
          ? '문항 추가'
          : (optionInfo?.optionTitle as string),
      );
    }

    // "문항 추가" 증복 제거
    setOptions([...new Set(optionTitleList)]);
  }, [reportPriceDetailData, reportApplication]);

  return {
    title: reportDetailData?.title,
    product: reportApplication.isFeedbackApplied
      ? `서류 진단서 (${convertReportPriceType(reportApplication.reportPriceType)}), 1:1 피드백`
      : `서류 진단서 (${convertReportPriceType(reportApplication.reportPriceType)})`,
    option: options.length === 0 ? '없음' : options.join(', '),
  };
}
