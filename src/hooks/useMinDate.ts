import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { ReportType } from '@/api/report';
import { ReportApplication } from '@/store/useReportApplicationStore';

export default function useMinDate({
  application,
  reportType,
}: {
  application: ReportApplication;
  reportType: ReportType;
}) {
  const [minDate, setMinDate] = useState<Dayjs>(dayjs());

  /* 최소 날짜 설정 */
  useEffect(() => {
    if (application.optionIds.length !== 0) {
      setMinDate(dayjs().add(reportType === 'RESUME' ? 6 : 8, 'day'));
      return;
    }
    if (application.reportPriceType === 'BASIC') {
      setMinDate(dayjs().add(reportType === 'RESUME' ? 3 : 4, 'day'));
      return;
    }
    if (application.reportPriceType === 'PREMIUM') {
      setMinDate(dayjs().add(reportType === 'RESUME' ? 4 : 6, 'day'));
      return;
    }
  }, [application.optionIds, application.reportPriceType, reportType]);

  return minDate;
}
