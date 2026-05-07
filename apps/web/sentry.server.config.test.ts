/**
 * sentry.server.config.ts 정책 회귀 방지 테스트.
 *
 * 배경: BE 5xx 가 RSC catch 블록 안에서 처리되어도 axios throw 시점에 Sentry
 * server SDK 가 자동 캡처하여 events 가 만들어지고, 과거 server beforeSend 는
 * production 이면 무조건 Slack webhook 으로 발송했음. 결과적으로 동일한 BE 5xx
 * 가 매번 운영 Slack 에 알림되어 진짜 crash 알림이 묻히는 cry-wolf 발생.
 *
 * 본 테스트는 client(instrumentation-client.ts)와 server(sentry.server.config.ts)
 * 정책이 비대칭으로 회귀하지 않도록 정적 검증한다. beforeSend 가 Sentry.init
 * 옵션 객체 내부에 inline 으로 정의되어 있어 unit-level 호출 검증이 어렵기
 * 때문에 소스 패턴 검증으로 대체한다.
 */
import * as fs from 'fs';
import * as path from 'path';

describe('sentry.server.config 정책 회귀 방지', () => {
  const filePath = path.join(__dirname, 'sentry.server.config.ts');
  const source = fs.readFileSync(filePath, 'utf-8');

  it('isCrashEvent import 가 존재한다 (handled BE 에러 Slack 차단의 핵심 게이트)', () => {
    expect(source).toMatch(
      /from\s+['"]\.\/src\/utils\/replayCrashFilter['"]/,
    );
    expect(source).toContain('isCrashEvent');
  });

  it('NEXT_PUBLIC_VERCEL_ENV === "production" 환경 체크를 사용한다 (Vercel preview 오염 방지)', () => {
    expect(source).toMatch(
      /NEXT_PUBLIC_VERCEL_ENV[\s\S]*?===[\s\S]*?['"]production['"]/,
    );
  });

  it('isProduction + isCrash + !isNoise 3중 게이트가 함께 존재한다', () => {
    expect(source).toContain('isProduction');
    expect(source).toContain('isCrash');
    expect(source).toContain('!isNoise');
  });

  it('NODE_ENV 단독 체크로만 webhook 차단하던 과거 정책으로 회귀하지 않는다', () => {
    // 과거 코드: `if (process.env.NODE_ENV === 'development') return event;`
    // 이 패턴만 존재하고 isCrashEvent 게이트가 없으면 BE 5xx 가 모두 Slack 으로 감.
    const hasOnlyNodeEnvCheck = /process\.env\.NODE_ENV\s*===\s*['"]development['"]/.test(
      source,
    );
    if (hasOnlyNodeEnvCheck) {
      // NODE_ENV 체크가 남아있어도 무방하지만, 반드시 isCrashEvent 게이트가 함께 있어야 한다.
      expect(source).toContain('isCrashEvent');
    }
  });

  it('classifyNoise 결과를 noise 차단(!isNoise) 에 활용한다 (태그만 부착하고 발송하던 회귀 방지)', () => {
    expect(source).toContain('classifyNoise');
    expect(source).toContain('isNoise = true');
    expect(source).toContain('!isNoise');
  });
});
