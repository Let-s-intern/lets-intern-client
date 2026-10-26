import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { LiveMentoringSettings } from '@/api/live-mentoring/liveMentoringSchema';
import OpenSettingsPreview from '../OpenSettingsPreview';

const settings: LiveMentoringSettings = {
  liveMentoringId: 1,
  nickname: '자소서장인',
  profileImage: 'https://example.test/profile.png',
  introduction: '소개',
  careers: [],
  title: '자소서 실전 첨삭 멘토링',
  thumbnail: null,
  status: 'APPROVED',
  categories: ['PERSONAL_STATEMENT'],
  durations: [30],
};

/** 공개 리스트 카드와 같은 규칙: 썸네일이 있으면 썸네일, 없으면 프로필 사진. */
describe('OpenSettingsPreview — 카드 이미지', () => {
  it('썸네일이 없으면 프로필 사진을 보여준다', () => {
    render(<OpenSettingsPreview settings={settings} />);

    expect(screen.getByAltText('자소서장인')).toHaveAttribute(
      'src',
      'https://example.test/profile.png',
    );
  });

  it('썸네일이 있으면 썸네일을 보여준다', () => {
    render(
      <OpenSettingsPreview
        settings={{ ...settings, thumbnail: 'https://example.test/t.png' }}
      />,
    );

    expect(screen.getByAltText('자소서장인')).toHaveAttribute(
      'src',
      'https://example.test/t.png',
    );
  });
});
