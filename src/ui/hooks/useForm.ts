import { ChangeEvent, type Reducer, useReducer } from "react";

interface ActionType<FormType> {
  type: "VALUE_CHANGE";
  fieldName: keyof FormType;
  payload: unknown;
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

  return state;
}

export default function useForm<FormType>(formShape: FormType) {
  const [formstate, dispatchAction] = useReducer<
    Reducer<FormType, ActionType<FormType>>
  >(formReducer, formShape);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const changeAction: ActionType<FormType> = {
      type: "VALUE_CHANGE",
      fieldName: e.target.name as keyof FormType,
      payload: e.target.value,
    };

    dispatchAction(changeAction);
  };

  return {
    initial: formShape,
    values: formstate,
    handleChange,
  };
}
