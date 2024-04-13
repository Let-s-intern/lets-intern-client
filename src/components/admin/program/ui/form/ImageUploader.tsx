interface ImageUploaderProps {
  label: string;
  imageFormat?: {
    width?: number;
    height?: number;
    extension?: ('png' | 'jpeg')[];
  };
}

const ImageUploader = ({ label, imageFormat }: ImageUploaderProps) => {
  return (
    <div className="rounded-xxs bg-neutral-90 px-6 py-4">
      <div className="mb-2">
        <label htmlFor="avatar" className="text-1-medium block">
          {label}
        </label>
        {imageFormat && (
          <span className="text-0.875 text-neutral-40">
            {imageFormat.width && imageFormat.height && (
              <>
                가로 {imageFormat.width} X 세로 {imageFormat.height}의
              </>
            )}{' '}
            {imageFormat.extension && imageFormat.extension?.join(', ')} 이미지
            파일을 첨부해주세요.
          </span>
        )}
      </div>
      <input
        type="file"
        id="avatar"
        name="avatar"
        accept={
          imageFormat?.extension
            ? imageFormat.extension
                .map((extension) => `image/${extension}`)
                .join(', ')
            : 'image/*'
        }
        className="text-0.875"
      />
    </div>
  );
};

export default ImageUploader;
