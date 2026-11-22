import { uploadFile } from '@/api/file';
import { ChallengeType } from '@/schema';

export const THUMBNAIL_IMAGES: Partial<Record<ChallengeType, string>> = {
  PERSONAL_STATEMENT: '/images/challenge-thumbnail-personal-statement.png',
  PERSONAL_STATEMENT_LARGE_CORP:
    '/images/challenge-thumbnail-personal-statement-large-corp.png',
  EXPERIENCE_SUMMARY: '/images/challenge-thumbnail-experience-summary.png',
  DOCUMENT_PREPARATION: '/images/challenge-thumbnail-document-preparation.png',
  PORTFOLIO: '/images/challenge-thumbnail-portfolio.png',
  // 이력서는 Ver 전용 이미지만 있다. 배너 없이 이 이미지를 배경으로 쓴다.
  CAREER_START: '/images/challenge-thumbnail-career-start-ver.png',
};

export const THUMBNAIL_TYPE_LABELS: Partial<Record<ChallengeType, string>> = {
  PERSONAL_STATEMENT: '자기소개서',
  PERSONAL_STATEMENT_LARGE_CORP: '대기업',
  EXPERIENCE_SUMMARY: '경험정리',
  DOCUMENT_PREPARATION: '서류준비',
  PORTFOLIO: '포트폴리오',
  CAREER_START: '이력서',
};

export const extractWeek = (title: string): string | null => {
  const match = title.match(/(\d+)주/);
  return match ? match[1] : null;
};

export const WEEK_TITLE_TEMPLATES: Partial<
  Record<ChallengeType, (week: string) => string>
> = {
  PERSONAL_STATEMENT: (week) => `자기소개서 ${week}주 완성 챌린지`,
  PORTFOLIO: (week) => `포트폴리오 ${week}주 완성 챌린지`,
};

const CANVAS_WIDTH = 1146;
const CANVAS_HEIGHT = 860;

const TITLE_X = 80;
const TITLE_Y = 746.5;
const TITLE_FONT_SIZE = 84;
const TITLE_LETTER_SPACING_RATIO = -0.022;
const TITLE_SHADOW_BLUR = 20;

const TITLE_SHADOW_COLORS: Partial<Record<ChallengeType, string>> = {
  PERSONAL_STATEMENT: '#20A4D9',
  PORTFOLIO: '#E79C00',
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// JSDOM 등 CSS Font Loading API 미구현 환경(document.fonts === undefined) 방어
function loadFont(font: string, text: string): Promise<FontFace[] | void> {
  return document.fonts ? document.fonts.load(font, text) : Promise.resolve();
}

export async function drawThumbnailOnCanvas(
  challengeType: ChallengeType,
  title: string,
): Promise<Blob | null> {
  const imagePath = THUMBNAIL_IMAGES[challengeType];
  if (!imagePath) return null;

  const titleTemplate = WEEK_TITLE_TEMPLATES[challengeType];
  const week = titleTemplate ? extractWeek(title) : null;
  if (titleTemplate && !week) return null;

  const titleText = titleTemplate && week ? titleTemplate(week) : null;

  const [img] = await Promise.all([
    loadImage(imagePath),
    ...(titleText
      ? [loadFont(`bold ${TITLE_FONT_SIZE}px "Pretendard Variable"`, titleText)]
      : []),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (titleText) {
    ctx.font = `bold ${TITLE_FONT_SIZE}px "Pretendard Variable"`;
    ctx.letterSpacing = `${(TITLE_FONT_SIZE * TITLE_LETTER_SPACING_RATIO).toFixed(2)}px`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = TITLE_SHADOW_COLORS[challengeType] ?? 'transparent';
    ctx.shadowBlur = TITLE_SHADOW_BLUR;
    ctx.fillText(titleText, TITLE_X, TITLE_Y);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('canvas.toBlob 실패'));
    }, 'image/png');
  });
}

export async function generateAndUploadThumbnail(
  challengeType: ChallengeType,
  title: string,
): Promise<string | null> {
  const blob = await drawThumbnailOnCanvas(challengeType, title);
  if (!blob) return null;

  const file = new File([blob], `challengethumbnail${Date.now()}.png`, {
    type: 'image/png',
  });
  return uploadFile({ file, type: 'CHALLENGE' });
}
