'use client';

interface BlogShareSectionProps {
  title: string;
  description: string;
  thumbnail: string;
  pathname: string;
}

const BlogShareSection = ({
  title,
  description,
  thumbnail,
  pathname,
}: BlogShareSectionProps) => {
  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('클립보드에 복사되었습니다.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareKakaoClick = () => {
    if (window.Kakao) {
      const kakao = window.Kakao;
      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description,
          imageUrl: thumbnail,
          link: {
            mobileWebUrl: `${window.location.origin}${pathname}`,
            webUrl: `${window.location.origin}${pathname}`,
          },
        },
        buttons: [
          {
            title: '글 확인하기',
            link: {
              mobileWebUrl: `${window.location.origin}${pathname}`,
              webUrl: `${window.location.origin}${pathname}`,
            },
          },
        ],
      });
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-y-3 py-5">
      <p className="text-xsmall14 text-black">나만 보기 아깝다면 공유하기</p>
      <div className="blog_share flex items-center gap-x-5">
        <button
          type="button"
          className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-primary-10"
          onClick={() =>
            handleCopyClipBoard(`${window.location.origin}${location.pathname}`)
          }
        >
          <img
            src="/icons/link-01.svg"
            alt="link"
            className="h-6 w-6 shrink-0"
          />
        </button>
        <button
          type="button"
          className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-primary-10"
          onClick={handleShareKakaoClick}
        >
          <img
            src="/icons/kakao_path.svg"
            alt="kakao"
            className="h-6 w-6 shrink-0"
          />
        </button>
      </div>
    </div>
  );
};

export default BlogShareSection;
