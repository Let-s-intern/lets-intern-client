interface Props {
  onClose: () => void;
}

function DrawerCloseBtn({ onClose }: Props) {
  return (
    <div className="sticky top-0 z-10 w-full bg-white py-2">
      <div
        className="bg-neutral-80 mx-auto h-[5px] w-16 cursor-pointer rounded-full"
        onClick={onClose}
      />
    </div>
  );
}

export default DrawerCloseBtn;
