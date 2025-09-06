'use client';

import { motion } from 'motion/react';
import Image, { StaticImageData } from 'next/image';
import Avatar1 from '../_images/avatar-1.svg';
import Avatar2 from '../_images/avatar-2.svg';
import Avatar3 from '../_images/avatar-3.svg';
import Avatar4 from '../_images/avatar-4.svg';
import { LOGO } from '../_images/logos';

type Quote = {
  logo: StaticImageData;
  title: string;
  content: string;
  author: string;
  Avatar: React.ComponentType<React.ComponentProps<'svg'>>;
};

const quotes: Quote[] = [
  {
    logo: LOGO['learn spoonz'],
    title: '서류 완성부터 면접 특강까지 취업 교육 문제는 한 번에 해결했습니다.',
    content:
      'SeSAC 교육 과정을 운영하며, 취업률 향상을 위해 렛츠커리어 프로그램을 도입했습니다. 교육생들이 자발적으로 서류를 완성할 수 있게 단계별 미션을 제공해 주시고, 오프라인 특강도 진행해 주셔서 교육 만족도를 끌어올릴 수 있었습니다. 장기적으로 취업 교육 관점에서 렛츠커리어와 협업하여 성장하길 바랍니다! ',
    author: '러닝스푼즈 J 매니저님',
    Avatar: Avatar1,
  },
  {
    logo: LOGO['sniperfactory'],
    title:
      '원하는 직무의 현직자분들을 연결해 주시고, 요청 사항도 늘 잘 반영해 주셔서 취업 교육을 걱정하지 않아도 되었습니다.',
    content:
      '교육과정별 수료생분들의 특성을 잘 이해하여 취업 특강을 준비해 주셔서 교육생 만족도가 높았습니다. 강의 기획부터 운영까지 매끄럽게 마무리할 수 있어 편리합니다. 강사님, 매니저님 모두 잘 신경 써 주셔서 교육 운영을 잘 진행할 수 있었습니다.',
    author: '스나이퍼팩토리 L 연구원님',
    Avatar: Avatar2,
  },
  {
    logo: LOGO['슈퍼인턴'],
    title: '취준생 서류 완성은 렛츠커리어',
    content:
      '주니어 채용 연계 서비스 슈퍼인턴을 운영하며, 취준생과 기업을 연결하는 관점에서 렛츠커리어 서류 교육을 진행했습니다. 수십 건의 채용을 성사시키며 렛츠커리어의 취업 인사이트가 큰 도움이 되었습니다. 취준생과 가장 가까이에서 소통하는 렛츠커리어 교육은 적극 추천합니다!',
    author: '슈퍼인턴 K 대표님',
    Avatar: Avatar3,
  },
  {
    logo: LOGO['sniperfactory'],
    title:
      '프로그램 기획부터 운영까지 단계별 로드맵을 제시해 주시고 부트캠프 교육에 맞게 취업 교육이 진행되어 좋았습니다.',
    content:
      '교육 기획부터 마무리, 결과 보고까지 잘 진행해 주시고, 취업 교육 관련 문의에도 상세한 레퍼런스를 제공해 주셔서 교육을 운영하며 도움이 많이 되었습니다. 취업준비생과 가장 가까이에서 소통한다는 장점이 부트캠프 교육생분들께도 큰 도움이 된 듯합니다.',
    author: '스나이퍼팩토리 M 책임연구원님',
    Avatar: Avatar4,
  },
];

export default function ClientTestimonials() {
  return (
    <div>
      <motion.p
        className="text-center text-xsmall16 font-medium text-primary-90"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.55 }}
      >
        고객사 후기
      </motion.p>
      <motion.h2
        className="mt-7 break-keep text-center text-[40px] font-bold"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.55, delay: 0.05 }}
      >
        렛츠커리어와 함께한 교육 담당자분들의 이야기입니다
      </motion.h2>
      {/* Client Review Cards - Horizontal Scroll */}
      <motion.div
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-16 w-screen"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative overflow-x-auto scrollbar-hide">
          <div className="grid w-max auto-cols-[360px] grid-flow-col gap-3 px-[max(1.5rem,calc((100vw-1120px)/2))]">
            {quotes.map((q, i) => (
              <motion.blockquote
                key={i}
                className="relative rounded-sm bg-white shadow-sm"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <div className="p-2.5 px-4 pb-1.5">
                  <Image
                    src={q.logo}
                    alt="고객사 로고"
                    width={140}
                    height={48}
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <div className="px-5 pb-5 pt-0">
                  <span
                    aria-hidden
                    className="absolute left-4 top-2 text-[44px] leading-none text-primary-20"
                  ></span>
                  <h3 className="mb-2 break-keep text-small18 font-semibold text-neutral-800">
                    {q.title}
                  </h3>
                  <p className="mb-4 break-keep text-xsmall16 text-neutral-600">
                    {q.content}
                  </p>
                  <div className="flex items-center gap-3">
                    <q.Avatar className="h-8 w-8 rounded-full" />
                    <footer className="text-0.875-medium text-neutral-40">
                      {q.author}
                    </footer>
                  </div>
                </div>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
