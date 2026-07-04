function ResultImg({
  src,
  alt,
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  return (
    <img className="aspect-[13000/7947] h-full w-full" src={src} alt={alt} />
  );
}

export default ResultImg;
