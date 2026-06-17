const DEFAULT_QUALITY = 0.75;

export function convertImage({
  data,
  maxWidth,
  quality = DEFAULT_QUALITY,
  imageType,
}: {
  data: File;
  maxWidth: number;
  quality?: number;
  imageType: 'image/jpeg' | 'image/webp';
}): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const image = new Image();
      image.src = URL.createObjectURL(data);
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const { width, height } = image;
        const ratio = width / height;
        const widthResult = Math.min(width, maxWidth);
        const heightResult = widthResult / ratio;

        canvas.width = widthResult;
        canvas.height = heightResult;
        if (imageType === 'image/jpeg') {
          context.fillStyle = 'white';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const newName = `${data.name.replace(/\.\w+$/, '')}-${Math.floor(widthResult)}x${Math.floor(heightResult)}.${imageType.split('/')[1]}`;
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob as Blob], newName, { type: imageType }));
          },
          imageType,
          quality,
        );
      };
    };
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(data);
  });
}

export async function createImageSet(
  data: File,
  isDesktop?: boolean,
): Promise<{
  webpMobile?: File;
  webpDesktop?: File;
  jpegMobile?: File;
  jpegDesktop?: File;
}> {
  if (isDesktop) {
    return Promise.all([
      convertImage({
        data,
        maxWidth: 1440,
        imageType: 'image/webp',
      }),
      convertImage({
        data,
        maxWidth: 1440,
        imageType: 'image/jpeg',
      }),
    ]).then(([webpDesktop, jpegDesktop]) => ({
      webpDesktop,
      jpegDesktop,
    }));
  }

  return Promise.all([
    convertImage({
      data,
      maxWidth: 768,
      imageType: 'image/webp',
    }),
    convertImage({
      data,
      maxWidth: 768,
      imageType: 'image/jpeg',
    }),
  ]).then(([webpMobile, jpegMobile]) => ({
    webpMobile,
    jpegMobile,
  }));
}
