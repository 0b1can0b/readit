import { useEffect, useState } from "react";
import {
  HiOutlineChevronUp,
  HiOutlineHeart,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
} from "react-icons/hi2";
import timeAgo from "/src/utilities/timeAgo.js";

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
        {/* {postData.data.post_hint ? (
          <div className="hint">{postData.data.post_hint}</div>
        ) : (
          ""
        )} */}
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

export default Post;
