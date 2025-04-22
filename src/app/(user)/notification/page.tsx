'use client';

import NotificationContainer from '@components/common/notification/NotificationContainer';
import NextBackHeader from '@components/common/ui/NextBackHeader';

export default function Page() {
  return (
    <>
      <section className="mw-720 px-5">
        <NextBackHeader hideBack>프로그램 출시 알림 신청</NextBackHeader>
        <NotificationContainer />
      </section>
    </>
  );
}
