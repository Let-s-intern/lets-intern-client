import DocumentLink from './DocumentLink';
import IconLink from './IconLink';

const onClickAddChannel = () => {
  window.Kakao.Channel.followChannel({
    channelPublicId: '_tCeHG',
  }).catch((error: any) => {
    console.log(error);
  });
};

function BottomLinkSection() {
  return (
    <div className="flex items-center justify-between lg:justify-start lg:gap-5">
      {/* 아이콘 링크 */}
      <div className="flex items-center gap-4">
        <IconLink
          className="instagram_cta"
          imgSrc="/icons/instagram.svg"
          href="https://www.instagram.com/letscareer.official"
        />
        <IconLink
          className="blog_cta"
          imgSrc="/icons/blog.png"
          href="https://blog.naver.com/PostList.naver?blogId=letsintern"
        />
        <img
          className="cursor-pointer"
          src="/icons/icon-kakao.svg"
          width={20}
          height={20}
          alt="카카오톡 채널 아이콘"
          onClick={onClickAddChannel}
        />
      </div>
      <div className="flex items-center gap-6 text-neutral-0/[.65]">
        <DocumentLink href="https://letsintern.notion.site/251208-2c35e77cbee1800bb2b5cfbd4c2f1525?pvs=21">
          서비스 이용약관
        </DocumentLink>
        <DocumentLink href="https://letsintern.notion.site/251208-2c35e77cbee18001a0edc3ceaf8982ba">
          개인정보처리방침
        </DocumentLink>
      </div>
    </div>
  );
}

export default BottomLinkSection;
