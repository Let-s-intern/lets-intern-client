interface LabelProps {
  id: string;
  text: string;
}

const Label = ({ id, text }: LabelProps) => {
  return (
    <label htmlFor={id} className="mb-2 block w-full font-medium">
      {text}
    </label>
  );
};

export default Label;
