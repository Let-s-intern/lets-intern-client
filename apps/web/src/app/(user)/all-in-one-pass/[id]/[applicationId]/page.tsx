'use client';

import { useUserQuery } from '@/api/user/user';
import {
  useGetMyPass,
  useGetPassCalendar,
} from '@/domain/all-in-one-pass/api/dashboard';
import CalendarDesktop from '@/domain/all-in-one-pass/ui/dashboard/calendar/CalendarDesktop';
import CalendarMobile from '@/domain/all-in-one-pass/ui/dashboard/calendar/CalendarMobile';
import ExtensionModal from '@/domain/all-in-one-pass/ui/dashboard/extension/ExtensionModal';
import ExtensionPopup from '@/domain/all-in-one-pass/ui/dashboard/extension/ExtensionPopup';
import MobileExternalLinks from '@/domain/all-in-one-pass/ui/dashboard/MobileExternalLinks';
import PassUsageCard from '@/domain/all-in-one-pass/ui/dashboard/PassUsageCard';
import RemainingPeriodCard from '@/domain/all-in-one-pass/ui/dashboard/RemainingPeriodCard';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function AllInOnePassDashboardPage() {
  const params = useParams<{ applicationId: string }>();
  const applicationId = Number(params.applicationId);
  const { data: user } = useUserQuery();
  const { data: myPass } = useGetMyPass(applicationId);
  const { data: calendarEvents } = useGetPassCalendar(applicationId);
  const [extensionOpen, setExtensionOpen] = useState(false);

  return (
    <main className="flex flex-col px-5 pb-16 pt-8 md:gap-10 md:pb-0 md:pl-12 md:pr-0 md:pt-0">
      <header>
        <h1 className="hidden text-[22px] font-semibold md:block">
          {user?.name}님의 패스 대시보드
        </h1>
      </header>
      <div className="flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 md:gap-5">
            <RemainingPeriodCard
              applicationId={applicationId}
              onExtend={() => setExtensionOpen(true)}
            />
            <PassUsageCard applicationId={applicationId} />
          </div>
          <MobileExternalLinks applicationId={applicationId} />
        </div>
        {calendarEvents && (
          <>
            <div className="hidden md:block">
              <CalendarDesktop
                events={calendarEvents}
                periodStart={myPass?.startDate}
                periodEnd={myPass?.endDate}
              />
            </div>
            <div className="md:hidden">
              <CalendarMobile
                events={calendarEvents}
                periodStart={myPass?.startDate}
                periodEnd={myPass?.endDate}
              />
            </div>
          </>
        )}
      </div>

      <ExtensionPopup
        applicationId={applicationId}
        isModalOpen={extensionOpen}
        onExtend={() => setExtensionOpen(true)}
      />
      {extensionOpen && (
        <ExtensionModal
          applicationId={applicationId}
          onClose={() => setExtensionOpen(false)}
        />
      )}
    </main>
  );
}
