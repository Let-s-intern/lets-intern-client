interface BottomSheetProps {
  children: React.ReactNode;
}

const BottomSheet = ({ children }: BottomSheetProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 rounded-t-lg bg-static-100 px-5 pb-2.5 pt-5 shadow-button">
      {children}
    </div>
  );
};

export default BottomSheet;
