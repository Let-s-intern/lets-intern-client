'use client';
import channelService from '@/ChannelService';

export default function MembershipFooter() {
  return (
    <footer className="foot">
      <div className="wrap">
        <img className="logo" src="/logo/logo.svg" alt="렛츠커리어" />
        <div className="row">
          <a href="/program">전체 프로그램</a>
          <a href="/review">수강생 후기</a>
          <a href="/program?type=VOD">취준위키 VOD</a>
          <button
            type="button"
            className="inquiry"
            onClick={() => channelService.showMessenger()}
          >
            문의하기
          </button>
        </div>
        <div className="fine">
          렛츠커리어 · 합격으로 이어지는 취업 교육
          <br />
          이메일 official@letscareer.co.kr · 평일·주말 09:00–21:00 상담
        </div>
      </div>
    </footer>
  );
}
