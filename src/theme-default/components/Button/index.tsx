import { Link } from "../Link";
import styles from "./index.module.scss";

interface ButtonProps {
  type?: "button" | "a" | string;
  size?: "medium" | "big";
  theme?: "brand" | "alt";
  text: string;
  href?: string;
  external?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    theme = "brand",
    size = "medium",
    href = "/",
    external = false,
    className = "",
    type,
    text,
  } = props;

  /* let type : string | typeof Link | null = null; */

  const btnClassName = `${styles.button} ${styles[theme]} ${styles[size]} ${className}`;

  switch (type) {
    case "button":
      return <button className={btnClassName}>{text}</button>;
    case "a":
      return external ? (
        <a className={btnClassName} href={href}>
          {text}
        </a>
      ) : (
        <Link className={btnClassName} href={href}>
          {text}
        </Link>
      );
    default:
      return (
        <Link className={btnClassName} href={href}>
          {text}
        </Link>
      );
  }
};

export default Button;
