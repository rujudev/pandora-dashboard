import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ children, text, ...props }) => {
  return (
    <button className="flex btn btn-primary gap-2" {...props}>
      {children}
      {text}
    </button>
  );
};

export default Button;
