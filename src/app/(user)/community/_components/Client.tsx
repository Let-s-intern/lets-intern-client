'use client';

import Hero from './Hero';
import InstagramSection from './InstagramSection';
import KakaoSection from './KakaoSection';

export default function Client() {
  return (
    <main className="w-full text-neutral-900">
      {/* Hero */}
      <Hero />

      {/* Kakao Open Chat Section */}
      <KakaoSection />

      {/* Section divider */}
      <div className="mw-1180 px-4">
        <hr className="border-t-2 border-dashed border-neutral-70" />
      </div>

      {/* Instagram Section */}
      <InstagramSection />
    </main>
  );
}
