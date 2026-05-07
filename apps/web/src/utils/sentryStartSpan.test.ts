import { readFileSync } from 'fs';
import { join } from 'path';

const APP_ROOT = join(__dirname, '..', 'app', '(user)');

const read = (rel: string) => readFileSync(join(APP_ROOT, rel), 'utf-8');

describe('Sentry.startSpan 명시 트레이스 (push6 §6.3)', () => {
  it('VOD detail page → vod.detail.render + vodId attribute', () => {
    const src = read('program/vod/[id]/[title]/page.tsx');
    expect(src).toContain("name: 'vod.detail.render'");
    expect(src).toContain('vodId');
    expect(src).toContain('Sentry.startSpan');
  });

  it('Guidebook detail page → guidebook.detail.render + guidebookId attribute', () => {
    const src = read('program/guidebook/[id]/[title]/page.tsx');
    expect(src).toContain("name: 'guidebook.detail.render'");
    expect(src).toContain('guidebookId');
    expect(src).toContain('Sentry.startSpan');
  });

  it('Blog detail page → blog.detail.render + blogId attribute', () => {
    const src = read('blog/[id]/[title]/page.tsx');
    expect(src).toContain("name: 'blog.detail.render'");
    expect(src).toContain('blogId');
    expect(src).toContain('Sentry.startSpan');
  });

  it('Challenge mission feedback page → challenge.mission.feedback + applicationId/missionId attribute', () => {
    const src = read(
      'challenge/[applicationId]/[programId]/missions/[missionId]/feedback/page.tsx',
    );
    expect(src).toContain("name: 'challenge.mission.feedback'");
    expect(src).toContain('applicationId');
    expect(src).toContain('missionId');
    expect(src).toContain('Sentry.startSpan');
  });
});
