import { useEffect, useState } from "react";
import {
  HiOutlineChevronUp,
  HiOutlineHeart,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
} from "react-icons/hi2";
import "./App.scss";

console.clear();

const timeAgo = (time) => {
  let time_ago = new Date() / 1000 - time;
  let time_text = "s";
  if (time_ago >= 60) {
    time_ago = time_ago / 60;
    time_text = "m";
    if (time_ago >= 60) {
      time_ago = time_ago / 60;
      time_text = "h";
      if (time_ago >= 24) {
        time_ago = time_ago / 24;
        time_text = "d";
        if (time_ago >= 30.437) {
          time_ago = time_ago / 30.437;
          time_text = "M";
          if (time_ago >= 12) {
            time_ago = time_ago / 12;
            time_text = "Y";
          }
        }
      }
    }
  }
  return `${time_ago.toFixed(1)}${time_text}`;
};

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

const Post = ({ postData, IsActivePost }) => {
  const imgSrcSet =
    postData.data.post_hint === "image" &&
    postData.data.preview.images[0].resolutions
      .map((e) => {
        return `${e.url} ${e.width}w`;
      })
      .join(",");
  const bgImgUrl =
    (postData.data.post_hint === "image" ||
      postData.data.post_hint === "hosted:video") &&
    `url("${postData.data.preview.images[0].resolutions[0].url}")`;

  const score =
    postData.data.score >= 1000
      ? `${(postData.data.score / 1000).toFixed(1)}k`
      : postData.data.score;

  const handelClick = () => {
    console.log(postData.data);
  };

  return (
    <div
      className={IsActivePost ? "post active" : "post"}
      onClick={handelClick}
    >
      <div className="meta_info">
        {postData.data.post_hint ? (
          <div className="hint">{postData.data.post_hint}</div>
        ) : (
          ""
        )}
        <div className="in_subreddit">
          <div className="text">in</div>
          <a href="#" className="subreddit">
            r/{postData.data.subreddit}
          </a>
        </div>
        <div className="by_author">
          <div className="text">by</div>
          <a href="#" className="author">
            u/{postData.data.author}
          </a>
        </div>
      </div>
      <div className="title">{postData.data.title}</div>
      {postData.data.post_hint === "image" ? (
        <div className="image" style={{ backgroundImage: bgImgUrl }}>
          <img srcSet={imgSrcSet} alt="" />
        </div>
      ) : (
        ""
      )}
      {postData.data.post_hint === "hosted:video" ? (
        <div className="video" style={{ backgroundImage: bgImgUrl }}>
          <video controls>
            <source src={postData.data.media.reddit_video.fallback_url} />
          </video>
        </div>
      ) : (
        ""
      )}
      {postData.data.post_hint === "link" ? (
        <a href={postData.data.url} className="link">
          {postData.data.url}
        </a>
      ) : (
        ""
      )}
      <div className="numbers_info">
        <div className="score">
          <HiOutlineChevronUp /> {score}
        </div>
        <div className="ratio">
          <HiOutlineHeart /> {postData.data.upvote_ratio * 100}%
        </div>
        <div className="comments">
          <HiOutlineChatBubbleLeftRight /> {postData.data.num_comments}
        </div>
        <div className="time_passed">
          <HiOutlineClock /> {timeAgo(postData.data.created)}
        </div>
      </div>
    </div>
  );
};

const App = () => {
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
    <div className="app">
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

export default App;
