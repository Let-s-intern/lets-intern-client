import { cn } from '@/utils/cn';
import { ComponentProps } from 'react';
import { FieldValues, Path, useForm } from 'react-hook-form';

const FieldSectionRoot = ({ ...props }: ComponentProps<'div'>) => (
  <div {...props} className={cn('relative', props.className)}>
    {props.children}
  </div>
);

const FieldSectionLabel = ({ ...props }: ComponentProps<'label'>) => (
  <label
    htmlFor={props.htmlFor}
    className={cn('text-xsmall16 font-medium text-neutral-20', props.className)}
  >
    {props.children}
  </label>
);

const FieldSectionDescription = ({ ...props }: ComponentProps<'p'>) => (
  <p
    {...props}
    className={cn(
      'mb-[10px] text-xsmall14 font-normal text-[#7F7F7F]',
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
  register: ReturnType<typeof useForm<T>>['register'];
} & ComponentProps<'input'>) => {
  if (type === 'radio') {
    return (
      <input
        {...register(id as Path<T>)}
        {...props}
        id={id}
        type={type}
        className={cn(
          'm-[2.5px] h-[19px] w-[19px] cursor-pointer appearance-none rounded-full border border-solid border-neutral-70 checked:border-[5px] checked:border-primary-90',
          props.className,
        )}
      />
    );
  }

  return (
    <input
      {...register(id as Path<T>)}
      {...props}
      id={id}
      type={type}
      className={cn(
        'rounded-xs border border-solid border-neutral-80 px-3 py-[9px] text-xsmall16 font-normal placeholder:text-neutral-50 focus:border-primary focus:outline-none',
        props.className,
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
  register: ReturnType<typeof useForm<T>>['register'];
} & ComponentProps<'textarea'>) => (
  <textarea
    {...register(id as Path<T>)}
    {...props}
    id={id}
    rows={4}
    className={cn(
      'inline-block h-[144px] w-full resize-none rounded-xxs border border-solid border-neutral-80 p-3 text-xsmall16 font-normal leading-[1.625rem] placeholder:text-neutral-50 focus:border-primary focus:outline-none',
      props.className,
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
