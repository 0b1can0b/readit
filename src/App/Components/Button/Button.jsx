import "./Button.scss";

const Button = ({ icon, text, className, ...rest }) => (
  <button {...rest} className={className ? `button ${className}` : "button"}>
    <div className="icon">{icon}</div>
    <div className="text">{text}</div>
  </button>
);

export default Button;
