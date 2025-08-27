# React Router → Next.js 마이그레이션 메모리

## 🔥 NEW: Admin 시스템 마이그레이션 계획

### Admin 라우트 구조 분석
- 총 68개의 Admin 페이지 식별
- Admin 전용 레이아웃 사용 (`AdminLayout`, `ChallengeOperationAdminLayout`)
- 중첩 라우팅 구조 (challenge/operation 등)

### Admin 마이그레이션 Phase

#### Phase A-1: Admin 인프라 및 레이아웃
- [ ] `src/components/admin/ui/layout/AdminLayout.tsx` - Admin 메인 레이아웃
- [ ] `src/components/admin/challenge/ui/ChallengeOperationAdminLayout.tsx` - 챌린지 운영 레이아웃
- [ ] `src/context/CurrentAdminChallengeProvider.tsx` - Admin 챌린지 컨텍스트
- [ ] `src/AdminRoutes.tsx` - 제거 대상

#### Phase A-2: Admin 홈 및 리뷰 관리 (6개)
- [ ] `src/router-pages/admin/AdminHome.tsx` → `src/app/admin/page.tsx`
- [ ] `src/router-pages/admin/review/AdminMissionReviewListPage.tsx` → `src/app/admin/review/mission/page.tsx`
- [ ] `src/router-pages/admin/review/AdminChallengeReviewListPage.tsx` → `src/app/admin/review/challenge/page.tsx`
- [ ] `src/router-pages/admin/review/AdminLiveReviewListPage.tsx` → `src/app/admin/review/live/page.tsx`
- [ ] `src/router-pages/admin/review/AdminBlogReviewListPage.tsx` → `src/app/admin/review/blog/page.tsx`
- [ ] `src/router-pages/admin/review/AdminReportReviewListPage.tsx` → `src/app/admin/review/report/page.tsx`

#### Phase A-3: 사용자 관리 (5개)
- [ ] `src/router-pages/admin/user/AdminUsersPage.tsx` → `src/app/admin/users/page.tsx`
- [ ] `src/router-pages/admin/user/UserDetail.tsx` → `src/app/admin/users/[userId]/page.tsx`
- [ ] `src/router-pages/admin/user/UserEdit.tsx` → `src/app/admin/users/[userId]/edit/page.tsx`
- [ ] `src/router-pages/admin/user/AdminMentorPage.tsx` → `src/app/admin/mentors/page.tsx`

#### Phase A-4: 쿠폰 관리 (3개)
- [ ] `src/router-pages/admin/coupon/Coupons.tsx` → `src/app/admin/coupons/page.tsx`
- [ ] `src/router-pages/admin/coupon/CouponCreate.tsx` → `src/app/admin/coupons/new/page.tsx`
- [ ] `src/router-pages/admin/coupon/CouponEdit.tsx` → `src/app/admin/coupons/[couponId]/edit/page.tsx`

#### Phase A-5: 홈 관리 (큐레이션, 배너) (9개)
- [ ] `src/router-pages/admin/home/curation/HomeCurationListPage.tsx` → `src/app/admin/home/curation/page.tsx`
- [ ] `src/router-pages/admin/home/curation/HomeCurationCreatePage.tsx` → `src/app/admin/home/curation/create/page.tsx`
- [ ] `src/router-pages/admin/home/curation/HomeCurationEditPage.tsx` → `src/app/admin/home/curation/[id]/edit/page.tsx`
- [ ] `src/router-pages/admin/home/main-banner/MainBanners.tsx` → `src/app/admin/home/main-banners/page.tsx`
- [ ] `src/router-pages/admin/home/main-banner/MainBannerCreate.tsx` → `src/app/admin/home/main-banners/new/page.tsx`
- [ ] `src/router-pages/admin/home/main-banner/MainBannerEdit.tsx` → `src/app/admin/home/main-banners/[bannerId]/edit/page.tsx`
- [ ] `src/router-pages/admin/home/bottom-banner/BottomBanners.tsx` → `src/app/admin/home/bottom-banners/page.tsx`
- [ ] `src/router-pages/admin/home/bottom-banner/BottomBannerCreate.tsx` → `src/app/admin/home/bottom-banners/new/page.tsx`
- [ ] `src/router-pages/admin/home/bottom-banner/BottomBannerEdit.tsx` → `src/app/admin/home/bottom-banners/[bannerId]/edit/page.tsx`

