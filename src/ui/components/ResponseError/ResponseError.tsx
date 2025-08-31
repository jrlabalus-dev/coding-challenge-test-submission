import { FunctionComponent } from "react";
import $ from "./ResponseError.module.css";

interface ResponseErrorProps {
  error?: string
}

export const ResponseError: FunctionComponent<ResponseErrorProps> = ({ error }) => {
  return(
    <span className={$.error}>
      {error}
    </span>
  );
}

export default ResponseError;