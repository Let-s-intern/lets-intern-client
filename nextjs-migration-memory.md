# React Router → Next.js 마이그레이션 메모리

## 🔄 매 커밋 필수 작업 지침

**⚠️ 매번 페이지 변환 커밋 시 다음 작업을 반드시 수행:**

1. **한 커밋에 삭제+추가**: 기존 router-pages 파일 삭제와 새 app 디렉토리 파일 추가를 동일한 커밋에 포함하여 git이 rename/replace로 인식하도록 함
2. **Router.tsx 타입 에러 방지**: 변환된 페이지의 element props를 Router.tsx에서 제거하여 타입 에러 방지
3. **Memory 파일 업데이트**: 완료된 작업을 이 파일에 체크 표시하고 진행 상황 업데이트
4. **커밋 메시지 포맷**: 변환된 페이지 목록과 주요 변경사항을 명확히 기록

**예시 커밋 순서:**
```bash
# 1. 새 페이지 생성
# 2. 기존 router-pages 파일 삭제  
# 3. Router.tsx element props 제거
# 4. 이 메모리 파일 업데이트
# 5. 모든 변경사항을 하나의 커밋으로 커밋
```

---

## 🎯 Phase 1: 핵심 인프라 (우선순위: 🔴 HIGH)

### 라우터 설정 파일

- [ ] `src/Router.tsx` - React Router 설정 완전 제거 (현재: element props 제거 중, 타입 에러 방지)
- [ ] `src/AdminRoutes.tsx` - 어드민 라우팅 (관리자용, 별도 처리)
- [ ] `src/App.tsx` - BrowserRouter 제거, Next.js 설정으로 변경

### 핵심 컨텍스트 & 레이아웃

- [x] `src/context/CurrentChallengeProvider.tsx` - useParams → Next.js params로 변경
- [x] `src/components/common/challenge/ui/layout/ChallengeLayout.tsx` - 라우팅 로직 변경
- [x] `src/components/common/challenge/ui/layout/NavBar.tsx` - 네비게이션 링크 변경
- [x] `src/components/common/ui/layout/Layout.tsx` - 메인 레이아웃 컴포넌트

## 🎯 Phase 2: 페이지 컴포넌트 변환 (우선순위: 🔴 HIGH)

### 챌린지 시스템 (최우선)

- [x] `src/router-pages/common/challenge/ChallengeDashboard.tsx` → `src/app/(user)/challenge/[applicationId]/[programId]/page.tsx`
- [x] `src/router-pages/common/challenge/MyChallengeDashboard.tsx` → `src/app/(user)/challenge/[applicationId]/[programId]/me/page.tsx`
- [x] `src/router-pages/common/challenge/ChallengeUserInfo.tsx` → `src/app/(user)/challenge/[applicationId]/[programId]/user/info/page.tsx`
- [x] `src/router-pages/common/challenge/MissionFeedback.tsx` → `src/app/(user)/challenge/[applicationId]/[programId]/challenge/[challengeId]/missions/[missionId]/feedback/page.tsx`

### Latest 리다이렉트 페이지

- [x] `src/router-pages/common/challenge/ExperienceSummaryLatest.tsx` → `src/app/(user)/challenge/experience-summary/latest/page.tsx`
- [x] `src/router-pages/common/challenge/PersonalStatementLatest.tsx` → `src/app/(user)/challenge/personal-statement/latest/page.tsx`
- [x] `src/router-pages/common/challenge/PortfolioLatest.tsx` → `src/app/(user)/challenge/portfolio/latest/page.tsx`
- [x] `src/router-pages/common/challenge/MarketingLatest.tsx` → `src/app/(user)/challenge/marketing/latest/page.tsx`

### 인증 페이지

- [x] `src/router-pages/common/auth/Login.tsx` → `src/app/(user)/login/page.tsx`
- [x] `src/router-pages/common/auth/SignUp.tsx` → `src/app/(user)/signup/page.tsx`
- [x] `src/router-pages/common/auth/FindPassword.tsx` → `src/app/(user)/find-password/page.tsx`

### 마이페이지

