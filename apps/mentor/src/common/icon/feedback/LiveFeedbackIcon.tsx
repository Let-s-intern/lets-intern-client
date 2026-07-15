interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

const LiveFeedbackIcon = ({
  size = 20,
  className,
  color = '#F64E39',
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    aria-hidden
  >
    <rect
      x="2"
      y="4.5"
      width="16"
      height="11"
      rx="3"
      stroke={color}
      strokeWidth="1.5"
    />
    <path d="M8.5 7.5L12.5 10L8.5 12.5V7.5Z" fill={color} />
  </svg>
);

export default LiveFeedbackIcon;