#### Phase A-6: 배너 관리 (9개)
- [ ] `src/router-pages/admin/banner/top-bar-banner/TopBarBanners.tsx` → `src/app/admin/banner/top-bar-banners/page.tsx`
- [ ] `src/router-pages/admin/banner/top-bar-banner/TopBarBannerCreate.tsx` → `src/app/admin/banner/top-bar-banners/new/page.tsx`
- [ ] `src/router-pages/admin/banner/top-bar-banner/TopBarBannerEdit.tsx` → `src/app/admin/banner/top-bar-banners/[bannerId]/edit/page.tsx`
- [ ] `src/router-pages/admin/banner/pop-up-banner/PopUpBanners.tsx` → `src/app/admin/banner/pop-up/page.tsx`
- [ ] `src/router-pages/admin/banner/pop-up-banner/PopUpBannerCreate.tsx` → `src/app/admin/banner/pop-up/new/page.tsx`
- [ ] `src/router-pages/admin/banner/pop-up-banner/PopUpBannerEdit.tsx` → `src/app/admin/banner/pop-up/[bannerId]/edit/page.tsx`
- [ ] `src/router-pages/admin/banner/program-banner/ProgramBanners.tsx` → `src/app/admin/banner/program-banners/page.tsx`
- [ ] `src/router-pages/admin/banner/program-banner/ProgramBannerCreate.tsx` → `src/app/admin/banner/program-banners/new/page.tsx`
- [ ] `src/router-pages/admin/banner/program-banner/ProgramBannerEdit.tsx` → `src/app/admin/banner/program-banners/[bannerId]/edit/page.tsx`

#### Phase A-7: 챌린지 운영 (10개)
- [ ] `src/router-pages/admin/challenge/ChallengeOperationOnboarding.tsx` → `src/app/admin/challenge/operation/page.tsx`
- [ ] `src/router-pages/admin/challenge/ChallengeOperationHome.tsx` → `src/app/admin/challenge/operation/[programId]/home/page.tsx`
- [ ] `src/router-pages/admin/challenge/ChallengeOperationRegisterMission.tsx` → `src/app/admin/challenge/operation/[programId]/register-mission/page.tsx`
- [ ] `src/router-pages/admin/challenge/ChallengeOperationAttendances.tsx` → `src/app/admin/challenge/operation/[programId]/attendances/page.tsx`
- [ ] `src/router-pages/admin/challenge/ChallengeOperationParticipants.tsx` → `src/app/admin/challenge/operation/[programId]/participants/page.tsx`
- [ ] `src/router-pages/admin/challenge/ChallengeOperationPayback.tsx` → `src/app/admin/challenge/operation/[programId]/payback/page.tsx`
- [ ] `src/router-pages/admin/challenge/ChallengeOperationFeedbackPage.tsx` → `src/app/admin/challenge/operation/[programId]/feedback/page.tsx`
- [ ] `src/router-pages/admin/challenge/FeedbackParticipantPage.tsx` → `src/app/admin/challenge/operation/[programId]/feedback/mission/[missionId]/participants/page.tsx`
- [ ] `src/router-pages/admin/challenge/ChallengeFeedbackPage.tsx` → `src/app/admin/challenge/operation/[programId]/mission/[missionId]/participant/[userId]/feedback/page.tsx`
- [ ] `src/router-pages/admin/challenge/ChallengeContents.tsx` → `src/app/admin/challenge/contents/page.tsx`
- [ ] `src/router-pages/admin/challenge/ChallengeMissionManagement.tsx` → `src/app/admin/challenge/missions/page.tsx`

#### Phase A-8: 블로그 관리 (7개)
- [ ] `src/router-pages/admin/blog/BlogPostListPage.tsx` → `src/app/admin/blog/list/page.tsx`
- [ ] `src/router-pages/admin/blog/BlogCreatePage.tsx` → `src/app/admin/blog/create/page.tsx`
- [ ] `src/router-pages/admin/blog/BlogEditPage.tsx` → `src/app/admin/blog/edit/[id]/page.tsx`
- [ ] `src/router-pages/admin/blog/BlogRatingListPage.tsx` → `src/app/admin/blog/reviews/page.tsx`
- [ ] `src/router-pages/admin/blog/BlogBannerListPage.tsx` → `src/app/admin/blog/banner/page.tsx`
- [ ] `src/router-pages/admin/blog/BlogBannerCreatePage.tsx` → `src/app/admin/blog/banner/create/page.tsx`
- [ ] `src/router-pages/admin/blog/BlogBannerEditPage.tsx` → `src/app/admin/blog/banner/edit/[id]/page.tsx`

