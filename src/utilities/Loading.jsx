import { useEffect, useState } from "react";

const Loading = () => {
  const [loading, setLoading] = useState("Loading");

  useEffect(() => {
    let count = 0;
    setInterval(() => {
      count++;
      setLoading(
        `Loading${Array((count % 3) + 1)
          .fill(".")
          .join("")}`
      );
    }, 250);
  }, []);

  return <div className="loading">{loading}</div>;
};

export default Loading;
