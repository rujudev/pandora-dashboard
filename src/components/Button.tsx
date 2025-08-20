import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";
import { Cancel, Edit, Save } from "../components/Icon"; // Ajusta la ruta según tu proyecto

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  mode?: 'edit' | 'create';
  variant?: 'solid' | 'ghost' | 'plain' | 'action';
  actionType?: 'success' | 'error' | 'info';
  className?: string;
  isCloseModal?: boolean;
  command?: string;
  commandfor?: string;
  purpose?: 'save' | 'cancel' | 'update';
}

const BUTTON_MODE = {
  create: 'btn-primary',
  edit: 'btn-success'
};

const BUTTON_VARIANT = {
  solid: '',
  ghost: 'btn-ghost',
  plain: 'bg-transparent border-none shadow-none',
  action: 'btn duration-100 transition-colors cursor-pointer bg-transparent! border-none shadow-none'
};

const ACTION_TYPE_CLASS = {
  success: 'hover:text-success',
  error: 'hover:text-error',
  info: 'hover:text-info'
};

const CLOSE_MODAL_CLASS = 'btn btn-ghost text-sm absolute top-2 right-2 px-0';

const PURPOSE_ICON = {
  save: <Save />,
  cancel: <Cancel />,
  update: <Edit />
};

const PURPOSE_COLOR = {
  save: 'btn-success',
  cancel: 'btn-error',
  update: 'btn-waning'
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  text,
  mode,
  variant = 'solid',
  actionType = 'error',
  className = '',
  isCloseModal = false,
  purpose,
  ...props
}) => {
  const baseClass = isCloseModal
    ? CLOSE_MODAL_CLASS
    : variant === 'action'
      ? `${BUTTON_VARIANT.action} ${ACTION_TYPE_CLASS[actionType]}`
      : `btn${mode ? ` ${BUTTON_MODE[mode]}` : ''}${variant ? ` ${BUTTON_VARIANT[variant]}` : ''}${purpose ? ` ${PURPOSE_COLOR[purpose]}` : ''}`;

  return (
    <button className={`flex gap-2 items-center ${baseClass} ${className}`} {...props}>
      {purpose && PURPOSE_ICON[purpose]}
      {children}
    </button>
  );
};

export default Button;