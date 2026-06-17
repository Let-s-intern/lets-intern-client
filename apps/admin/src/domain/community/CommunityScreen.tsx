import HeroSection from './sections/HeroSection';
import InstagramSection from './sections/InstagramSection';
import KakaoSection from './sections/KakaoSection';
import StatsSection from './sections/StatsSection';

export default function CommunityScreen() {
  return (
    <main className="w-full text-neutral-900">
      {/* Hero */}
      <HeroSection />

      {/* Stats - desktop only */}
      <StatsSection />

      {/* Kakao Open Chat Section */}
      <KakaoSection />

      {/* Instagram Section */}
      <InstagramSection />
    </main>
  );
}
