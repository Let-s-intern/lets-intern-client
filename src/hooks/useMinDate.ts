import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { ReportApplication } from '@/store/useReportApplicationStore';

const initialTimeOption = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export default function useMinDate(data: ReportApplication) {
  const [timeOptions, setTimeOptions] = useState({
    desiredDate1: initialTimeOption,
    desiredDate2: initialTimeOption,
    desiredDate3: initialTimeOption,
  });
  const [minDate, setMinDate] = useState<Dayjs>(dayjs());

  /* 최소 날짜 설정 */
  useEffect(() => {
    if (data.optionIds.length !== 0) {
      setMinDate(dayjs().add(5, 'day'));
      return;
    }
    if (data.reportPriceType === 'BASIC') {
      setMinDate(dayjs().add(2, 'day'));
      return;
    }
    if (data.reportPriceType === 'PREMIUM') {
      setMinDate(dayjs().add(3, 'day'));
      return;
    }
  }, []);

  /* 선택 가능한 시간 설정 */
  useEffect(() => {
    if (minDate.isSame(data.desiredDate1, 'day')) {
      setTimeOptions((prev) => ({
        ...prev,
        desiredDate1: initialTimeOption.filter(
          (option) => option > minDate.hour(),
        ),
      }));
    } else {
      setTimeOptions((prev) => ({ ...prev, desiredDate1: initialTimeOption }));
    }
  }, [data.desiredDate1, minDate]);

  useEffect(() => {
    if (minDate.isSame(data.desiredDate2, 'day')) {
      setTimeOptions((prev) => ({
        ...prev,
        desiredDate2: initialTimeOption.filter(
          (option) => option > minDate.hour(),
        ),
      }));
    } else {
      setTimeOptions((prev) => ({ ...prev, desiredDate2: initialTimeOption }));
    }
  }, [data.desiredDate2, minDate]);

  useEffect(() => {
    if (minDate.isSame(data.desiredDate3, 'day')) {
      setTimeOptions((prev) => ({
        ...prev,
        desiredDate3: initialTimeOption.filter(
          (option) => option > minDate.hour(),
        ),
      }));
    } else {
      setTimeOptions((prev) => ({ ...prev, desiredDate3: initialTimeOption }));
    }
  }, [data.desiredDate3, minDate]);

  return { minDate, timeOptions };
}