- [x] `src/router-pages/common/mypage/MyPage.tsx` → `src/app/(user)/mypage/layout.tsx`
- [x] `src/router-pages/common/mypage/Application.tsx` → `src/app/(user)/mypage/application/page.tsx`
- [x] `src/router-pages/common/mypage/Review.tsx` → `src/app/(user)/mypage/review/page.tsx`
- [x] `src/router-pages/common/mypage/Credit.tsx` → `src/app/(user)/mypage/credit/page.tsx`
- [x] `src/router-pages/common/mypage/CreditDetail.tsx` → `src/app/(user)/mypage/credit/[paymentId]/page.tsx`
- [x] `src/router-pages/common/mypage/CreditDelete.tsx` → `src/app/(user)/mypage/credit/[paymentId]/delete/page.tsx`
- [x] `src/router-pages/common/mypage/ReportCreditDetail.tsx` → `src/app/(user)/mypage/credit/report/[paymentId]/page.tsx`
- [x] `src/router-pages/common/mypage/ReportCreditDelete.tsx` → `src/app/(user)/mypage/credit/report/[paymentId]/delete/page.tsx`
- [x] `src/router-pages/common/mypage/Privacy.tsx` → `src/app/(user)/mypage/privacy/page.tsx`
- [x] `src/router-pages/common/mypage/Feedback.tsx` → `src/app/(user)/mypage/feedback/page.tsx`

## 🎯 Phase 3: 서브 시스템 (우선순위: 🟡 MEDIUM)

### 프로그램 관련

- [x] `src/router-pages/common/program/Programs.tsx` → `src/app/(user)/program/page.tsx`
- [x] `src/router-pages/common/program/Payment.tsx` → `src/app/(user)/payment/page.tsx`
- [x] `src/router-pages/common/program/PaymentInputPage.tsx` → `src/app/(user)/payment-input/page.tsx`
- [x] `src/router-pages/common/program/PaymentResult.tsx` → `src/app/(user)/order/result/page.tsx`
- [x] `src/router-pages/common/program/PaymentFail.tsx` → `src/app/(user)/order/fail/page.tsx`

### 서류진단 시스템

- [ ] `src/router-pages/common/report/ReportPage.tsx` → `src/app/(user)/report/landing/page.tsx`
- [ ] `src/router-pages/common/report/ReportResumePage.tsx` → `src/app/(user)/report/landing/resume/[[...reportId]]/page.tsx`
- [ ] `src/router-pages/common/report/ReportPersonalStatementPage.tsx` → `src/app/(user)/report/landing/personal-statement/[[...reportId]]/page.tsx`
- [ ] `src/router-pages/common/report/ReportPortfolioPage.tsx` → `src/app/(user)/report/landing/portfolio/[[...reportId]]/page.tsx`
- [ ] `src/router-pages/common/report/ReportApplyPage.tsx` → `src/app/(user)/report/apply/[reportType]/[reportId]/page.tsx`
- [ ] `src/router-pages/common/report/ReportPaymentPage.tsx` → `src/app/(user)/report/payment/[reportType]/[reportId]/page.tsx`
- [ ] `src/router-pages/common/report/ReportTossPage.tsx` → `src/app/(user)/report/toss/payment/page.tsx`
- [ ] `src/router-pages/common/report/ReportPaymentResult.tsx` → `src/app/(user)/report/order/result/page.tsx`
- [ ] `src/router-pages/common/report/ReportPaymentFail.tsx` → `src/app/(user)/report/order/fail/page.tsx`
- [ ] `src/router-pages/common/report/ReportManagementPage.tsx` → `src/app/(user)/report/management/page.tsx`
- [ ] `src/router-pages/common/report/ReportApplicationPage.tsx` → `src/app/(user)/report/[reportType]/application/[applicationId]/page.tsx`

### 리뷰 시스템

- [ ] `src/router-pages/common/review/ChallengeReviewCreatePage.tsx` → `src/app/(user)/mypage/review/new/challenge/[programId]/page.tsx`
- [ ] `src/router-pages/common/review/ChallengeReviewPage.tsx` → `src/app/(user)/mypage/review/challenge/[programId]/page.tsx`
- [ ] `src/router-pages/common/review/LiveReviewCreatePage.tsx` → `src/app/(user)/mypage/review/new/live/[programId]/page.tsx`
- [ ] `src/router-pages/common/review/LiveReviewPage.tsx` → `src/app/(user)/mypage/review/live/[programId]/page.tsx`
- [ ] `src/router-pages/common/review/ReportReviewCreatePage.tsx` → `src/app/(user)/mypage/review/new/report/[reportId]/page.tsx`
- [ ] `src/router-pages/common/review/ReportReviewPage.tsx` → `src/app/(user)/mypage/review/report/[reportId]/page.tsx`

