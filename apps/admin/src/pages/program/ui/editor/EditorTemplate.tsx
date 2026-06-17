import ActionButton from '../../../ui/button/ActionButton';

interface EditorTemplateProps {
  title: string;
  onSubmit?: (e: React.FormEvent) => void;
  submitButton: {
    text: string;
  };
  cancelButton: {
    text: string;
    to?: string;
    onClick?: () => void;
  };
  children: React.ReactNode;
}

const EditorTemplate = ({
  title,
  onSubmit,
  submitButton,
  cancelButton,
  children,
}: EditorTemplateProps) => {
  return (
    <main className="mx-auto mb-24 mt-12 w-[45rem]">
      <header>
        <h1 className="text-2xl font-semibold">{title}</h1>
      </header>
      <form className="mt-10" onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">{children}</div>
        <div className="mt-8 flex justify-end gap-2">
          <ActionButton type="submit">{submitButton.text}</ActionButton>
          <ActionButton
            type="button"
            to={cancelButton.to}
            bgColor="gray"
            onClick={cancelButton.onClick}
          >
            {cancelButton.text}
          </ActionButton>
        </div>
      </form>
    </main>
  );
};

export default EditorTemplate;
