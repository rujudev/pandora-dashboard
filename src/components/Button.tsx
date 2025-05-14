interface ButtonProps {
  children?: React.ReactNode;
  text?: string;
}

const Button: React.FC<ButtonProps> = ({ children, text }) => {
  return (
    <a className="flex btn btn-primary gap-2" href="/athletes/new">
      {children}
      {text}
    </a>
  );
};

export default Button;
