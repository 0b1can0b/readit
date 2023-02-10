import { useEffect, useRef, useState } from "react";

import "./Tooltip.scss";

const Tooltip = ({
  children,
  tooltip,
  position,
  className,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(position);
  const classListArr = [
    "tooltip",
    className ? className : "",
    open ? "open" : "",
    pos ? pos.replace(" ", "-") : "top-center",
  ];
  const classList = classListArr.reduce((a, b) => {
    if (b === "") return a;
    return `${a} ${b}`;
  });

  const ref = useRef(null);
  const calcPos = () => {
    if (position.split(" ")[0] === "top") {
      if (
        ref.current.querySelector(".tooltip-tip").scrollHeight + 16 >
        ref.current.getBoundingClientRect().top
      ) {
        setPos((prev) => prev.replace("top", "bottom"));
      } else {
        setPos((prev) => prev.replace("bottom", "top"));
      }
    }
    if (position.split(" ")[0] === "bottom") {
      if (
        window.innerHeight -
          (ref.current.querySelector(".tooltip-tip").scrollHeight + 16) <
        ref.current.getBoundingClientRect().bottom
      ) {
        setPos((prev) => prev.replace("bottom", "top"));
      } else {
        setPos((prev) => prev.replace("top", "bottom"));
      }
    }
  };

  const handelMouseEnter = () => {
    onMouseEnter && onMouseEnter();
    calcPos();
    setOpen(true);
  };
  const handelMouseLeave = () => {
    onMouseLeave && onMouseLeave();
    setOpen(false);
  };

  return (
    <div
      {...rest}
      className={classList}
      onMouseEnter={handelMouseEnter}
      onMouseLeave={handelMouseLeave}
      ref={ref}
    >
      <div className="tooltip-tip">{tooltip}</div>
      <div className="tooltip-inner">{children}</div>
    </div>
  );
};

export default Tooltip;
