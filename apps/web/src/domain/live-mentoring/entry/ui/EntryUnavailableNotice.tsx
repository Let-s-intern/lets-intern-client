import Link from 'next/link';

/**
 * 입장 조회가 실패했을 때 대신 그리는 화면.
 *
 * 없는 신청과 남의 신청을 **구분하지 않는다.** 서버가 둘 다 404 로 답하는 것과 같은
 * 이유다 — 403 을 주면 "그 번호의 신청은 있지만 네 것이 아니다" 가 되어 링크의 id 를
 * 바꿔가며 존재 여부를 캘 수 있다. 화면이 사유를 나눠 적으면 서버가 감춘 것을 도로
 * 흘린다.
 *
 * 이 화면이 없을 때는 조회가 실패해도 "일정 확인 중" 에 그대로 멈춰 있었다. 알림톡
 * 링크로 들어온 사람에게는 로딩이 끝나지 않는 것으로만 보인다.
 */
const EntryUnavailableNotice = () => {
  return (
    <section className="border-neutral-80 rounded-xxl flex flex-col items-center gap-5 border bg-white p-6 text-center shadow-sm">
      <img
        src="/logo/horizontal-logo.svg"
        alt="렛츠커리어"
        className="h-6 w-auto"
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-small18 text-neutral-0 font-bold">
          입장할 수 없는 링크예요
        </h1>
        <p className="text-xsmall14 text-neutral-40 break-keep">
          링크가 만료됐거나, 지금 로그인한 계정의 세션이 아니에요. 알림톡을 받은
          계정으로 로그인했는지 확인해 주세요.
        </p>
      </div>

      <Link
        href="/mypage/application"
        className="text-small16 bg-primary text-static-100 flex min-h-[52px] w-full items-center justify-center rounded-md px-4 py-3 font-semibold"
      >
        신청 현황에서 확인하기
      </Link>
    </section>
  );
};

export default EntryUnavailableNotice;
