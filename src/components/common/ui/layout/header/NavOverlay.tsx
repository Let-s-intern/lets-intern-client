interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function NavOverlay({ isOpen, onClose }: Props) {
  return (
    <div
      className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
        isOpen ? 'opacity-50 ease-out' : 'pointer-events-none opacity-0 ease-in'
      }`}
      aria-hidden="true"
      onClick={onClose}
    />
  );
}

export default NavOverlay;
