import { ReactNode } from 'react';
import FormPopupShell from '../FormPopupShell';

interface StateScreenProps {
  /** 제목 위 둥근 아이콘. 없으면 그리지 않는다(로그인 필요는 상품 카드를 대신 둔다) */
  icon?: ReactNode;
  /** 아이콘 배경. ok 는 완료류, mute 는 안내류 */
  tone?: 'ok' | 'mute';
  top?: ReactNode;
  heading: ReactNode;
  description?: ReactNode;
  footer: ReactNode;
}

const ICON_TONE = {
  ok: 'bg-primary-10 text-primary',
  mute: 'bg-neutral-90 text-neutral-40',
};

/** 입력 화면 대신 보이는 예외 화면 틀(시안 4절). 모두 "신청하기" 상단 바에 문구와 버튼만 다르다 */
const StateScreen = ({
  icon,
  tone = 'mute',
  top,
  heading,
  description,
  footer,
}: StateScreenProps) => (
  <FormPopupShell title="신청하기" footer={footer}>
    <div className="flex h-full flex-col items-center justify-center px-1 py-8 text-center">
      {top}
      {icon ? (
        <div
          aria-hidden
          className={`grid h-16 w-16 place-items-center rounded-full ${ICON_TONE[tone]}`}
        >
          {icon}
        </div>
      ) : null}
      <h2 className="text-small20 mt-5 font-bold">{heading}</h2>
      {description ? (
        <p className="text-xsmall14 text-neutral-35 mt-2 break-keep leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  </FormPopupShell>
);

export const primaryButtonClass =
  'bg-primary text-xsmall16 text-static-100 hover:bg-primary-hover grid h-[52px] w-full place-items-center rounded-sm font-semibold transition-colors';

export const lineButtonClass =
  'border-neutral-80 bg-static-100 text-xsmall16 text-neutral-20 hover:bg-neutral-95 grid h-[52px] w-full place-items-center rounded-sm border font-semibold transition-colors';

export const closePopup = () => window.close();

export default StateScreen;
