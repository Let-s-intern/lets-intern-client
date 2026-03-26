import igJob1 from '../images/instagram-job/1.jpg';
import igJob2 from '../images/instagram-job/2.jpg';
import igJob3 from '../images/instagram-job/3.jpg';
import igJob4 from '../images/instagram-job/4.jpg';
import igJob5 from '../images/instagram-job/5.jpg';
import igJob6 from '../images/instagram-job/6.jpg';
import igOfficial1 from '../images/instagram-official/1.jpg';
import igOfficial2 from '../images/instagram-official/2.jpg';
import igOfficial3 from '../images/instagram-official/3.jpg';
import igOfficial4 from '../images/instagram-official/4.jpg';
import igOfficial5 from '../images/instagram-official/5.jpg';
import igOfficial6 from '../images/instagram-official/6.jpg';
import igQna1 from '../images/instagram-qna/1.jpg';
import igQna2 from '../images/instagram-qna/2.jpg';
import igQna3 from '../images/instagram-qna/3.jpg';
import igQna4 from '../images/instagram-qna/4.jpg';
import igQna5 from '../images/instagram-qna/5.jpg';
import igQna6 from '../images/instagram-qna/6.jpg';
import igJobProfile from '../images/instagram-job/profile.jpg';
import igOfficialProfile from '../images/instagram-official/profile.jpg';
import igQnaProfile from '../images/instagram-qna/profile.jpg';

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
  profileImage?: string;
  thumbnails: InstagramThumbnail[];
};

const INSTAGRAM_OFFICIAL_LINK =
  'https://www.instagram.com/letscareer.official?igsh=MTNkMDNxcWt5MG43bA==';
const INSTAGRAM_JOB_LINK =
  'https://www.instagram.com/letscareer.job?igsh=dXl4YmhvOWdsYXU1';
const INSTAGRAM_QNA_LINK =
  'https://www.instagram.com/letscareer.qna?igsh=a24wYmdlNWM1amUy';

export const instagramChannels: InstagramChannel[] = [
  {
    id: 'official',
    handle: '@letscareer.official',
    label: '렛츠커리어 공식',
    description:
      '빠르고 트렌디한 취준 정보를 매일 오전 10시에 받아볼 수 있어요. 렛츠커리어의 모든 소식이 여기 담겨있어요.',
    link: INSTAGRAM_OFFICIAL_LINK,
    profileImage: igOfficialProfile.src,
    thumbnails: [
      { src: igOfficial1.src, alt: '2026 자유양식 이력서 템플릿' },
      { src: igOfficial2.src, alt: '삼성·롯데 인적성 시작을 시작해' },
      { src: igOfficial3.src, alt: '문과 직무 SQL & AI 활용 실습' },
      { src: igOfficial4.src, alt: '자소서 제출 직전 성과가 없어 보인다면' },
      { src: igOfficial5.src, alt: '네이버 마케터 ADsP·SQLD 따야 돼?' },
      { src: igOfficial6.src, alt: 'AI 면접관 프롬프트 공개' },
    ],
  },
  {
    id: 'job',
    handle: '@letscareer.job',
    label: '렛츠커리어 오공고',
    description:
      '문과 취준생을 위해 큐레이션된 채용공고와 직무 인사이트를 인스타그램으로 가장 빠르게 만나보세요.',
    link: INSTAGRAM_JOB_LINK,
    profileImage: igJobProfile.src,
    thumbnails: [
      { src: igJob1.src, alt: '오공고 소개' },
      { src: igJob2.src, alt: '인턴 합격 후기' },
      { src: igJob3.src, alt: '카카오스타일 마케팅 인턴 채용' },
      { src: igJob4.src, alt: 'PTKOREA 공채 문과 직무' },
      { src: igJob5.src, alt: '오늘의집 Recruiting Coordinator' },
      { src: igJob6.src, alt: '당근마켓 그로스 매니저 인턴' },
    ],
  },
  {
    id: 'qna',
    handle: '@letscareer.qna',
    label: '렛츠커리어 QNA',
    description:
      '현직자 멘토와 커리어 매니저에게 무제한 질의응답. 취업 고민을 편하게 올려두세요.',
    link: INSTAGRAM_QNA_LINK,
    profileImage: igQnaProfile.src,
    thumbnails: [
      { src: igQna1.src, alt: '취준생의 현실 12시간 루틴' },
      { src: igQna2.src, alt: '인적성 면접 준비 가이드' },
      { src: igQna3.src, alt: '인스타그램 광고로 역량 쌓는법' },
      { src: igQna4.src, alt: 'AI 티 나는 문장 4가지' },
      { src: igQna5.src, alt: '면접에서 AI 써봤냐고 물어보면' },
      { src: igQna6.src, alt: '계약직 vs 정규직 퍼포먼스 QNA' },
    ],
  },
];
