import DocumentLink from './DocumentLink';
import IconLink from './IconLink';

interface Props {
  isNextRouter: boolean;
}

const onClickAddChannel = () => {
  window.Kakao.Channel.followChannel({
    channelPublicId: '_tCeHG',
  }).catch((error: any) => {
    console.log(error);
  });
};

function BottomLinkSection({ isNextRouter }: Props) {
  return (
    <div className="flex items-center justify-between lg:justify-start lg:gap-5">
      {/* 아이콘 링크 */}
      <div className="flex items-center gap-4">
        <IconLink
          isNextRouter={isNextRouter}
          className="instagram_cta"
          imgSrc="/icons/instagram.svg"
          href="https://www.instagram.com/letscareer.official"
        />
        <IconLink
          isNextRouter={isNextRouter}
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
        <DocumentLink
          isNextRouter={isNextRouter}
          href="https://letscareer.oopy.io/a121a038-f72f-42d7-bde7-47624ecc0943"
        >
          서비스 이용약관
        </DocumentLink>
        <DocumentLink
          isNextRouter={isNextRouter}
          href="https://letscareer.oopy.io/c3af485b-fced-49ab-9601-f2d7bf07657d"
        >
          개인정보처리방침
        </DocumentLink>
      </div>
    </div>
  );
}

export default BottomLinkSection;
