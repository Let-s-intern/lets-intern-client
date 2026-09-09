/**
 * 프로필 이미지에 블러를 **굽는다**.
 *
 * 현업 멘토는 프로필 사진으로 신원이 드러나는 것을 꺼린다. 그래서 표시 단계에서 CSS
 * `filter: blur()` 로 흐리게 보여주는 방식은 쓸 수 없다 — 원본 URL 이 그대로 살아 있어
 * 네트워크 탭이나 이미지 주소 복사면 선명한 원본이 나온다. 흐리게 만든 바이트만 S3 에
 * 올려서 원본이 애초에 존재하지 않게 한다.
 *
 * 서버는 손대지 않는다. `POST /file` 에 넘기는 File 을 바꿔치기하는 것뿐이라 웹·어드민 등
 * 이 이미지를 보여주는 모든 화면이 자동으로 흐려진다.
 */

/** 긴 변 기준 출력 크기. 화면 안내 문구("권장 600px")와 같은 값이다. */
const MAX_OUTPUT_PX = 600;

/**
 * 블러 강도 — 출력 크기를 몇 분의 1 로 줄였다가 되늘릴지.
 *
 * 600px 기준 약 43px 로 줄었다가 돌아온다. 얼굴을 알아볼 수 없으면서 사람이 있다는 것과
 * 옷·배경 색은 남는 수준이다. 멘토가 조절하지 않는다 — "이 정도면 되나" 를 고민하게 만들면
 * 너무 약하게 걸어 신원이 드러나는 선택이 가능해진다.
 */
const DOWNSCALE_FACTOR = 14;

/** 확대 단계에 얹는 마무리 블러. 보간이 남긴 계단을 없앤다. 지원하는 브라우저에서만 걸린다. */
const SMOOTHING_BLUR_PX = 6;

const JPEG_QUALITY = 0.85;

/** 알파가 있는 원본만 PNG 로 내보낸다. 나머지는 JPEG 가 훨씬 작다. */
export const outputMimeFor = (file: File): string =>
  file.type === 'image/png' ? 'image/png' : 'image/jpeg';

/**
 * 파일명 확장자를 실제 바이트에 맞춘다.
 *
 * 서버 `S3Utils.saveFile()` 은 넘어온 파일명을 **그대로 S3 키로 쓰고** 확장자를 검증하지
 * 않는다. `.png` 이름에 JPEG 바이트를 담아 보내면 키와 내용이 어긋난 채 저장된다.
 */
export const renameForMime = (name: string, mime: string): string => {
  const ext = mime === 'image/png' ? 'png' : 'jpg';
  const base = name.replace(/\.[^./\\]*$/, '');
  return `${base || 'profile'}.${ext}`;
};

/**
 * EXIF 회전을 살려 디코드한다.
 *
 * 살리지 않으면 아이폰에서 세로로 찍은 사진이 옆으로 누운 채 구워진다. `imageOrientation`
 * 옵션을 모르는 브라우저는 옵션 자체를 거부하므로 한 번 더 시도한다.
 */
const decode = async (file: File): Promise<ImageBitmap> => {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return await createImageBitmap(file);
  }
};

const createCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const getContext = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d 컨텍스트를 만들지 못했습니다.');
  return ctx;
};

/**
 * `ctx.filter` 를 실제로 적용하는 브라우저인지 본다.
 *
 * 구형 사파리는 `ctx.filter` 대입을 **에러 없이 무시한다.** 그래서 이걸 블러의 주 수단으로
 * 삼으면, 신원을 감추려던 멘토의 선명한 원본이 아무 경고 없이 올라간다. 여기서는 마무리
 * 용도로만 쓰고, 블러 자체는 아래 축소→확대가 담당한다.
 */
const supportsCanvasFilter = (ctx: CanvasRenderingContext2D): boolean => {
  const original = ctx.filter;
  try {
    ctx.filter = 'blur(1px)';
    return ctx.filter !== 'none' && ctx.filter !== '';
  } catch {
    return false;
  } finally {
    ctx.filter = original;
  }
};

const toBlob = (
  canvas: HTMLCanvasElement,
  mime: string,
): Promise<Blob | null> =>
  new Promise((resolve) =>
    canvas.toBlob(
      resolve,
      mime,
      mime === 'image/jpeg' ? JPEG_QUALITY : undefined,
    ),
  );

/**
 * 블러가 구워진 새 File 을 돌려준다.
 *
 * **실패하면 던진다.** 원본을 그대로 돌려주는 폴백은 두지 않는다 — 흐린 미리보기를 보고
 * 저장했는데 선명한 사진이 올라가는 것이 이 기능의 유일한 치명적 실패다. 호출부는 예외를
 * 잡아 업로드를 멈추고 멘토에게 알려야 한다.
 */
export async function blurImageFile(file: File): Promise<File> {
  const bitmap = await decode(file);

  try {
    const scale = Math.min(
      1,
      MAX_OUTPUT_PX / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    // 1단계: 아주 작게 줄인다. 여기서 얼굴 정보가 사라진다.
    const seedWidth = Math.max(1, Math.round(width / DOWNSCALE_FACTOR));
    const seedHeight = Math.max(1, Math.round(height / DOWNSCALE_FACTOR));
    const seed = createCanvas(seedWidth, seedHeight);
    const seedCtx = getContext(seed);
    seedCtx.imageSmoothingEnabled = true;
    seedCtx.imageSmoothingQuality = 'high';
    seedCtx.drawImage(bitmap, 0, 0, seedWidth, seedHeight);

    // 2단계: 되늘린다. 보간 자체가 블러라 브라우저 지원을 타지 않는다.
    const output = createCanvas(width, height);
    const ctx = getContext(output);
    const mime = outputMimeFor(file);

    // JPEG 에는 알파가 없다. 흰 배경을 깔지 않으면 투명한 부분이 검게 죽는다.
    if (mime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (supportsCanvasFilter(ctx)) {
      ctx.filter = `blur(${SMOOTHING_BLUR_PX}px)`;
    }
    ctx.drawImage(seed, 0, 0, width, height);
    ctx.filter = 'none';

    const blob = await toBlob(output, mime);
    if (!blob) throw new Error('이미지를 변환하지 못했습니다.');

    return new File([blob], renameForMime(file.name, mime), { type: mime });
  } finally {
    bitmap.close?.();
  }
}