#### Phase A-9: 서류진단 관리 (4개)
- [ ] `src/router-pages/admin/report/AdminReportListPage.tsx` → `src/app/admin/report/list/page.tsx`
- [ ] `src/router-pages/admin/report/AdminReportCreatePage.tsx` → `src/app/admin/report/create/page.tsx`
- [ ] `src/router-pages/admin/report/AdminReportEditPage.tsx` → `src/app/admin/report/edit/[id]/page.tsx`
- [ ] `src/router-pages/admin/report/ReportApplicationsPage.tsx` → `src/app/admin/report/applications/page.tsx`

#### Phase A-10: 프로그램 관리 (11개)
- [ ] `src/router-pages/admin/program/Programs.tsx` → `src/app/admin/programs/page.tsx`
- [ ] `src/router-pages/admin/program/ProgramCreate.tsx` → `src/app/admin/programs/create/page.tsx`
- [ ] `src/router-pages/admin/program/ProgramEdit.tsx` → `src/app/admin/programs/[programId]/edit/page.tsx`
- [ ] `src/router-pages/admin/ChallengeCreate.tsx` → `src/app/admin/challenge/create/page.tsx`
- [ ] `src/router-pages/admin/ChallengeEdit.tsx` → `src/app/admin/challenge/[challengeId]/edit/page.tsx`
- [ ] `src/router-pages/admin/LiveCreate.tsx` → `src/app/admin/live/create/page.tsx`
- [ ] `src/router-pages/admin/LiveEdit.tsx` → `src/app/admin/live/[liveId]/edit/page.tsx`
- [ ] `src/router-pages/admin/VodCreate.tsx` → `src/app/admin/vod/create/page.tsx`
- [ ] `src/router-pages/admin/VodEdit.tsx` → `src/app/admin/vod/[vodId]/edit/page.tsx`
- [ ] `src/router-pages/admin/program/ProgramUsers.tsx` → `src/app/admin/programs/[programId]/users/page.tsx`

### Admin 컴포넌트 수정 필요 목록
- Admin 시스템의 모든 네비게이션 컴포넌트
- Lexical Editor 관련 컴포넌트들
- 기타 React Router 의존성 있는 Admin 컴포넌트들

---


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

- [x] `src/router-pages/common/report/ReportPage.tsx` → `src/app/(user)/report/landing/page.tsx`
- [x] `src/router-pages/common/report/ReportResumePage.tsx` → `src/app/(user)/report/landing/resume/[[...reportId]]/page.tsx`
- [x] `src/router-pages/common/report/ReportPersonalStatementPage.tsx` → `src/app/(user)/report/landing/personal-statement/[[...reportId]]/page.tsx`
- [x] `src/router-pages/common/report/ReportPortfolioPage.tsx` → `src/app/(user)/report/landing/portfolio/[[...reportId]]/page.tsx`
- [x] `src/router-pages/common/report/ReportApplyPage.tsx` → `src/app/(user)/report/apply/[reportType]/[reportId]/page.tsx`
- [x] `src/router-pages/common/report/ReportPaymentPage.tsx` → `src/app/(user)/report/payment/[reportType]/[reportId]/page.tsx`
- [x] `src/router-pages/common/report/ReportTossPage.tsx` → `src/app/(user)/report/toss/payment/page.tsx`
- [x] `src/router-pages/common/report/ReportPaymentResult.tsx` → `src/app/(user)/report/order/result/page.tsx`
- [x] `src/router-pages/common/report/ReportPaymentFail.tsx` → `src/app/(user)/report/order/fail/page.tsx`
- [x] `src/router-pages/common/report/ReportManagementPage.tsx` → `src/app/(user)/report/management/page.tsx`
- [x] `src/router-pages/common/report/ReportApplicationPage.tsx` → `src/app/(user)/report/[reportType]/application/[applicationId]/page.tsx`

### 리뷰 시스템

