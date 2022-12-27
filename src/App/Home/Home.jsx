import { useEffect, useState } from "react";
import Loading from "/src/utilities/Loading.jsx";
import Post from "./Post/Post";

const Home = () => {
  const url = "https://www.reddit.com/.json?raw_json=1";

  const [postsData, setPostsData] = useState([]);
  const [after, setAfter] = useState(null);
  const [IsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFunction = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setPostsData(json.data.children);
        setIsLoading(false);
        setAfter(json.data.after);
      } catch (error) {
        setError(error);
      }
    };
    fetchFunction();
  }, []);

  const [IsLoadingMoreItems, setIsLoadingMoreItems] = useState(false);
  const fetchMoreItems = async () => {
    try {
      const response = await fetch(
        `https://www.reddit.com/.json?after=${after}&raw_json=1`
      );
      const json = await response.json();
      setAfter(json.data.after);
      json.data.children.forEach((newFetchedPost) => {
        setPostsData((prev) => [...prev, newFetchedPost]);
      });
      setIsLoadingMoreItems(false);
    } catch (error) {
      setError(error);
    }
  };
  useEffect(() => {
    window.onscroll = () => {
      if (
        window.scrollY > 1000 &&
        window.innerHeight +
          window.scrollY -
          document.body.scrollHeight +
          500 >=
          0 &&
        !IsLoadingMoreItems
      ) {
        setIsLoadingMoreItems(true);
      }
    };
  }, []);
  useEffect(() => {
    if (IsLoadingMoreItems) {
      fetchMoreItems();
    }
  }, [IsLoadingMoreItems]);

  const [activePostIndex, setActivePostIndex] = useState(-1);

  const getPrevActivePostIndex = () => {
    let tempArr = [];
    document.querySelectorAll(".post").forEach((post, postIndex) => {
      if (post.offsetTop < window.scrollY + 18) {
        tempArr.push(postIndex);
      }
    });
    return tempArr[tempArr.length - 1] ?? 0;
  };

  useEffect(() => {
    document.body.onkeydown = (key) => {
      if (key.key === "f") {
        const prev = getPrevActivePostIndex();

        if (prev <= document.querySelectorAll(".post").length) {
          if (activePostIndex === prev + 1) {
            document.querySelector(".post.active").scrollIntoView();
          }
          setActivePostIndex(prev + 1);
        }

        if (
          window.scrollY > 1000 &&
          window.innerHeight +
            window.scrollY -
            document.body.scrollHeight +
            500 >=
            0 &&
          !IsLoadingMoreItems
        ) {
          setIsLoadingMoreItems(true);
        }
      }
      if (key.key === "r") {
        const prev = getPrevActivePostIndex();

        if (prev > 0) {
          if (
            window.scrollY >
            document.querySelectorAll(".post")[prev].offsetTop + 16
          ) {
            if (activePostIndex === prev) {
              document.querySelector(".post.active").scrollIntoView();
            } else {
              setActivePostIndex(prev);
            }
          } else {
            setActivePostIndex(prev - 1);
          }
        }
      }
    };
  }, [activePostIndex]);

  useEffect(() => {
    if (document.querySelector(".post.active")) {
      document.querySelector(".post.active").scrollIntoView();
    }
  }, [activePostIndex]);

  return (
    <div className="home">
      {IsLoading ? (
        <Loading />
      ) : (
        <div className="posts">
          {postsData.map((postData, postIndex) => {
            return (
              <Post
                key={postIndex}
                postData={postData}
                IsActivePost={postIndex === activePostIndex ? true : false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
