import { motion } from 'motion/react';
import Image from '@/common/ui/Image';
import { FADE_IN } from '../animations';
import OgonggoBlock from '../components/OgonggoBlock';
import QnaChatCard from '../components/QnaChatCard';
import { kakaoRooms } from '../data/kakao';

export default function KakaoSection() {
  return (
    <section className="w-full">
      <div className="mw-1180 py-16 md:py-32">
        {/* Section header - B2B SectionHeader style */}
        <motion.div className="mb-10 text-center md:mb-16" {...FADE_IN()}>
          <p className="text-xsmall16 text-primary-90 flex items-center justify-center gap-1.5 font-medium">
            <Image
              src="/icons/kakao-circle.svg"
              alt=""
              width={24}
              height={24}
            />
            카카오톡 오픈채팅방
          </p>
          <h2 className="text-static-0 mt-4 break-keep text-[26px] font-bold leading-[1.35] md:mt-6 md:text-[40px]">
            취준 고민, 혼자 안고 있지 마세요
          </h2>
          <p className="text-xsmall14 text-neutral-40 md:text-small20 mt-4 break-keep leading-[22px]">
            렛츠커리어 커뮤니티에서 질문하고 정보 나누며 함께 취뽀해요.
          </p>
        </motion.div>

        {/* QNA cards - 2col desktop, 1col mobile */}
        <motion.div
          className="mb-6 grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:gap-5"
          {...FADE_IN(0.05)}
        >
          {kakaoRooms.map((room) => (
            <QnaChatCard key={room.id} room={room} />
          ))}
        </motion.div>

        {/* Ogonggo block */}
        <motion.div className="px-4" {...FADE_IN(0.1)}>
          <OgonggoBlock />
        </motion.div>
      </div>
    </section>
  );
}
