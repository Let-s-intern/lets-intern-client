import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { ReportApplication } from '@/store/useReportApplicationStore';

export default function useMinDate(data: ReportApplication) {
  const [minDate, setMinDate] = useState<Dayjs>(dayjs());

  /* 최소 날짜 설정 */
  useEffect(() => {
    if (data.optionIds.length !== 0) {
      setMinDate(dayjs().add(6, 'day'));
      return;
    }
    if (data.reportPriceType === 'BASIC') {
      setMinDate(dayjs().add(3, 'day'));
      return;
    }
    if (data.reportPriceType === 'PREMIUM') {
      setMinDate(dayjs().add(4, 'day'));
      return;
    }
  }, [data.optionIds, data.reportPriceType]);

  return minDate;
}
