export type InstagramThumbnail = {
  src: string;
  alt: string;
};

export type InstagramChannel = {
  id: string;
  handle: string;
  label: string;
  description: string;
  link: string;
  thumbnails: InstagramThumbnail[];
};

const INSTAGRAM_OFFICIAL_LINK = 'https://www.instagram.com/letscareer_official';
const INSTAGRAM_JOB_LINK = 'https://www.instagram.com/letscareer.job';
const INSTAGRAM_QNA_LINK = 'https://www.instagram.com/letscareer_qna';

// TODO: 실제 인스타그램 게시물 이미지 URL로 교체
export const instagramChannels: InstagramChannel[] = [
  {
    id: 'official',
    handle: '@letscareer_official',
    label: '렛츠커리어 공식',
    description:
      '빠르고 트렌디한 취준 정보를 매일 오전 10시에 받아볼 수 있어요. 렛츠커리어의 모든 소식이 여기 담겨있어요.',
    link: INSTAGRAM_OFFICIAL_LINK,
    thumbnails: [],
  },
  {
    id: 'job',
    handle: '@letscareer.job',
    label: '렛츠커리어 오공고',
    description:
      '문과 취준생을 위해 큐레이션된 채용공고와 직무 인사이트를 인스타그램으로 가장 빠르게 만나보세요.',
    link: INSTAGRAM_JOB_LINK,
    thumbnails: [],
  },
  {
    id: 'qna',
    handle: '@letscareer_qna',
    label: '렛츠커리어 QNA',
    description:
      '현직자 멘토와 커리어 매니저에게 무제한 질의응답. 취업 고민을 편하게 올려두세요.',
    link: INSTAGRAM_QNA_LINK,
    thumbnails: [],
  },
];