### 기타 페이지

- [x] `src/router-pages/common/about/About.tsx` → `src/app/(user)/about/page.tsx`
- [ ] `src/router-pages/common/home/Home.tsx` → `src/app/(user)/page.tsx` (이미 존재함, 확인 필요)
- [ ] `src/router-pages/common/mentor/MentorNotificationBefore.tsx` → `src/app/(user)/live/[id]/mentor/notification/before/page.tsx`
- [ ] `src/router-pages/common/mentor/MentorNotificationAfter.tsx` → `src/app/(user)/live/[id]/mentor/notification/after/page.tsx`
- [ ] `src/router-pages/NotFound.tsx` → `src/app/not-found.tsx`

## 🎯 Phase 4: 컴포넌트 수정 (우선순위: 🟡 MEDIUM)

### 핵심 레이아웃 & 네비게이션 컴포넌트 (최우선)

- [ ] `src/components/common/ui/layout/header/NavBar.tsx` - Link → Next.js Link 변경
- [ ] `src/components/common/ui/layout/BottomNavBarWithPathname.tsx` - useLocation → usePathname
- [ ] `src/components/common/ui/HybridLink.tsx` - React Router Link → Next.js Link 통합
- [ ] `src/components/common/ui/BackHeader.tsx` - useNavigate → router.back()
- [ ] `src/components/common/auth/ui/SocialLogin.tsx` - 소셜 로그인 컴포넌트

### 챌린지 관련 컴포넌트

- [ ] `src/components/common/challenge/dashboard/section/DailyMissionSection.tsx`
- [ ] `src/components/common/challenge/dashboard/section/EndDailyMissionSection.tsx`
- [ ] `src/components/common/challenge/dashboard/section/GuideSection.tsx`
- [ ] `src/components/common/challenge/dashboard/section/NoticeSection.tsx`
- [ ] `src/components/common/challenge/MissionEndSection.tsx`
- [ ] `src/components/common/challenge/my-challenge/dropdown/AbsentContentsDropdown.tsx`
- [ ] `src/components/common/challenge/my-challenge/dropdown/ContentsDropdown.tsx`
- [ ] `src/components/common/challenge/my-challenge/dropdown/MenuContentsDropdown.tsx`
- [ ] `src/components/common/challenge/my-challenge/menu/AbsentContentsInfoMenu.tsx`
- [ ] `src/components/common/challenge/my-challenge/mission-calendar/MissionCalendarItem.tsx`
- [ ] `src/components/common/challenge/my-challenge/mission/DoneMissionDetailMenu.tsx`
- [ ] `src/components/common/challenge/my-challenge/mission/DoneMissionItem.tsx`
- [ ] `src/components/common/challenge/my-challenge/mission/MissionStatusMessage.tsx`
- [ ] `src/components/common/challenge/my-challenge/ParsedCommentBox.tsx`
- [ ] `src/components/common/challenge/my-challenge/section/DailyMissionInfoSection.tsx`
- [ ] `src/components/common/challenge/my-challenge/section/LastMissionSubmitModal.tsx`
- [ ] `src/components/common/challenge/my-challenge/section/MissionMentorCommentSection.tsx`
- [ ] `src/components/common/challenge/my-challenge/section/MissionSubmitBonusSection.tsx`
- [ ] `src/components/common/challenge/my-challenge/section/MissionSubmitRegularSection.tsx`
- [ ] `src/components/common/challenge/my-challenge/section/MissionSubmitZeroSection.tsx`
- [ ] `src/components/common/challenge/my-challenge/section/RecommendedProgramSwiper.tsx`
- [ ] `src/components/common/challenge/my-challenge/section/RecommendedProgramSection.tsx`
- [ ] `src/components/common/challenge/my-challenge/section/OtherMissionSection.tsx`
- [ ] `src/components/common/challenge/OtMissionInputSection.tsx`
- [ ] `src/components/common/challenge/OtMissionSubmitMenu.tsx`