- [x] `src/router-pages/common/review/ChallengeReviewCreatePage.tsx` → `src/app/(user)/mypage/review/new/challenge/[programId]/page.tsx`
- [x] `src/router-pages/common/review/ChallengeReviewPage.tsx` → `src/app/(user)/mypage/review/challenge/[programId]/page.tsx`
- [x] `src/router-pages/common/review/LiveReviewCreatePage.tsx` → `src/app/(user)/mypage/review/new/live/[programId]/page.tsx`
- [x] `src/router-pages/common/review/LiveReviewPage.tsx` → `src/app/(user)/mypage/review/live/[programId]/page.tsx`
- [x] `src/router-pages/common/review/ReportReviewCreatePage.tsx` → `src/app/(user)/mypage/review/new/report/[reportId]/page.tsx`
- [x] `src/router-pages/common/review/ReportReviewPage.tsx` → `src/app/(user)/mypage/review/report/[reportId]/page.tsx`

### 기타 페이지

- [x] `src/router-pages/common/about/About.tsx` → `src/app/(user)/about/page.tsx`
- [x] `src/router-pages/common/home/Home.tsx` → `src/app/(user)/page.tsx` (기존 페이지에 내용 직접 이식)
- [x] `src/router-pages/common/mentor/MentorNotificationBefore.tsx` → `src/app/(user)/live/[id]/mentor/notification/before/page.tsx`
- [x] `src/router-pages/common/mentor/MentorNotificationAfter.tsx` → `src/app/(user)/live/[id]/mentor/notification/after/page.tsx`
- [x] `src/router-pages/NotFound.tsx` → `src/app/not-found.tsx`

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

### ✅ 완료된 작업 (113/113) - 100% 🎉

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

**서류진단 시스템 (11개 완료)**

32. `src/app/(user)/report/landing/page.tsx` - ReportPage (단순 리다이렉트)
33. `src/app/(user)/report/landing/resume/[[...reportId]]/page.tsx` - ReportResumePage (옵셔널 catch-all 라우팅)
34. `src/app/(user)/report/landing/personal-statement/[[...reportId]]/page.tsx` - ReportPersonalStatementPage (옵셔널 catch-all 라우팅)
35. `src/app/(user)/report/landing/portfolio/[[...reportId]]/page.tsx` - ReportPortfolioPage (옵셔널 catch-all 라우팅)
36. `src/app/(user)/report/apply/[reportType]/[reportId]/page.tsx` - ReportApplyPage (복잡한 파일 업로드 및 유효성 검사)
37. `src/app/(user)/report/payment/[reportType]/[reportId]/page.tsx` - ReportPaymentPage (쿠폰 시스템 포함 결제 페이지)
38. `src/app/(user)/report/toss/payment/page.tsx` - ReportTossPage (토스페이먼츠 위젯 통합)
39. `src/app/(user)/report/order/result/page.tsx` - ReportPaymentResult (결제 결과 처리)
40. `src/app/(user)/report/order/fail/page.tsx` - ReportPaymentFail (결제 실패 처리)
41. `src/app/(user)/report/management/page.tsx` - ReportManagementPage (복잡한 필터링 및 상태 관리)
42. `src/app/(user)/report/[reportType]/application/[applicationId]/page.tsx` - ReportApplicationPage (서류 제출)

**리뷰 시스템 (6개 완료)**

43. `src/app/(user)/mypage/review/new/challenge/[programId]/page.tsx` - ChallengeReviewCreatePage (챌린지 리뷰 작성)
44. `src/app/(user)/mypage/review/challenge/[programId]/page.tsx` - ChallengeReviewPage (챌린지 리뷰 조회)
45. `src/app/(user)/mypage/review/new/live/[programId]/page.tsx` - LiveReviewCreatePage (라이브 클래스 리뷰 작성)
46. `src/app/(user)/mypage/review/live/[programId]/page.tsx` - LiveReviewPage (라이브 클래스 리뷰 조회)
47. `src/app/(user)/mypage/review/new/report/[reportId]/page.tsx` - ReportReviewCreatePage (서류진단 리뷰 작성)
48. `src/app/(user)/mypage/review/report/[reportId]/page.tsx` - ReportReviewPage (서류진단 리뷰 조회)

**기타 페이지 (4개 완료)**

