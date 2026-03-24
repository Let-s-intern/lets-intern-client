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

      {/* Instagram Section */}
      <InstagramSection />
    </main>
  );
}
