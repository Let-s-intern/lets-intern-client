'use client';

import { useUserQuery } from '@/api/user/user';
import {
  useGetMyPass,
  useGetPassCalendar,
} from '@/domain/all-in-one-pass/api/dashboard';
import DashboardCalendar from '@/domain/all-in-one-pass/ui/dashboard/calendar/DashboardCalendar';
import DashboardCalendarMobile from '@/domain/all-in-one-pass/ui/dashboard/calendar/DashboardCalendarMobile';
import PassUsageCard from '@/domain/all-in-one-pass/ui/dashboard/PassUsageCard';
import RemainingPeriodCard from '@/domain/all-in-one-pass/ui/dashboard/RemainingPeriodCard';
import { useParams } from 'next/navigation';

export default function AllInOnePassDashboardPage() {
  const params = useParams<{ applicationId: string }>();
  const { data: user } = useUserQuery();
  const { data: myPass } = useGetMyPass(Number(params.applicationId));
  const { data: calendarEvents } = useGetPassCalendar(
    Number(params.applicationId),
  );

  return (
    <main className="flex flex-col px-5 pb-16 pt-8 md:gap-10 md:pb-0 md:pl-12 md:pr-0 md:pt-0">
      <header>
        <h1 className="hidden text-[22px] font-semibold md:block">
          {user?.name}님의 패스 대시보드
        </h1>
      </header>
      <div className="flex flex-col gap-6 md:gap-10">
        {myPass && (
          <div className="flex gap-2 md:gap-5">
            <RemainingPeriodCard
              startDate={myPass.startDate}
              endDate={myPass.endDate}
            />
            <PassUsageCard
              plan={myPass.plan}
              mentoringCoupons={myPass.mentoringCoupons}
            />
          </div>
        )}
        {calendarEvents && (
          <>
            <div className="hidden md:block">
              <DashboardCalendar events={calendarEvents} />
            </div>
            <div className="md:hidden">
              <DashboardCalendarMobile
                events={calendarEvents}
                periodStart={myPass?.startDate}
                periodEnd={myPass?.endDate}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
