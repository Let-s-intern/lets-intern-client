'use client';

import dayjs from '@/lib/dayjs';
import { SelectChangeEvent } from '@mui/material';
import { useParams } from 'next/navigation';
import { ConfigType, Dayjs } from 'dayjs';

import { convertParamToReportType } from '@/api/report';
import DateTimePicker from '@/domain/report/ui/DateTimePicker';
import Heading2 from '@/domain/report/ui/heading/Heading2';
import Label from '@/domain/report/ui/heading/Label';
import Tooltip from '@/domain/report/ui/Tooltip';
import useMinDate from '@/hooks/useMinDate';
import useReportApplicationStore from '@/store/useReportApplicationStore';

export const ScheduleSection = () => {
  const params = useParams<{ reportType: string }>();
  const { reportType } = params;
  const { data, setReportApplication } = useReportApplicationStore();

  const minDate = useMinDate({
    application: data,
    reportType: convertParamToReportType(reportType),
  });

  type Key = keyof typeof data;

  const onChangeDate = (date: Dayjs | null, name?: string) => {
    const hour = dayjs(data[name as Key] as ConfigType).hour();

    date?.set('hour', hour);
    setReportApplication({
      [name as Key]: date?.format('YYYY-MM-DDTHH:00'),
    });
  };

  const onChangeTime = (e: SelectChangeEvent<unknown>) => {
    const prev = data[e.target.name as Key];
    if (prev === undefined) {
      alert('날짜를 먼저 선택해주세요');
      return;
    }

    setReportApplication({
      [e.target.name]: dayjs(prev as ConfigType)
        .set('hour', e.target.value as number)
        .format('YYYY-MM-DDTHH:00'),
    });
  };

  return (
    <section className="flex flex-col gap-1 lg:flex-row lg:items-start lg:gap-5">
      <div className="flex w-40 shrink-0 items-center gap-1">
        <Heading2>1:1 온라인 상담 일정</Heading2>
        <Tooltip alt="1:1 온라인 상담 일정 도움말">
          1:1 온라인 상담은 서류 진단서 발급 이후에 진행됩니다.
        </Tooltip>
      </div>
      <div className="flex w-full flex-col gap-5">
        <span className="text-xsmall14">
          희망하시는 상담(40분) 일정을 모두 선택해주세요.
        </span>
        <div>
          <Label>희망순위1*</Label>
          <DateTimePicker
            date={
              data.desiredDate1 === undefined
                ? undefined
                : dayjs(data.desiredDate1)
            }
            time={
              data.desiredDate1 === undefined ||
              dayjs(data.desiredDate1).hour() === 0
                ? undefined
                : dayjs(data.desiredDate1).hour()
            }
            name="desiredDate1"
            minDate={minDate}
            onChangeDate={onChangeDate}
            onChangeTime={onChangeTime}
          />
        </div>
        <div>
          <Label>희망순위2*</Label>
          <DateTimePicker
            date={
              data.desiredDate2 === undefined
                ? undefined
                : dayjs(data.desiredDate2)
            }
            time={
              data.desiredDate2 === undefined ||
              dayjs(data.desiredDate2).hour() === 0
                ? undefined
                : dayjs(data.desiredDate2).hour()
            }
            name="desiredDate2"
            minDate={minDate}
            onChangeDate={onChangeDate}
            onChangeTime={onChangeTime}
          />
        </div>
        <div>
          <Label>희망순위3*</Label>
          <DateTimePicker
            date={
              data.desiredDate3 === undefined
                ? undefined
                : dayjs(data.desiredDate3)
            }
            time={
              data.desiredDate3 === undefined ||
              dayjs(data.desiredDate3).hour() === 0
                ? undefined
                : dayjs(data.desiredDate3).hour()
            }
            name="desiredDate3"
            minDate={minDate}
            onChangeDate={onChangeDate}
            onChangeTime={onChangeTime}
          />
        </div>
      </div>
    </section>
  );
};
