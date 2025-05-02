interface ButtonProps {
  children?: React.ReactNode;
  text?: string;
}

const Button: React.FC<ButtonProps> = ({ children, text }) => {
  return (
    <a className="btn btn-primary" href="/athletes/new">
      {children}
      {text}
    </a>
  );
};

export default Button;