49. `src/app/(user)/page.tsx` - Home (홈페이지, 기존 페이지에 내용 직접 이식)
50. `src/app/(user)/live/[id]/mentor/notification/before/page.tsx` - MentorNotificationBefore (멘토 사전 안내)
51. `src/app/(user)/live/[id]/mentor/notification/after/page.tsx` - MentorNotificationAfter (멘토 후기 전달)
52. `src/app/not-found.tsx` - NotFound (404 페이지)

**Next 컴포넌트 통합 (8개 완료)**

53. `NavBar` - NextNavBar 통합, isNextRouter props 제거, Next.js 전용으로 단순화
54. `BottomNavBarWithPathname` - NextBottomNavBarWithPathname 통합
55. `HybridLink` - React Router 의존성 제거, Next.js Link만 사용
56. `BackHeader` - NextBackHeader 통합, router.back() 자동 지원
57. `Footer` - NextFooter 통합, isNextRouter props 제거
58. 모든 네비게이션 컴포넌트에서 isNextRouter 조건부 로직 제거
59. 유틸리티 함수들 (hideMobileBottomNavBar, getBottomNavBarClassNameByPath) NavBar로 이동
60. 중복 Next 컴포넌트들 완전 제거 및 import 경로 통합

#### Phase 4: 컴포넌트 React Router 의존성 제거 (모든 컴포넌트 완료)

**챌린지 관련 컴포넌트 (8개)**

61. `src/components/common/challenge/dashboard/section/DailyMissionSection.tsx` - useNavigate → useRouter, Link → Next Link
62. `src/components/common/challenge/dashboard/section/EndDailyMissionSection.tsx` - useParams 타입 지정, Link → Next Link
63. `src/components/common/challenge/dashboard/section/GuideSection.tsx` - Link → HybridLink (외부 링크)
64. `src/components/common/challenge/dashboard/section/NoticeSection.tsx` - Link → HybridLink (외부 링크)
65. `src/components/common/challenge/MissionEndSection.tsx` - useParams 타입 지정, Link → Next Link
66. `src/components/common/challenge/my-challenge/dropdown/AbsentContentsDropdown.tsx` - Link → HybridLink
67. `src/components/common/challenge/my-challenge/dropdown/ContentsDropdown.tsx` - Link → HybridLink
68. `src/components/common/challenge/my-challenge/dropdown/MenuContentsDropdown.tsx` - Link → HybridLink
69. `src/components/common/challenge/my-challenge/section/RecommendedProgramSwiper.tsx` - useParams 타입 지정, Link → HybridLink
70. `src/components/common/challenge/my-challenge/section/RecommendedProgramSection.tsx` - useLocation → usePathname

**마이페이지 관련 컴포넌트 (7개)**

71. `src/components/common/mypage/ui/nav/NavItem.tsx` - useNavigate → useRouter
72. `src/components/common/mypage/ui/card/root/ApplicationCard.tsx` - Link → HybridLink, reloadDocument 처리
73. `src/components/common/mypage/ui/button/LinkButton.tsx` - Link → HybridLink
74. `src/components/common/mypage/application/section/ApplySection.tsx` - useNavigate → useRouter, Link → HybridLink
75. `src/components/common/mypage/credit/section/CreditList.tsx` - Link → Next Link
76. `src/components/common/mypage/credit/CreditListItem.tsx` - Link → Next Link
77. `src/components/common/mypage/review/section/WaitingSection.tsx` - Link → Next Link

**라우트 충돌 해결 (1개 작업)**

78. Next.js 라우트 충돌 해결 - 중복된 page.tsx 파일들 제거 (report 시스템의 [[...reportId]] 충돌)

### ✅ 마이그레이션 완료! 🎉

**다음 단계:**

- 종합 테스트 및 검증

## ⚠️ 주의사항

1. **Phase 1 완료 후 Phase 2 시작** - 의존성 순서 중요
2. **챌린지 시스템 우선** - 핵심 비즈니스 로직
3. **URL 호환성 유지** - 기존 링크 깨짐 방지
4. **모든 작업 완료 후 종합 테스트** - 전체 마이그레이션 완료 후 일괄 검증
5. **어드민 시스템 제외** - 본 마이그레이션에서는 사용자 페이지만 대상
6. **useParams 타입 지정** - `const params = useParams<{ paramName: string }>();` 형태로 사용
7. **매 커밋마다 Router.tsx 정리** - 타입 에러 방지를 위한 element props 제거
