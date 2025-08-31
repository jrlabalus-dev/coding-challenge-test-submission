export type ValidatorFn<T> = (value: T) => string | undefined;

export const required: ValidatorFn<string> = (value) =>
  !value.trim() ? "Field is required." : undefined;
