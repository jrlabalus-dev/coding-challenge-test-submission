import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";
import {  IconLoader2 } from "@tabler/icons-react";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {
  return (
    <button
      // TODO: Add conditional classNames
      // - Must have a condition to set the '.primary' className
      // - Must have a condition to set the '.secondary' className
      // - Display loading spinner per demo video. NOTE: add data-testid="loading-spinner" for spinner element (used for grading)
      className={`${$.button} ${ variant === 'secondary' ? $.secondary : $.primary  }`}
      type={type}
      onClick={onClick}
    >
      {loading &&<IconLoader2 className={$.loader} data-testid="loading-spinner" />} {children}
    </button>
  );
};

export default Button;