### 마이페이지 관련 컴포넌트

- [ ] `src/components/common/mypage/application/section/ApplySection.tsx`
- [ ] `src/components/common/mypage/credit/CreditListItem.tsx`
- [ ] `src/components/common/mypage/credit/section/CreditList.tsx`
- [ ] `src/components/common/mypage/review/section/WaitingSection.tsx`
- [ ] `src/components/common/mypage/ui/button/LinkButton.tsx`
- [ ] `src/components/common/mypage/ui/card/root/ApplicationCard.tsx`
- [ ] `src/components/common/mypage/ui/nav/NavItem.tsx`

### 프로그램 관련 컴포넌트

- [ ] `src/components/common/program/banner/Banner.tsx`
- [ ] `src/components/common/program/program-detail/apply/content/OverviewContent.tsx`
- [ ] `src/components/common/program/program-detail/apply/content/ScheduleContent.tsx`
- [ ] `src/components/common/program/program-detail/regacy/apply/desktop/content/CautionContent.tsx`
- [ ] `src/components/common/program/program-detail/regacy/apply/desktop/content/MemberSelect.tsx`
- [ ] `src/components/common/program/program-detail/regacy/apply/desktop/content/StartContent.tsx`
- [ ] `src/components/common/program/program-detail/regacy/apply/mobile/content/MemberTypeContent.tsx`
- [ ] `src/components/common/program/program-detail/regacy/ui/Header.tsx`
- [ ] `src/components/common/program/program-detail/section/ApplySection.tsx`
- [ ] `src/components/common/program/ProgramCard.tsx`

### 기타 컴포넌트

- [ ] `src/components/ChallengeView.tsx`
- [ ] `src/components/LiveView.tsx`
- [ ] `src/components/common/about/modal/BootcampModal.tsx`
- [ ] `src/components/common/about/modal/ChallengeModal.tsx`
- [ ] `src/components/common/about/modal/LetsChatModal.tsx`
- [ ] `src/components/common/about/section/EndSection.tsx`
- [ ] `src/components/common/about/section/program/ProgramCard.tsx`
- [ ] `src/components/common/auth/ui/InfoContainer.tsx`
- [ ] `src/components/common/blog/BlogLikeBtn.tsx`
- [ ] `src/components/common/report/ReportLayout.tsx`
- [ ] `src/components/common/review/ReviewModal.tsx`
- [ ] `src/components/ui/scroll-to-top/ScrollToTop.tsx`

## 🎯 Phase 5: 유틸리티 & 훅 (우선순위: 🟢 LOW)

### 훅 수정

- [ ] `src/hooks/useMentorAccessControl.ts` - useParams → Next.js params
- [ ] 기타 React Router 의존성 있는 커스텀 훅들

### 레거시 파일 제거

- [ ] `src/router-pages/common/program/ChallengeDetailSSRPage.tsx` - 불필요한 레거시 파일
- [ ] `src/router-pages/common/program/LiveDetailSSRPage.tsx` - 불필요한 레거시 파일
- [ ] `src/router-pages/common/report/ReportNavigation.tsx` - 네비게이션 로직 통합
- [ ] `src/components/page/ReportNavigation.tsx` - 중복 컴포넌트

## 🔧 Package.json 수정

- [ ] `react-router-dom` 의존성 제거
- [ ] 관련 타입 정의 제거 (`@types/react-router-dom`)

## 🧪 테스트 & 검증

- [ ] 모든 페이지 접근 테스트
- [ ] URL 파라미터 전달 검증
- [ ] 네비게이션 흐름 테스트
- [ ] SEO 메타데이터 확인
- [ ] 성능 측정

---

## 📊 통계

- **총 변경 파일**: 113개 (어드민 시스템 제외)
- **신규 Next.js 페이지**: 47개
- **수정 컴포넌트**: 66개
- **우선순위 HIGH**: 22개 파일
- **우선순위 MEDIUM**: 78개 파일
- **우선순위 LOW**: 13개 파일

## 🚀 진행 상황

### ✅ 완료된 작업 (32/113) - 28.3%

