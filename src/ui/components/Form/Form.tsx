import React, { type InputHTMLAttributes } from 'react';

import Button from '../Button/Button';
import InputText from '../InputText/InputText';
import $ from './Form.module.css';

export type ValidatorFn<T> = (value: T) => string | undefined;

interface FormEntry <T = string> {
  name: string;
  placeholder?: string;
  // TODO: Defined a suitable type for extra props
  // This type should cover all different of attribute types
  validators?: ValidatorFn<T>[];
  extraProps?: InputHTMLAttributes<HTMLInputElement>;
}

interface FormProps<FormShape> {
  label: string;
  loading?: boolean;
  formEntries: FormEntry[];
  onFormSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  submitText: string;
  values: FormShape;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Partial<FormShape>;
}

const Form = <FormShape extends Record<string, any>>({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText,
  values,
  onChange,
  errors
}: FormProps<FormShape>) =>  {

  console.log("inside", errors)
  return (
    <form className={$.form} onSubmit={onFormSubmit}>
      <fieldset>
        <legend>{label}</legend>
        {formEntries.map(({ name, placeholder, extraProps }, index) => (
          <div key={`${name}-${index}`} className={$.formRow}>
            <InputText
              key={`${name}-${index}`}
              name={name}
              placeholder={placeholder ?? ''}
              {...extraProps}
              value={values[name]}
              onChange={onChange}
            />
            {errors?.[name] &&<span className={$.fieldError}> {errors[name]} </span>}
          </div>
        ))}

        <Button loading={loading} type="submit">
          {submitText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;
