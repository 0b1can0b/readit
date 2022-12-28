import { useEffect, useState } from "react";
import {
  HiOutlineArrowUp,
  HiOutlineHeart,
  HiOutlineChatBubbleLeft,
  HiOutlineClock,
} from "react-icons/hi2";
import { FaExternalLinkAlt } from "react-icons/fa";
import timeAgo from "/src/utilities/timeAgo.js";

const Post = ({ postData, IsActivePost }) => {
  const imgSrcSet =
    (postData.data.post_hint === "image" ||
      postData.data.post_hint === "link") &&
    postData.data.preview.images[0].resolutions.length > 0
      ? postData.data.preview.images[0].resolutions
          .map((e) => {
            return `${e.url} ${e.width}w`;
          })
          .join(",")
      : `${postData.data.thumbnail} ${postData.data.thumbnail_width}w`;
  const bgImgUrl =
    (postData.data.post_hint === "image" ||
      postData.data.post_hint === "link" ||
      postData.data.post_hint === "hosted:video") &&
    postData.data.preview.images[0].resolutions.length > 0
      ? `url("${postData.data.preview.images[0].resolutions[0].url}")`
      : `url("${postData.data.thumbnail}")`;

  const score =
    postData.data.score >= 1000
      ? `${(postData.data.score / 1000).toFixed(2)}k`
      : postData.data.score;

  const comments_score =
    postData.data.num_comments >= 1000
      ? `${(postData.data.num_comments / 1000).toFixed(2)}k`
      : postData.data.num_comments;

  const handelClick = (e) => {
    if (e.target.tagName !== "VIDEO") {
      console.log(postData.data);
      console.log(`https://www.troddit.com${postData.data.permalink}`);
    }
  };

  if (postData.data.is_gallery) {
    console.log(postData.data.media_metadata);
    console.log(postData.data.title);
    console.log("");
  }

  useEffect(() => {
    let videos = document.querySelectorAll(".video video");

    videos.forEach((video) => {
      const audio = video.querySelector("audio");
      video.onplay = () => audio.play();
      video.onpause = () => audio.pause();
      video.onseeking = () => (audio.currentTime = video.currentTime);
    });
  }, []);

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

      {postData.data.post_hint === "link" ? (
        <div className="link_block">
          <div className="image" style={{ backgroundImage: bgImgUrl }}>
            <a
              href={postData.data.url}
              target="_blank"
              rel="noreferrer"
              title={postData.data.url}
            >
              <img srcSet={imgSrcSet} alt="" />
            </a>
          </div>
          <div className="body">
            <div className="title">{postData.data.title}</div>
            <a
              href={postData.data.url}
              target="_blank"
              rel="noreferrer"
              className="link_text_wrapper"
              title={postData.data.url}
            >
              <div className="link_icon">
                <FaExternalLinkAlt />
              </div>
              <div className="link_text">
                {/* {postData.data.domain} */}
                {postData.data.url}
              </div>
            </a>
          </div>
        </div>
      ) : (
        <div className="title">{postData.data.title}</div>
      )}

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
            <audio controls>
              <source src={`${postData.data.url}/DASH_audio.mp4`} />
            </audio>
          </video>
        </div>
      ) : (
        ""
      )}

      {postData.data.selftext_html ? (
        <div
          className="self_text"
          dangerouslySetInnerHTML={{ __html: postData.data.selftext_html }}
        />
      ) : (
        ""
      )}

      <div className="numbers_info">
        <div className="score">
          <div className="icon">
            <HiOutlineArrowUp />
          </div>
          <div className="text">{score}</div>
        </div>
        <div className="ratio">
          <div className="icon">
            <HiOutlineHeart />
          </div>
          <div className="text">{postData.data.upvote_ratio * 100}%</div>
        </div>
        <div className="comments">
          <div className="icon">
            <HiOutlineChatBubbleLeft />
          </div>
          <div className="text">{comments_score}</div>
        </div>
        <div className="time_passed">
          <div className="icon">
            <HiOutlineClock />
          </div>
          <div className="text">{timeAgo(postData.data.created)}</div>
        </div>
      </div>
    </div>
  );
};

export default Post;
