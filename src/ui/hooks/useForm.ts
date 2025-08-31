import { ValidatorFn } from "@/components/Form/Form";
import { ChangeEvent, type Reducer, useReducer } from "react";

interface ActionType<FormType> {
  type: "VALUE_CHANGE" | "CHANGE_WHOLE";
  fieldName?: keyof FormType;
  payload: unknown;
}

interface ErrorActionType<FormType> {
  type: "SINGLE_ERROR_CHANGE" | "ERROR_CHANGE_WHOLE";
  fieldName?: keyof FormType;
  payload: unknown;
}

function errorFormReducer<FormType>(
  state: Partial<FormType>,
  action: ErrorActionType<FormType>
): FormType {
  if (action.type === "SINGLE_ERROR_CHANGE") {
    return {
      ...state,
      [action.fieldName]: action.payload,
    };
  }

  if (action.type === "ERROR_CHANGE_WHOLE") {
    return action.payload as FormType;
  }

  return state;
}

function formReducer<FormType>(
  state: FormType,
  action: ActionType<FormType>
): FormType {
  if (action.type === "VALUE_CHANGE") {
    return {
      ...state,
      [action.fieldName]: action.payload,
    };
  }

  if (action.type === "CHANGE_WHOLE") {
    return action.payload as FormType;
  }

  return state;
}

export default function useForm<FormType>(
  formShape: FormType,
  validators: Record<keyof FormType, ValidatorFn<>[]>,
  onSubmit: (form: FormType) => void
) {
  const [formstate, dispatchAction] = useReducer<
    Reducer<FormType, ActionType<FormType>>
  >(formReducer, formShape);

  const [errors, dispatchErrorAction] = useReducer(errorFormReducer, {});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const changeAction: ActionType<FormType> = {
      type: "VALUE_CHANGE",
      fieldName: e.target.name as keyof FormType,
      payload: e.target.value,
    };

    console.log(e.target.name);
    console.log(e.target.value);
    dispatchAction(changeAction);
  };

  const validateForm = () => {
    const errors = Object.keys(validators).reduce((acc, field) => {
      const fieldErrors = validators[field]
        .map((validatorFn) => validatorFn(formstate[field]))
        .join(",");
      return {
        ...acc,
        ...(fieldErrors ? { [field]: fieldErrors } : {}),
      };
    }, {});

    dispatchErrorAction({
      type: "ERROR_CHANGE_WHOLE",
      payload: errors,
    });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateForm();
    onSubmit(formstate);
  };

  return {
    initial: formShape,
    values: formstate,
    errors,
    handleChange,
    validateForm,
    handleSubmit,
  };
}
