interface IconProps {
  src: string;
  alt?: string;
  openUrl?: string;
}

const Icon = ({ src, alt = '', openUrl }: IconProps) => {
  return (
    <img
      className="w-5 cursor-pointer"
      src={src}
      alt={alt}
      onClick={() => {
        if (openUrl) window.open(openUrl, '_blank');
      }}
    />
  );
};

export default Icon;