#### Phase 1: 핵심 인프라 (4개 완료)
1. `src/context/CurrentChallengeProvider.tsx` - useParams → Next.js params로 변경
2. `src/components/common/challenge/ui/layout/ChallengeLayout.tsx` - Outlet → children, useNavigate → useRouter로 변경
3. `src/components/common/challenge/ui/layout/NavBar.tsx` - Link → Next.js Link, useLocation → usePathname으로 변경  
4. `src/components/common/ui/layout/Layout.tsx` - Outlet → children으로 변경

#### Phase 2: 페이지 컴포넌트 (23개 완료)

**챌린지 시스템 (4개)**
5. `src/app/(user)/challenge/[applicationId]/[programId]/page.tsx` - ChallengeDashboard
6. `src/app/(user)/challenge/[applicationId]/[programId]/me/page.tsx` - MyChallengeDashboard
7. `src/app/(user)/challenge/[applicationId]/[programId]/user/info/page.tsx` - ChallengeUserInfo
8. `src/app/(user)/challenge/[applicationId]/[programId]/challenge/[challengeId]/missions/[missionId]/feedback/page.tsx` - MissionFeedback

**Latest 리다이렉트 (4개)**
9. `src/app/(user)/challenge/experience-summary/latest/page.tsx` - ExperienceSummaryLatest
10. `src/app/(user)/challenge/personal-statement/latest/page.tsx` - PersonalStatementLatest
11. `src/app/(user)/challenge/portfolio/latest/page.tsx` - PortfolioLatest
12. `src/app/(user)/challenge/marketing/latest/page.tsx` - MarketingLatest

**인증 페이지 (3개)**
13. `src/app/(user)/login/page.tsx` - Login
14. `src/app/(user)/signup/page.tsx` - SignUp
15. `src/app/(user)/find-password/page.tsx` - FindPassword

**마이페이지 (10개)**
16. `src/app/(user)/mypage/layout.tsx` - MyPage 레이아웃
17. `src/app/(user)/mypage/application/page.tsx` - Application
18. `src/app/(user)/mypage/review/page.tsx` - Review
19. `src/app/(user)/mypage/credit/page.tsx` - Credit
20. `src/app/(user)/mypage/credit/[paymentId]/page.tsx` - CreditDetail
21. `src/app/(user)/mypage/credit/[paymentId]/delete/page.tsx` - CreditDelete
22. `src/app/(user)/mypage/credit/report/[paymentId]/page.tsx` - ReportCreditDetail
23. `src/app/(user)/mypage/credit/report/[paymentId]/delete/page.tsx` - ReportCreditDelete
24. `src/app/(user)/mypage/privacy/page.tsx` - Privacy
25. `src/app/(user)/mypage/feedback/page.tsx` - Feedback

#### Phase 3: 서브 시스템 (5개 완료)

**프로그램 관련 (5개)**
26. `src/app/(user)/program/page.tsx` - Programs (복잡한 필터링 로직 포함)
27. `src/app/(user)/payment/page.tsx` - Payment (Toss Payments 통합)
28. `src/app/(user)/payment-input/page.tsx` - PaymentInputPage (복잡한 결제 폼)
29. `src/app/(user)/order/result/page.tsx` - PaymentResult
30. `src/app/(user)/order/fail/page.tsx` - PaymentFail

**기타 페이지 (1개)**
31. `src/app/(user)/about/page.tsx` - About

### 🔄 다음 작업 예정
- 서류진단 시스템 (11개 페이지)
- 리뷰 시스템 페이지들 (6개 페이지)
- 기타 페이지들 (MentorNotification, Home, NotFound)
- 핵심 컴포넌트 수정 (네비게이션, 링크 컴포넌트 등)

## ⚠️ 주의사항

1. **Phase 1 완료 후 Phase 2 시작** - 의존성 순서 중요
2. **챌린지 시스템 우선** - 핵심 비즈니스 로직
3. **URL 호환성 유지** - 기존 링크 깨짐 방지
4. **모든 작업 완료 후 종합 테스트** - 전체 마이그레이션 완료 후 일괄 검증
5. **어드민 시스템 제외** - 본 마이그레이션에서는 사용자 페이지만 대상
6. **useParams 타입 지정** - `const params = useParams<{ paramName: string }>();` 형태로 사용
7. **매 커밋마다 Router.tsx 정리** - 타입 에러 방지를 위한 element props 제거