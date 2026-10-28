import { CircleAlert, LogIn } from 'lucide-react';
import Link from 'next/link';
import FormPopupShell from '../../ui/FormPopupShell';
import StateScreen, { primaryButtonClass } from '../../ui/states/StateScreen';

/** U2 가 null. 신청 페이지로 안내한다 */
export const NoApplicationState = ({ slug }: { slug: string }) => (
  <StateScreen
    title="신청 확인"
    icon={<CircleAlert size={28} />}
    heading="신청 내역이 없어요"
    description="이 계정으로 신청한 내역을 찾지 못했어요."
    footer={
      <Link href={`/form/${slug}`} className={primaryButtonClass}>
        신청하러 가기
      </Link>
    }
  />
);

/** 비로그인. 로그인 후 이 신청 확인 페이지로 돌아온다 */
export const MyLoginRequiredState = ({ slug }: { slug: string }) => (
  <StateScreen
    title="신청 확인"
    icon={<LogIn size={28} />}
    heading={
      <>
        렛츠커리어 로그인 후<br />
        신청 내역을 확인할 수 있어요
      </>
    }
    description="로그인하면 이 화면으로 바로 돌아와요."
    footer={
      <Link
        href={`/login?redirect=${encodeURIComponent(`/form/${slug}/my`)}`}
        className={primaryButtonClass}
      >
        로그인하고 확인하기
      </Link>
    }
  />
);

export const MyLoadingState = () => (
  <FormPopupShell title="신청 확인">
    <p className="text-xsmall14 text-neutral-40 py-10 text-center">
      불러오는 중이에요
    </p>
  </FormPopupShell>
);
