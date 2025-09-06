'use client';

import FeatureCard from './FeatureCard';
import a1 from '../_images/achievement-1.png';
import a2 from '../_images/achievement-2.png';
import a3 from '../_images/achievement-3.png';

export default function Metrics() {
  const stats = [
    { label: '교육 만족도', value: '4.6점' },
    { label: '누적 참여자 수', value: '5,000+명' },
    { label: '수료율', value: '80+%' },
    { label: '누적 후기 개수', value: '3,300+개' },
    { label: '인스타그램 팔로워 수', value: '1.8M' },
    { label: '커뮤니티 참여자 수', value: '2,500+명' },
  ];

  return (
    <div className="space-y-10">
      <div className="rounded-ms bg-white px-4 py-7 shadow-sm">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          {stats.map((s, i) => {
            const m = s.value.match(/^([0-9.,+]+)(.*)$/);
            const number = m ? m[1] : s.value;
            const unit = m ? m[2] : '';
            return (
              <div key={i} className="text-center">
                <div className="text-xsmall16 font-medium leading-relaxed text-neutral-20 md:leading-normal">
                  {s.label}
                </div>
                <div className="mt-2 leading-[1.3] md:mt-1 md:leading-tight">
                  <span className="text-[36px] font-bold tracking-[-3px] text-static-0">
                    {number}
                  </span>
                  {unit && (
                    <span className="ml-1 align-baseline text-[24px] font-semibold">
                      {unit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <FeatureCard
          title="취업 트렌드 콘텐츠 상시 제공"
          desc="렛츠커리어 자체 블로그 및 인스타그램을 통해 취업 시장 트렌드에 맞는 콘텐츠를 제공합니다."
          imageSrc={a1}
          imageAlt="성과 이미지 1"
        />

        <FeatureCard
          title="취업 여정에 맞는 서류 작성 교육"
          desc="경험정리부터 직무탐색, 서류 3종 완성 및 발전까지 취업 여정에 맞는 교육을 제공합니다."
          imageSrc={a2}
          imageAlt="성과 이미지 2"
        />

        <FeatureCard
          title="교육 참여 후 후속 관리"
          desc="교육 마무리 후에도 무제한 질의응답이 가능하고, 취준생간 네트워킹 및 정보교류가 가능한 커뮤니티를 통해 취업 성공까지 함께 합니다."
          imageSrc={a3}
          imageAlt="성과 이미지 3"
        />
      </div>
    </div>
  );
}
