'use client';

import { useMypageApplicationsQueryKey } from '@/api/application';
import { useUserQuery } from '@/api/user/user';
import {
  useGetMyMembershipApplication,
  useGetPassCalendar,
} from '@/domain/all-in-one-pass/api/dashboard';
import { CalendarApplyProvider } from '@/domain/all-in-one-pass/ui/dashboard/calendar/CalendarApplyContext';
import CalendarDesktop from '@/domain/all-in-one-pass/ui/dashboard/calendar/CalendarDesktop';
import CalendarMobile from '@/domain/all-in-one-pass/ui/dashboard/calendar/CalendarMobile';
import ExtensionModal from '@/domain/all-in-one-pass/ui/dashboard/extension/ExtensionModal';
import ExtensionPopup from '@/domain/all-in-one-pass/ui/dashboard/extension/ExtensionPopup';
import ExternalLinks from '@/domain/all-in-one-pass/ui/dashboard/ExternalLinks';
import PassUsageCard from '@/domain/all-in-one-pass/ui/dashboard/PassUsageCard';
import RemainingPeriodCard from '@/domain/all-in-one-pass/ui/dashboard/RemainingPeriodCard';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AllInOnePassDashboardPage() {
  const params = useParams<{ applicationId: string }>();
  const applicationId = Number(params.applicationId);
  const queryClient = useQueryClient();
  const { data: user } = useUserQuery();
  const { data: base } = useGetMyMembershipApplication(applicationId);
  const { data: calendarEvents } = useGetPassCalendar(applicationId);
  const [extensionOpen, setExtensionOpen] = useState(false);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['allInOnePass'] });
    queryClient.invalidateQueries({
      queryKey: [useMypageApplicationsQueryKey],
    });
  }, [queryClient]);

  return (
    <main className="flex flex-col px-5 pb-16 pt-8 md:gap-10 md:pb-0 md:pl-12 md:pr-0 md:pt-0">
      <header className="hidden items-center justify-between md:flex">
        <h1 className="text-[22px] font-semibold">
          {user?.name}님의 패스 대시보드
        </h1>
        <ExternalLinks applicationId={applicationId} variant="header" />
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
          <ExternalLinks applicationId={applicationId} variant="box" />
        </div>
        {calendarEvents && (
          <CalendarApplyProvider passTitle={base?.title ?? undefined}>
            <div className="hidden md:block">
              <CalendarDesktop
                events={calendarEvents}
                periodStart={base?.startDate ?? undefined}
                periodEnd={base?.endDate ?? undefined}
              />
            </div>
            <div className="md:hidden">
              <CalendarMobile
                events={calendarEvents}
                periodStart={base?.startDate ?? undefined}
                periodEnd={base?.endDate ?? undefined}
              />
            </div>
          </CalendarApplyProvider>
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
