'use client';

import HeroSection from './sections/HeroSection';
import InstagramSection from './sections/InstagramSection';
import KakaoSection from './sections/KakaoSection';

export default function CommunityScreen() {
  return (
    <main className="w-full text-neutral-900">
      {/* Hero */}
      <HeroSection />

      {/* Kakao Open Chat Section */}
      <KakaoSection />

      {/* Instagram Section */}
      <InstagramSection />
    </main>
  );
}
