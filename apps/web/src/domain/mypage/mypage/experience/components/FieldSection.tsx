import { cn } from '@/utils/cn';
import { Asterisk } from 'lucide-react';
import { ComponentProps } from 'react';
import { FieldValues, Path, useForm } from 'react-hook-form';

type FieldSectionRootProps = ComponentProps<'div'>;

const FieldSectionRoot = (props: FieldSectionRootProps) => (
  <div {...props} className={cn('relative', props.className)}>
    {props.children}
  </div>
);

interface FieldSectionLabelProps extends ComponentProps<'label'> {
  isRequired?: boolean;
}

const FieldSectionLabel = (props: FieldSectionLabelProps) => (
  <label
    htmlFor={props.htmlFor}
    className={cn(
      'text-neutral-20 flex items-center gap-1.5 font-medium',
      props.className,
      'text-xsmall14 md:text-xsmall16',
    )}
  >
    <span>{props.children}</span>
    <Asterisk
      className={`text-primary pb-1 ${!props.isRequired && 'hidden'}`}
      size={16}
    />
  </label>
);

type FieldSectionDescriptionProps = ComponentProps<'p'>;

const FieldSectionDescription = (props: FieldSectionDescriptionProps) => (
  <p
    {...props}
    className={cn(
      'text-xsmall14 mb-[10px] font-normal [color:#7F7F7F]',
      props.className,
    )}
  >
    {props.children}
  </p>
);

const FieldSectionInput = <T extends FieldValues>({
  id,
  type = 'text',
  register,
  ...props
}: {
  id: string;
  register?: ReturnType<typeof useForm<T>>['register'];
} & ComponentProps<'input'>) => {
  if (type === 'radio') {
    return (
      <input
        {...(register && register(id as Path<T>))}
        {...props}
        id={id}
        type={type}
        className={cn(
          'border-neutral-70 checked:border-primary-90 m-[2.5px] h-[19px] w-[19px] cursor-pointer appearance-none rounded-full border border-solid checked:border-[5px]',
          props.className,
          'text-xsmall14 md:text-xsmall16',
        )}
      />
    );
  }

  return (
    <input
      {...(register && register(id as Path<T>))}
      {...props}
      id={id}
      type={type}
      className={cn(
        'rounded-xs border-neutral-80 focus:border-primary border border-solid px-3 py-[9px] font-normal placeholder:text-neutral-50 focus:outline-none',
        props.className,
        'text-xsmall14 md:text-xsmall16',
      )}
    />
  );
};

const FieldSectionTextarea = <T extends FieldValues>({
  id,
  register,
  ...props
}: {
  id: string;
  register?: ReturnType<typeof useForm<T>>['register'];
} & ComponentProps<'textarea'>) => (
  <textarea
    {...(register && register(id as Path<T>))}
    {...props}
    id={id}
    rows={4}
    className={cn(
      'rounded-xxs border-neutral-80 focus:border-primary inline-block h-[144px] w-full resize-none border border-solid p-3 font-normal leading-[1.625rem] placeholder:text-neutral-50 focus:outline-none',
      props.className,
      'text-xsmall14 md:text-xsmall16',
    )}
  />
);

export const FieldSection = {
  Root: FieldSectionRoot,
  Label: FieldSectionLabel,
  Description: FieldSectionDescription,
  Input: FieldSectionInput,
  Textarea: FieldSectionTextarea,
};
