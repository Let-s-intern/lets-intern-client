import BlogReviewCard from '@components/common/review/BlogReviewCard';
import ReviewFilter from '@components/common/review/ReviewFilter';
import { singleReviewFilterList } from '../../dev/page';

const blogReviewMockList = [
  {
    blogReviewId: 1,
    postDate: '2022-01-01',
    programType: '웹 개발',
    programTitle: '풀 스택 웹 개발',
    name: '김도연',
    title: '웹 개발 경력을 열어라',
    url: 'https://example.com/web-dev-review',
    thumbnail: 'https://example.com/web-dev-thumbnail.jpg',
    description: '웹 개발에 대한 리뷰입니다.',
  },
  {
    blogReviewId: 2,
    postDate: '2022-02-01',
    programType: '데이터 과학',
    programTitle: '데이터 과학 부트캠프',
    name: '박지수',
    title: '데이터 과학: 기술의 미래',
    url: 'https://example.com/data-science-review',
    thumbnail: 'https://example.com/data-science-thumbnail.jpg',
    description: '데이터 과학에 대한 리뷰입니다.',
  },
  {
    blogReviewId: 3,
    postDate: '2022-03-01',
    programType: '사이버 보안',
    programTitle: '사이버 보안 기초',
    name: '이민호',
    title: '디지털 세계를 보호하세요',
    url: 'https://example.com/cybersecurity-review',
    thumbnail: 'https://example.com/cybersecurity-thumbnail.jpg',
    description: '사이버 보안에 대한 리뷰입니다.',
  },
  {
    blogReviewId: 4,
    postDate: '2022-04-01',
    programType: '인공 지능',
    programTitle: 'AI 및 머신 러닝',
    name: '김하영',
    title: 'AI 혁명',
    url: 'https://example.com/ai-review',
    thumbnail: 'https://example.com/ai-thumbnail.jpg',
    description: '인공 지능에 대한 리뷰입니다.',
  },
  {
    blogReviewId: 5,
    postDate: '2022-05-01',
    programType: '디지털 마케팅',
    programTitle: '디지털 마케팅 전략',
    name: '박상현',
    title: '디지털 시대의 마케팅',
    url: 'https://example.com/digital-marketing-review',
    thumbnail: 'https://example.com/digital-marketing-thumbnail.jpg',
    description: '디지털 마케팅에 대한 리뷰입니다.',
  },
  {
    blogReviewId: 6,
    postDate: '2022-06-01',
    programType: '클라우드 컴퓨팅',
    programTitle: '클라우드 컴퓨팅 기초',
    name: '김수진',
    title: '클라우드 혁명',
    url: 'https://example.com/cloud-computing-review',
    thumbnail: 'https://example.com/cloud-computing-thumbnail.jpg',
    description: '클라우드 컴퓨팅에 대한 리뷰입니다.',
  },
  {
    blogReviewId: 7,
    postDate: '2022-07-01',
    programType: '네트워킹',
    programTitle: '네트워킹 기초',
    name: '이현우',
    title: '미래를 위한 네트워크 구축',
    url: 'https://example.com/networking-review',
    thumbnail: 'https://example.com/networking-thumbnail.jpg',
    description: '네트워킹에 대한 리뷰입니다.',
  },
  {
    blogReviewId: 8,
    postDate: '2022-08-01',
    programType: '데이터베이스 관리',
    programTitle: '데이터베이스 관리',
    name: '김지은',
    title: '성공을 위한 데이터 관리',
    url: 'https://example.com/database-management-review',
    thumbnail: 'https://example.com/database-management-thumbnail.jpg',
    description: '데이터베이스 관리에 대한 리뷰입니다.',
  },
];

const Page = () => {
  return (
    <div className="px-5 md:px-0 w-full">
      <ReviewFilter
        label="나는 필터야"
        list={singleReviewFilterList}
        defaultValue={singleReviewFilterList[0].value}
      />
      <section className="flex flex-col gap-6">
        {blogReviewMockList.map((data) => (
          <BlogReviewCard key={data.blogReviewId} blogReview={data} />
        ))}
      </section>
    </div>
  );
};

export default Page;
