import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Subreddit from "./Subreddit";
import Comments from "./Comments";
import "./App.scss";

console.clear();

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/r/popular");
  }, []);
  return "";
};

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="r/:sub" element={<Subreddit />} />
        <Route path="r/:sub/comments/:id/:rest" element={<Comments />} />
      </Routes>
    </div>
  );
};

export default App;
